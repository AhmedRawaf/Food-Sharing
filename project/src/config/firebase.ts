// Import Firebase core and service modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration Object
 * Contains all necessary configuration details to connect to Firebase services
 * These values are specific to your Firebase project and should be kept secure
 */
const firebaseConfig = {
  apiKey: "AIzaSyCvaar3GHY-nONsoM2P7IwSIuuyhxoUkes",
  authDomain: "food-sharing-e7168.firebaseapp.com",
  projectId: "food-sharing-e7168",
  storageBucket: "food-sharing-e7168.appspot.com",
  messagingSenderId: "812936460232",
  appId: "1:812936460232:web:dd72a871cbd2b10ef3f2fd",
  measurementId: "G-PML2KMXBYD"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Authentication service
export const auth = getAuth(app);

/**
 * Initialize Storage service with custom settings
 * These settings help handle network issues and retries
 */
const storage = getStorage(app);
// Set maximum retry time for operations to 10 seconds
storage.maxOperationRetryTime = 10000;
// Set maximum retry time for uploads to 10 seconds
storage.maxUploadRetryTime = 10000;

// Export initialized services for use throughout the application
export { storage };
export const db = getFirestore(app);