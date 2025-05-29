import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">About FoodShare</h1>

                        <div className="prose max-w-none">
                            <p className="text-gray-600 mb-4">
                                FoodShare is a platform dedicated to reducing food waste and helping those in need by connecting food donors with people who need food assistance.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-4">
                                We believe that no good food should go to waste while people are going hungry. Our mission is to create a sustainable solution to food waste and hunger by building a community of donors and receivers.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">1. Donate Food</h3>
                                    <p className="text-gray-600">
                                        Individuals and businesses can easily list surplus food items they want to donate.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">2. Find Food</h3>
                                    <p className="text-gray-600">
                                        People in need can browse available food items and request what they need.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">3. Connect & Share</h3>
                                    <p className="text-gray-600">
                                        Our platform facilitates communication between donors and receivers to arrange pickups.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
                                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Whether you want to donate food or find food assistance, FoodShare makes it easy to make a difference in your community. Sign up today and be part of the solution!
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Sign Up Now
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={() => navigate('/login')}
                                    >
                                        Already have an account? Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage; 