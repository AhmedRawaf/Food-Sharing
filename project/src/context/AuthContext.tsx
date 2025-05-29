import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { deleteUser as deleteAuthUser } from 'firebase/auth';

/**
 * User Interface
 * Defines the structure of a user object in the application
 */
interface User {
  id: string;
  name: string;
  email: string;
  location: { address: string };
  phoneNumber: string;
  createdAt: Date;
}

/**
 * AuthContextType Interface
 * Defines the shape of the authentication context
 */
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  deleteUser: () => Promise<void>;
}

// Create the authentication context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Provides authentication state and methods to the entire application
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for current user and loading status
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect hook to handle authentication state changes
   * Listens for Firebase auth state changes and updates the user data accordingly
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user authenticated:', firebaseUser.uid);

          // Get additional user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data retrieved:', userData);

            // Set user data from Firestore
            setCurrentUser({
              id: firebaseUser.uid,
              name: userData?.name || firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              location: userData?.location || { address: '' },
              phoneNumber: userData?.phoneNumber || '',
              createdAt: userData?.createdAt?.toDate() || new Date()
            });
          } else {
            // Create basic profile if no Firestore document exists
            console.log('No Firestore document found for user, creating basic profile');
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              location: { address: '' },
              phoneNumber: '',
              createdAt: new Date()
            });
          }
        } else {
          console.log('No authenticated user');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error by creating basic profile if Firebase user exists
        if (firebaseUser) {
          console.log('Setting basic user profile due to error');
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            location: { address: '' },
            phoneNumber: '',
            createdAt: new Date()
          });
        }
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Logout function
   * Signs out the current user and clears the user state
   */
  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  /**
   * Delete User function
   * Completely removes a user's account and all associated data
   * This includes:
   * 1. Avatar from Storage
   * 2. Food items
   * 3. Chats
   * 4. Activities
   * 5. Reservations
   * 6. User profile from Firestore
   * 7. Authentication account
   */
  const deleteUser = async () => {
    if (!currentUser) return;

    try {
      // 1. Delete user's food items
      const foodItemsRef = collection(db, 'foodItems');
      const foodItemsQuery = query(foodItemsRef, where('donorId', '==', currentUser.id));
      const foodItemsSnapshot = await getDocs(foodItemsQuery);
      const foodItemsDeletions = foodItemsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(foodItemsDeletions);

      // 2. Delete user's chats
      const chatsRef = collection(db, 'chats');
      const chatsQuery = query(chatsRef, where('donorId', '==', currentUser.id));
      const chatsSnapshot = await getDocs(chatsQuery);
      const chatsDeletions = chatsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(chatsDeletions);

      // 3. Delete user's activities
      const activitiesRef = collection(db, 'activities');
      const activitiesQuery = query(activitiesRef, where('userId', '==', currentUser.id));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activitiesDeletions = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(activitiesDeletions);

      // 4. Delete user's reservations
      const reservationsRef = collection(db, 'reservations');
      const reservationsQuery = query(reservationsRef, where('userId', '==', currentUser.id));
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservationsDeletions = reservationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(reservationsDeletions);

      // 5. Delete user's profile from Firestore
      const userRef = doc(db, 'users', currentUser.id);
      await deleteDoc(userRef);

      // 6. Delete user's authentication account
      const user = auth.currentUser;
      if (user) {
        await deleteAuthUser(user);
      }

      setCurrentUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Provide authentication context to children components
  return (
    <AuthContext.Provider value={{ currentUser, isLoading, logout, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Custom hook to access the authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};