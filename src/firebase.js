import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDBsXvztz0o8LgDrFA-zSjgxEYTP6eAVok',
  authDomain: 'allstate-8f387.firebaseapp.com',
  databaseURL: 'https://allstate-8f387-default-rtdb.firebaseio.com',
  projectId: 'allstate-8f387',
  storageBucket: 'allstate-8f387.firebasestorage.app',
  messagingSenderId: '392598328075',
  appId: '', // We'll get this from Firebase Console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); 