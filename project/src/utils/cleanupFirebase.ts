import { db, storage } from '../config/firebase';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';

export const cleanupFirebase = async () => {
    try {
        console.log('Starting Firebase cleanup...');

        // 1. Delete all Firestore collections
        const collections = [
            'users',
            'foodItems',
            'chats',
            'activities',
            'reservations',
            'notifications'
        ];

        for (const collectionName of collections) {
            console.log(`Deleting ${collectionName} collection...`);
            const collectionRef = collection(db, collectionName);
            const snapshot = await getDocs(collectionRef);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log(`Deleted ${snapshot.size} documents from ${collectionName}`);
        }

        // 2. Delete all files from Storage
        console.log('Deleting files from Storage...');
        const storageRef = ref(storage);
        const { items } = await listAll(storageRef);
        const deleteStoragePromises = items.map(item => deleteObject(item));
        await Promise.all(deleteStoragePromises);
        console.log(`Deleted ${items.length} files from Storage`);

        console.log('Firebase cleanup completed successfully!');
    } catch (error) {
        console.error('Error during Firebase cleanup:', error);
        throw error;
    }
}; 