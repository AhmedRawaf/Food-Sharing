import React from 'react';
import { ArrowRight, Apple, Coffee, Package, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

/**
 * HomePage Component
 * The main landing page of the application that showcases the food sharing platform
 * Includes sections for hero banner, how it works, food types, and call-to-action
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section with gradient background and call-to-action buttons */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Share Food, Reduce Waste, Build Community
              </h1>
              <p className="text-lg md:text-xl mb-6 text-green-100">
                Connect with neighbors to share surplus food and reduce waste. Together, we can fight hunger and build a more sustainable community.
              </p>
              {/* Call-to-action buttons for donating and finding food */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/donate')}
                >
                  Donate Food
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-white text-white hover:bg-white hover:text-green-700"
                  onClick={() => navigate('/find')}
                >
                  Find Food
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Explains the platform's process */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                FoodShare makes it easy to share surplus food with those who need it in your community.
              </p>
            </div>

            {/* Three-step process cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Step 1: List Food */}
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-orange-100 rounded-full p-4 inline-flex mb-4">
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">List Your Food</h3>
                <p className="text-gray-600">
                  Snap a photo, add details about your surplus food, and share it with the community.
                </p>
              </div>
              {/* Step 2: Connect */}
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 rounded-full p-4 inline-flex mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Locally</h3>
                <p className="text-gray-600">
                  Recipients can search and find available food nearby and reserve items they need.
                </p>
              </div>
              {/* Step 3: Safe Handoff */}
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe Handoff</h3>
                <p className="text-gray-600">
                  Arrange pickup or delivery according to your preferences and complete the food sharing process.
                </p>
              </div>
            </div>

            {/* Learn More button */}
            <div className="text-center mt-8 md:mt-12">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Food Types Section - Showcases different types of food that can be shared */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Share Any Type of Food</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                From fresh produce to canned goods, share food that would otherwise go to waste.
              </p>
            </div>
            {/* Food type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Fresh Produce Card */}
              <Card hoverable className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-4">
                    <Apple className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Produce</h3>
                <p className="text-gray-600">
                  Fruits and vegetables from your garden or surplus from grocery trips.
                </p>
              </Card>
              {/* Packaged Food Card */}
              <Card hoverable className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-100 rounded-full p-4">
                    <Package className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Packaged Food</h3>
                <p className="text-gray-600">
                  Unopened non-perishable items, canned goods, and pantry staples.
                </p>
              </Card>
              {/* Prepared Meals Card */}
              <Card hoverable className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 rounded-full p-4">
                    <Coffee className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prepared Meals</h3>
                <p className="text-gray-600">
                  Leftover meals, baked goods, and restaurant surplus within safety guidelines.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section - Encourages user signup */}
        <section className="py-12 md:py-16 bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Reduce Food Waste?</h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
              Join our growing community today and start sharing or receiving food in your neighborhood.
            </p>
            {/* Sign up and learn more buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="bg-green-600 text-white hover:bg-green-700 sm:w-auto shadow-lg transform transition-transform duration-200 hover:scale-105"
                onClick={() => navigate('/signup')}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="border-2 border-white text-white hover:bg-orange-600 sm:w-auto"
                onClick={() => navigate('/about')}
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;