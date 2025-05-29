import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/Card';

interface Rating {
    rating: number;
    comment: string;
    userId: string;
    userName: string;
    createdAt: any;
}

interface DonorData {
    name: string;
    ratings: number[];
    ratingComments: Rating[];
    averageRating: number;
}

const DonorProfilePage: React.FC = () => {
    const { donorId } = useParams<{ donorId: string }>();
    const { currentUser } = useAuth();
    const [donorData, setDonorData] = useState<DonorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonorData = async () => {
            if (!donorId) return;

            try {
                const donorRef = doc(db, 'users', donorId);
                const donorDoc = await getDoc(donorRef);

                if (donorDoc.exists()) {
                    const data = donorDoc.data() as DonorData;
                    setDonorData(data);
                } else {
                    setError('Donor not found');
                }
            } catch (error) {
                console.error('Error fetching donor data:', error);
                setError('Failed to load donor data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonorData();
    }, [donorId]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-gray-600">Loading donor profile...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-red-600">{error}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!donorData) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-gray-600">No donor data available</p>
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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{donorData.name}'s Profile</h1>
                        <div className="mt-4 flex items-center">
                            <div className="text-2xl font-semibold text-gray-900">
                                Average Rating: {donorData.averageRating?.toFixed(1) || 'No ratings yet'}
                            </div>
                            <div className="ml-4 text-gray-600">
                                ({donorData.ratings?.length || 0} ratings)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {donorData.ratingComments?.map((rating, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {rating.rating} ★
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">{rating.userName}</p>
                                            <p className="text-sm text-gray-500">
                                                {rating.createdAt instanceof Date
                                                    ? rating.createdAt.toLocaleDateString()
                                                    : rating.createdAt?.toDate?.()?.toLocaleDateString() || 'No date available'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {rating.comment && (
                                    <p className="text-gray-600 mt-2">{rating.comment}</p>
                                )}
                            </Card>
                        ))}
                    </div>

                    {(!donorData.ratingComments || donorData.ratingComments.length === 0) && (
                        <p className="text-center text-gray-600">No ratings yet</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DonorProfilePage; 