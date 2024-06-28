import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBuyoGzKyUP8LUJAZGGP_9mBvpK0J994hY",
    authDomain: "statusnotif-27b36.firebaseapp.com",
    projectId: "statusnotif-27b36",
    storageBucket: "statusnotif-27b36.appspot.com",
    messagingSenderId: "349619645005",
    appId: "1:349619645005:web:ec53247d26e64ed0eeca04"
  };
 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
