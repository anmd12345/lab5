import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyByAaR7dI7Vg1a5Qm_YtJmml3NB0upWmOg',
  authDomain: 'lab5-89e8f.firebaseapp.com',
  projectId: 'lab5-89e8f',
  storageBucket: 'lab5-89e8f.appspot.com',
  messagingSenderId: '838153309719',
  appId: '1:838153309719:android:da265c21ea3f2270835652',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };