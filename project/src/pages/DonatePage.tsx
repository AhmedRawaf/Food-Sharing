import React, { useState, useEffect } from 'react';
import { PlusCircle, Camera, Clock, Calendar } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';

/**
 * DonatePage Component
 * 
 * This component allows users to:
 * - Create new food donations
 * - Upload food images
 * - Specify food details and dietary information
 * - Set pickup location and expiry date
 */
const DonatePage: React.FC = () => {
  // Get authentication state and loading status
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiryDate: '',
    category: '',
    dietaryInfo: [] as string[],
    imageFile: null as File | null,
    imageUrl: '',
    location: ''
  });

  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Effect hook to handle authentication
   * Redirects to login if user is not authenticated
   */
  useEffect(() => {
    if (!authLoading && !currentUser) {
      console.log('No authenticated user found, redirecting to login');
      navigate('/login');
      return;
    }
  }, [currentUser, authLoading, navigate]);

  /**
   * Handle form input changes
   * Updates form data state with new values
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle file input changes
   * Updates form data with selected file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  /**
   * Handle dietary information changes
   * Toggles dietary restrictions in the form data
   */
  const handleDietaryChange = (diet: string) => {
    setFormData(prev => {
      if (prev.dietaryInfo.includes(diet)) {
        return {
          ...prev,
          dietaryInfo: prev.dietaryInfo.filter(d => d !== diet)
        };
      } else {
        return {
          ...prev,
          dietaryInfo: [...prev.dietaryInfo, diet]
        };
      }
    });
  };

  /**
   * Handle form submission
   * - Validates user authentication
   * - Creates food item in Firestore
   * - Records activity
   * - Handles success and error states
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use a default image URL based on the food category
      let imageUrl = '';
      switch (formData.category) {
        case 'prepared':
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
          break;
        case 'fresh':
          imageUrl = 'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg';
          break;
        case 'packaged':
          imageUrl = 'https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg';
          break;
        case 'canned':
          imageUrl = 'https://images.pexels.com/photos/4033312/pexels-photo-4033312.jpeg';
          break;
        case 'frozen':
          imageUrl = 'https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg';
          break;
        default:
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
      }

      // Create food item in Firestore
      const foodItemsRef = collection(db, 'foodItems');
      const donationData = {
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity,
        expiryDate: new Date(formData.expiryDate),
        category: formData.category,
        dietaryInfo: formData.dietaryInfo,
        imageUrl: imageUrl,
        donorId: currentUser.id,
        donorName: currentUser.name,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
        location: formData.location
      };

      console.log('Creating donation with data:', donationData);
      const newDonation = await addDoc(foodItemsRef, donationData);
      console.log('Donation created with ID:', newDonation.id);

      // Record activity
      const activitiesRef = collection(db, 'activities');
      await addDoc(activitiesRef, {
        userId: currentUser.id,
        type: 'donation',
        description: `Donated "${formData.title}"`,
        timestamp: new Date()
      });

      alert('Donation created successfully!');
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error creating food donation:', error);
      alert(error.message || 'Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate tomorrow's date for the min date in the expiry date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  // Show loading state while checking auth
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

  // Only show the form if user is authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donate Food</h1>
            <p className="text-gray-600 max-w-3xl">
              Share your surplus food with those who need it. Fill out the form below to list food items you'd like to donate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {isSuccess ? (
                  // Success Message
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <PlusCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Listed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                      Your food donation has been listed and is now visible to people in your area.
                    </p>
                    <Button variant="primary" onClick={() => setIsSuccess(false)}>
                      List Another Donation
                    </Button>
                  </div>
                ) : (
                  // Donation Form
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h2>

                    <div className="space-y-6">
                      {/* Title Input */}
                      <Input
                        label="Food Item Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="E.g., Homemade Vegetable Soup, Fresh Apples, etc."
                        required
                        fullWidth
                      />

                      {/* Description Textarea */}
                      <div className="w-full mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the food, how it was stored, when it was made, etc."
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          rows={4}
                          required
                        ></textarea>
                      </div>

                      {/* Quantity Input */}
                      <Input
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="E.g., 2 liters, 500g, 3 portions, etc."
                        required
                        fullWidth
                      />

                      {/* Location Input */}
                      <Input
                        label="Pickup Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter the address where the food can be picked up"
                        required
                        fullWidth
                      />

                      {/* Category & Expiry Date (side by side on larger screens) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="prepared">Prepared Food</option>
                            <option value="fresh">Fresh Produce</option>
                            <option value="packaged">Packaged Food</option>
                            <option value="canned">Canned Food</option>
                            <option value="frozen">Frozen Food</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <Input
                          label="Expiry Date"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          min={tomorrowString}
                          required
                          fullWidth
                          leftIcon={<Calendar className="h-5 w-5" />}
                        />
                      </div>

                      {/* Dietary Information */}
                      <div className="w-full mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Dietary Information (Optional)
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Organic', 'Halal'].map((diet) => (
                            <label key={diet} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dietaryInfo.includes(diet)}
                                onChange={() => handleDietaryChange(diet)}
                                className="rounded text-green-600 focus:ring-green-500 mr-1"
                              />
                              <span className="text-sm">{diet}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          isLoading={isSubmitting}
                          leftIcon={<PlusCircle className="h-5 w-5" />}
                        >
                          List Donation
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            {/* Sidebar with Guidelines */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-green-50 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Donation Guidelines</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Acceptable Food Items</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Fresh produce and fruits</li>
                      <li>Unopened packaged foods</li>
                      <li>Canned goods within expiration date</li>
                      <li>Home-cooked meals (prepared safely)</li>
                      <li>Baked goods (within 2-3 days)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Food Safety</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Ensure all food is safe to consume</li>
                      <li>Home-cooked foods should be properly stored</li>
                      <li>Include accurate expiry information</li>
                      <li>List all ingredients for allergy concerns</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">We Cannot Accept</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Expired or spoiled food</li>
                      <li>Open packages (unless specified)</li>
                      <li>Alcoholic beverages</li>
                      <li>Foods that require strict temperature control without proper storage</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-700">
                      Please be respectful and only donate food you would be comfortable eating yourself. Thank you for your contribution!
                    </p>
                  </div>
                </div>
              </Card>

              <div className="mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Have questions about donating food through our platform? Check out our FAQ or contact us directly.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth>
                      View FAQ
                    </Button>
                    <Button variant="ghost" fullWidth>
                      Contact Support
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;