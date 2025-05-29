import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { FoodItem } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface FoodItemCardProps {
  foodItem: FoodItem;
  onReserve?: (id: string) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ foodItem, onReserve }) => {
  // Calculate days until expiry
  const daysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(foodItem.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format expiry date
  const formatExpiryDate = () => {
    const date = new Date(foodItem.expiryDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get appropriate status color
  const getStatusColor = () => {
    const days = daysUntilExpiry();

    if (foodItem.status !== 'available') {
      return 'bg-gray-500 text-white';
    } else if (days <= 1) {
      return 'bg-red-500 text-white';
    } else if (days <= 3) {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-green-500 text-white';
    }
  };

  // Get appropriate status text
  const getStatusText = () => {
    if (foodItem.status === 'reserved') return 'Reserved';
    if (foodItem.status === 'collected') return 'Collected';

    const days = daysUntilExpiry();
    if (days <= 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
  };

  // Get category badge color
  const getCategoryColor = () => {
    switch (foodItem.category) {
      case 'prepared': return 'bg-blue-100 text-blue-800';
      case 'packaged': return 'bg-purple-100 text-purple-800';
      case 'fresh': return 'bg-green-100 text-green-800';
      case 'canned': return 'bg-yellow-100 text-yellow-800';
      case 'frozen': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="relative">
        <img
          src={foodItem.imageUrl || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'}
          alt={foodItem.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className={`absolute top-2 right-2 ${getStatusColor()} px-2 py-1 rounded-full text-xs font-medium`}>
          {getStatusText()}
        </div>
      </div>

      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{foodItem.title}</h3>
          <span className={`${getCategoryColor()} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
            {foodItem.category}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{foodItem.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">Location:</span>
            <span className="ml-1">{foodItem.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Best before: {formatExpiryDate()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>Posted: {new Date(foodItem.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          <p>Donated by: {foodItem.donorName}</p>
        </div>

        {foodItem.dietaryInfo.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {foodItem.dietaryInfo.map((info, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {info}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-3">
        {foodItem.status === 'available' ? (
          <Button
            variant="primary"
            fullWidth
            onClick={() => onReserve && onReserve(foodItem.id)}
          >
            Reserve
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            disabled={true}
          >
            {foodItem.status === 'reserved' ? 'Reserved' : 'Collected'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodItemCard;