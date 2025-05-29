import React from 'react';
import FoodItemCard from './FoodItemCard';
import { FoodItem } from '../../types';

interface FoodGridProps {
  foodItems: FoodItem[];
  onReserve?: (id: string) => void;
}

const FoodGrid: React.FC<FoodGridProps> = ({ foodItems, onReserve }) => {
  if (foodItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No food items available</h3>
        <p className="mt-2 text-gray-500">Check back later for new donations or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {foodItems.map((item) => (
        <FoodItemCard key={item.id} foodItem={item} onReserve={onReserve} />
      ))}
    </div>
  );
};

export default FoodGrid;