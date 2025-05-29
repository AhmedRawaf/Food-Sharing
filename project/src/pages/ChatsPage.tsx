import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, getDoc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatWindow from '../components/chat/ChatWindow';
import RatingModal from '../components/rating/RatingModal';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface Chat {
    id: string;
    foodItemTitle: string;
    donorId: string;
    donorName: string;
    receiverId: string;
    receiverName: string;
    lastMessage?: {
        text: string;
        timestamp: any;
    };
    status?: 'pending' | 'received' | 'completed';
    donorPhotoURL?: string;
    donorEmail?: string;
    isRated: boolean;
}

const ChatsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<{ id: string; name: string } | null>(null);
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('chatId');
    const [showChatList, setShowChatList] = useState(true);
    const [lastRatedChatId, setLastRatedChatId] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser?.id) return;

        const chatsRef = collection(db, 'chats');
        const q = query(
            chatsRef,
            where('participants.' + currentUser.id, '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newChats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Chat));
            setChats(newChats);
            setIsLoading(false);

            // If there's a chatId in the URL and we haven't selected a chat yet
            if (chatId && !selectedChat) {
                const chatToSelect = newChats.find(chat => chat.id === chatId);
                if (chatToSelect) {
                    setSelectedChat(chatToSelect);
                    setShowChatList(false);
                }
            }
        });

        return () => unsubscribe();
    }, [currentUser, chatId]);

    const handleDeleteChat = async (chatId: string) => {
        if (!currentUser) return;

        try {
            // Delete the chat document
            await deleteDoc(doc(db, 'chats', chatId));

            // Delete all messages in the chat
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const messagesSnapshot = await getDocs(messagesRef);
            const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // If there was a selected chat being deleted, clear it
            if (selectedChat?.id === chatId) {
                setSelectedChat(null);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            alert('Failed to delete chat. Please try again.');
        }
    };

    const handleMarkAsReceived = async (chat: Chat) => {
        if (!currentUser?.id) return;

        try {
            // Update chat status in database
            const chatRef = doc(db, 'chats', chat.id);
            await updateDoc(chatRef, {
                status: 'received'
            });

            // Update local state
            setChats(prevChats =>
                prevChats.map(c =>
                    c.id === chat.id
                        ? { ...c, status: 'received' }
                        : c
                )
            );

            // Update selected chat if it's the current one
            if (selectedChat?.id === chat.id) {
                setSelectedChat(prev => prev ? { ...prev, status: 'received' } : null);
            }

            // Create activity for marking food as received
            const activitiesRef = collection(db, 'activities');
            await addDoc(activitiesRef, {
                type: 'received',
                userId: currentUser.id,
                userName: currentUser.name,
                targetUserId: chat.donorId,
                targetUserName: chat.donorName,
                foodItemTitle: chat.foodItemTitle,
                createdAt: new Date()
            });

            // Show success message
            alert('Food marked as received successfully!');
        } catch (error) {
            console.error('Error marking chat as received:', error);
            alert('Failed to mark food as received. Please try again.');
        }
    };

    const handleBackToChats = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedChat(null);
        setShowChatList(true);
        // Clear the last rated chat ID
        setLastRatedChatId(null);
    };

    const handleChatSelect = (chat: Chat) => {
        // Don't select the chat if it was just rated
        if (chat.id === lastRatedChatId) {
            setShowChatList(true);
            return;
        }
        setSelectedChat(chat);
        setShowChatList(false);
    };

    const handleRatingSubmit = async (rating: number, comment: string) => {
        console.log('Current user:', currentUser);
        console.log('Selected donor:', selectedDonor);

        if (!selectedDonor || !currentUser?.id) {
            console.error('Missing required data:', { selectedDonor, currentUser });
            return;
        }

        try {
            console.log('Starting rating submission for donor:', selectedDonor.id);

            // Update donor's document with the new rating
            const donorRef = doc(db, 'users', selectedDonor.id);
            const donorDoc = await getDoc(donorRef);

            if (donorDoc.exists()) {
                const donorData = donorDoc.data();
                console.log('Current donor data:', donorData);

                const currentRatings = donorData.ratings || [];
                const currentRatingComments = donorData.ratingComments || [];

                // Add new rating and comment
                const newRatings = [...currentRatings, rating];
                const newRatingComment = {
                    rating,
                    comment,
                    userId: currentUser.id,
                    userName: currentUser.name,
                    createdAt: Timestamp.now()
                };
                const newRatingComments = [...currentRatingComments, newRatingComment];

                // Calculate new average rating
                const averageRating = newRatings.reduce((a, b) => a + b, 0) / newRatings.length;

                console.log('Updating donor document with:', {
                    ratings: newRatings,
                    ratingComments: newRatingComments,
                    averageRating
                });

                // Update donor's document in a single operation
                await updateDoc(donorRef, {
                    ratings: newRatings,
                    ratingComments: newRatingComments,
                    averageRating
                });

                // Update chat status to completed and mark as rated
                if (selectedChat) {
                    console.log('Updating chat status:', selectedChat.id);
                    const chatRef = doc(db, 'chats', selectedChat.id);
                    await updateDoc(chatRef, {
                        status: 'completed',
                        isRated: true
                    });

                    // Update local state
                    setChats(prevChats =>
                        prevChats.map(chat =>
                            chat.id === selectedChat.id
                                ? { ...chat, status: 'completed', isRated: true }
                                : chat
                        )
                    );

                    // Store the ID of the chat that was just rated
                    setLastRatedChatId(selectedChat.id);
                }

                // Reset all states
                setShowRatingModal(false);
                setSelectedDonor(null);
                setSelectedChat(null);
                setShowChatList(true);

                // Show success message
                alert('Rating submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating. Please try again.');
        }
    };

    if (isLoading) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* Chat List */}
                        <div className={`md:col-span-1 bg-white rounded-lg shadow-md p-3 sm:p-4 ${!showChatList ? 'hidden md:block' : 'block'}`}>
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Chats</h2>
                            <div className="space-y-2">
                                {chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`p-2 sm:p-3 rounded-lg transition-colors cursor-pointer ${selectedChat?.id === chat.id
                                            ? 'bg-green-50 border-green-500'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleChatSelect(chat);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={chat.donorPhotoURL || '/default-avatar.png'}
                                                    alt={chat.donorName}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                                />
                                                <div>
                                                    <Link
                                                        to={`/donor/${chat.donorId}`}
                                                        className="text-base sm:text-lg font-semibold hover:text-blue-600"
                                                    >
                                                        {chat.donorName}
                                                    </Link>
                                                    <p className="text-xs sm:text-sm text-gray-500">{chat.donorEmail}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteChat(chat.id);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600">Re: {chat.foodItemTitle}</p>
                                        {chat.lastMessage && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {chat.lastMessage.text.substring(0, 30)}...
                                            </p>
                                        )}
                                        {chat.status === 'received' && currentUser?.id !== chat.donorId && !chat.isRated && (
                                            <div className="mt-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDonor({
                                                            id: chat.donorId,
                                                            name: chat.donorName
                                                        });
                                                        setShowRatingModal(true);
                                                    }}
                                                >
                                                    Rate Donor
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Window */}
                        {selectedChat && (
                            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-3 sm:p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handleBackToChats}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ← Back to Chats
                                    </button>
                                    {selectedChat.status === 'pending' && currentUser?.id === selectedChat.receiverId && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleMarkAsReceived(selectedChat)}
                                        >
                                            Mark as Received
                                        </Button>
                                    )}
                                </div>
                                <ChatWindow
                                    chatId={selectedChat.id}
                                    otherUserName={selectedChat.donorName}
                                    foodItemTitle={selectedChat.foodItemTitle}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Rating Modal */}
            {showRatingModal && selectedDonor && (
                <RatingModal
                    isOpen={showRatingModal}
                    donorName={selectedDonor.name}
                    onSubmit={handleRatingSubmit}
                    onClose={() => {
                        setShowRatingModal(false);
                        setSelectedDonor(null);
                    }}
                />
            )}

            <Footer />
        </div>
    );
};

export default ChatsPage;