import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';

interface RatingComment {
    rating: number;
    comment: string;
    userId: string;
    userName: string;
    createdAt: any;
}

interface FoodItem {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    status: string;
}

const ProfilePage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        address: currentUser?.location?.address || '',
        phoneNumber: currentUser?.phoneNumber || '',
        email: currentUser?.email || ''
    });

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser?.id) return;

            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.id));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        address: data.address || '',
                        phoneNumber: data.phoneNumber || ''
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        setError('');

        try {
            // Update user data in Firestore
            const userRef = doc(db, 'users', currentUser.id);
            await updateDoc(userRef, {
                name: formData.name,
                location: {
                    address: formData.address
                },
                phoneNumber: formData.phoneNumber,
                email: formData.email
            });

            // Show success message or redirect
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <Input
                                    label="Address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <div className="flex justify-end">
                                    <Button type="submit" variant="primary">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                                    <p className="text-gray-600">{currentUser.email}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                        <p className="mt-1">{currentUser.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                        <p className="mt-1">{currentUser.location?.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ratings Section */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Ratings</h2>
                        {userData?.ratingComments && userData.ratingComments.length > 0 ? (
                            <div className="space-y-6">
                                {userData.ratingComments.map((comment: RatingComment, index: number) => (
                                    <div key={index} className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-semibold">{comment.userName}</span>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {comment.createdAt instanceof Date
                                                    ? comment.createdAt.toLocaleDateString()
                                                    : comment.createdAt?.toDate?.()?.toLocaleDateString() || 'No date available'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{comment.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>No ratings yet</p>
                            </div>
                        )}
                    </div>

                    {/* Food Items Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Food Items</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userData?.foodItems?.map((item: FoodItem) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src={item.imageUrl || '/default-food.jpg'}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                        <p className="text-gray-600 mb-2">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-600 font-semibold">
                                                {item.status === 'available' ? 'Available' : 'Reserved'}
                                            </span>
                                            <Link
                                                to={`/food/${item.id}`}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage; 