import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDBsXvztz0o8LgDrFA-zSjgxEYTP6eAVok',
  authDomain: 'allstate-8f387.firebaseapp.com',
  databaseURL: 'https://allstate-8f387-default-rtdb.firebaseio.com',
  projectId: 'allstate-8f387',
  storageBucket: 'allstate-8f387.appspot.com',
  messagingSenderId: '392598328075',
  appId: '', // You can add your appId here if needed
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app); 