import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, addDoc, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Timestamp;
    senderName: string;
}

interface ChatWindowProps {
    chatId: string;
    otherUserName: string;
    foodItemTitle: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, otherUserName, foodItemTitle }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(newMessages);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            // Add message to messages subcollection
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const messageData = {
                text: newMessage.trim(),
                senderId: currentUser.id,
                senderName: currentUser.name,
                timestamp: new Date()
            };
            await addDoc(messagesRef, messageData);

            // Update last message in chat document
            const chatRef = doc(db, 'chats', chatId);
            await updateDoc(chatRef, {
                lastMessage: {
                    text: newMessage.trim(),
                    timestamp: new Date()
                }
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px] sm:h-[600px] bg-white rounded-lg shadow-md">
                <p className="text-gray-600">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[400px] sm:h-[600px] bg-white rounded-lg shadow-md">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b">
                <h3 className="text-base sm:text-lg font-medium">Chat with {otherUserName}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Re: {foodItemTitle}</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${message.senderId === currentUser?.id
                                ? 'bg-green-500 text-white'
                                : message.senderId === 'system'
                                    ? 'bg-gray-200 text-gray-700 italic'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            <p className="text-xs sm:text-sm break-words">{message.text}</p>
                            <span className="text-[10px] sm:text-xs opacity-75">
                                {message.senderName}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow; 