import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import Rating from '../components/rating/Rating.tsx';

/**
 * DonorData Interface
 * Defines the structure of donor data including their rating
 */
interface DonorData {
  averageRating?: number;
  // Add other donor properties as needed
}

interface FoodItem {
  id: string;
  title: string;
  description: string;
  quantity: string;
  expiryDate: Date | string | Timestamp;
  location: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhotoURL?: string;
  donorRating?: number;
  createdAt: any;
  status: string;
  category: string;
  dietaryInfo: string[];
}
const FindFoodPage: React.FC = () => {
  // Get authentication state and loading status
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = searchParams.get('search') || '';
  useEffect(() => {
    if (!authLoading && !currentUser) {
      console.log('No authenticated user, redirecting to login');
      navigate('/login');
      return;
    }

    if (currentUser) {
      const fetchFoodItems = async () => {
        try {
          setIsLoading(true);
          console.log('Fetching food items for user:', currentUser.id);

          // Query available food items
          const foodItemsRef = collection(db, 'foodItems');
          const q = query(foodItemsRef, where('status', '==', 'available'));
          const querySnapshot = await getDocs(q);

          // Fetch donor ratings for each item
          const itemsWithRatings = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data() as FoodItem;
              // Fetch donor's rating
              const donorRef = doc(db, 'users', data.donorId);
              const donorDoc = await getDoc(donorRef);
              const donorData = donorDoc.data() as DonorData;

              return {
                ...data,
                id: docSnapshot.id,
                donorRating: donorData?.averageRating || 0
              } as FoodItem;
            })
          );

          // Filter out current user's items
          const filteredItems = itemsWithRatings.filter(item => item.donorId !== currentUser?.id);

          // Filter items based on search query if present
          const finalItems = searchQuery
            ? filteredItems.filter(item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : filteredItems;

          console.log('Filtered items:', finalItems);
          setFoodItems(finalItems);
        } catch (error) {
          console.error('Error fetching food items:', error);
          setError('Failed to load food items. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFoodItems();
    }
  }, [currentUser?.id, searchQuery]);

  /**
   * Handle food item reservation
   * - Updates food item status
   * - Creates a reservation record
   * - Creates a new chat
   * - Adds a system message
   * - Navigates to the chat
   */
  const handleReserve = async (foodItem: FoodItem) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      // 1. Update food item status
      const foodItemRef = doc(db, 'foodItems', foodItem.id);
      await updateDoc(foodItemRef, {
        status: 'reserved',
        reservedBy: currentUser.id,
        reservedAt: new Date()
      });

      // 2. Create a reservation document
      const reservationsRef = collection(db, 'reservations');
      await addDoc(reservationsRef, {
        foodItemId: foodItem.id,
        foodItemTitle: foodItem.title,
        userId: currentUser.id,
        userName: currentUser.name,
        donorId: foodItem.donorId,
        donorName: foodItem.donorName,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 3. Create a new chat
      const chatRef = collection(db, 'chats');
      const newChat = await addDoc(chatRef, {
        foodItemId: foodItem.id,
        foodItemTitle: foodItem.title,
        donorId: foodItem.donorId,
        donorName: foodItem.donorName,
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        participants: {
          [foodItem.donorId]: true,
          [currentUser.id]: true
        },
        status: 'pending',
        createdAt: new Date()
      });

      // 4. Add first system message
      const messagesRef = collection(db, 'chats', newChat.id, 'messages');
      await addDoc(messagesRef, {
        text: `${currentUser.name} has reserved ${foodItem.title}`,
        senderId: 'system',
        senderName: 'System',
        timestamp: new Date()
      });

      // 5. Navigate to chat immediately with the new chat ID
      navigate(`/chats?chatId=${newChat.id}`);

    } catch (error) {
      console.error('Error reserving food:', error);
      alert('Failed to reserve food. Please try again.');
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Food</h1>
            <p className="text-gray-600 mt-2">Browse available food donations in your area</p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <p className="text-center text-gray-600">Loading available food items...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : foodItems.length === 0 ? (
            <p className="text-center text-gray-600">No food items available at the moment.</p>
          ) : (
            /* Food Items Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <Card key={item.id} className="p-6">
                  {/* Item Title and Donor Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      <Rating rating={item.donorRating || 0} />
                      <span className="text-sm text-gray-500">
                        ({item.donorRating?.toFixed(1) || '0.0'})
                      </span>
                    </div>
                  </div>

                  {/* Item Description */}
                  <p className="text-gray-600 mb-4">{item.description}</p>

                  {/* Item Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    <p><span className="font-medium">Expiry Date:</span> {
                      item.expiryDate instanceof Timestamp
                        ? item.expiryDate.toDate().toLocaleDateString()
                        : item.expiryDate instanceof Date
                          ? item.expiryDate.toLocaleDateString()
                          : new Date(item.expiryDate).toLocaleDateString()
                    }</p>
                    <p><span className="font-medium">Location:</span> {item.location}</p>
                  </div>

                  {/* Donor Info and Reserve Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.donorPhotoURL || '/default-avatar.png'}
                        alt={item.donorName}
                        className="w-8 h-8 rounded-full"
                      />
                      <Link
                        to={`/donor/${item.donorId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {item.donorName}
                      </Link>
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleReserve(item)}
                    >
                      Reserve
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindFoodPage;