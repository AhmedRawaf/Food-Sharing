export interface User {
  id: string;
  name: string;
  email: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  phoneNumber?: string;
  createdAt: Date;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  quantity: string;
  expiryDate: Date;
  category: 'prepared' | 'packaged' | 'fresh' | 'canned' | 'frozen' | 'other';
  dietaryInfo: string[];
  imageUrl?: string;
  donorId: string;
  donorName: string;
  status: 'available' | 'reserved' | 'collected';
  createdAt: Date;
  updatedAt: Date;
  reservedBy?: string;
  reservedAt?: Date;
  location: string;
}

export interface Reservation {
  id: string;
  foodItemId: string;
  foodItemTitle: string;
  userId: string;
  userName: string;
  donorId: string;
  donorName: string;
  status: 'pending' | 'collected' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}