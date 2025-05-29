import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Package, Clock, MapPin } from 'lucide-react';

interface FoodItem {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: any;
    donorId: string;
}

interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: any;
    userId: string;
}

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [donations, setDonations] = useState<FoodItem[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching dashboard data for user:', currentUser.id);

                // Fetch donations
                console.log('Fetching donations...');
                const donationsRef = collection(db, 'foodItems');
                const donationsQuery = query(donationsRef);
                const donationsSnapshot = await getDocs(donationsQuery);
                console.log('Donations query completed. Number of documents:', donationsSnapshot.size);

                const userDonations = donationsSnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as FoodItem))
                    .filter(item => item.donorId === currentUser.id);
                console.log('Filtered donations:', userDonations);
                setDonations(userDonations);

                // Fetch activities
                console.log('Fetching activities...');
                const activitiesRef = collection(db, 'activities');
                const activitiesQuery = query(activitiesRef);
                const activitiesSnapshot = await getDocs(activitiesQuery);
                console.log('Activities query completed. Number of documents:', activitiesSnapshot.size);

                const userActivities = activitiesSnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Activity))
                    .filter(activity => activity.userId === currentUser.id);
                console.log('Filtered activities:', userActivities);
                setActivities(userActivities);

            } catch (error) {
                console.error('Detailed error fetching dashboard data:', error);
                if (error instanceof Error) {
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                }
                setError('Failed to load dashboard data. Please try refreshing the page.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser, navigate]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {currentUser.name}!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Donations */}
                        <Card className="p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <Package className="h-6 w-6 text-green-600 mr-2" />
                                <h2 className="text-xl font-semibold">Recent Donations</h2>
                            </div>
                            <div className="flex-grow overflow-y-auto max-h-[400px]">
                                {isLoading ? (
                                    <p className="text-gray-600">Loading donations...</p>
                                ) : donations.length === 0 ? (
                                    <p className="text-gray-600">No donations yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {donations.map(donation => (
                                            <div key={donation.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                                <h3 className="font-medium text-gray-900">{donation.title}</h3>
                                                <p className="text-sm text-gray-600">{donation.description}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <span className="capitalize">{donation.category}</span>
                                                    <span className="mx-2">•</span>
                                                    <span className="capitalize">{donation.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <Clock className="h-6 w-6 text-green-600 mr-2" />
                                <h2 className="text-xl font-semibold">Recent Activity</h2>
                            </div>
                            <div className="flex-grow overflow-y-auto max-h-[400px]">
                                {isLoading ? (
                                    <p className="text-gray-600">Loading activities...</p>
                                ) : activities.length === 0 ? (
                                    <p className="text-gray-600">No recent activity.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {activities.map(activity => (
                                            <div key={activity.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                                <p className="text-gray-900">{activity.description}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {activity.timestamp?.toDate ?
                                                        activity.timestamp.toDate().toLocaleDateString() + ' at ' + activity.timestamp.toDate().toLocaleTimeString() :
                                                        'No timestamp available'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Location Settings */}
                        <Card className="p-6">
                            <div className="flex items-center mb-4">
                                <MapPin className="h-6 w-6 text-green-600 mr-2" />
                                <h2 className="text-xl font-semibold">Location Settings</h2>
                            </div>
                            <p className="text-gray-600">{currentUser.location.address || 'No address set'}</p>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardPage; 