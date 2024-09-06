import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDduYcJx7QFTbs1SXCaoHzS2_n4-38cn3g",
  authDomain: "chat-bot-app-54837.firebaseapp.com",
  projectId: "chat-bot-app-54837",
  storageBucket: "chat-bot-app-54837.appspot.com",
  messagingSenderId: "338685874227",
  appId: "1:338685874227:web:cd7d2eb7b53d1ed2111346",
  measurementId: "G-CGB0YYFRQ5",
  databaseURL: 'https://chat-bot-app-54837-default-rtdb.firebaseio.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, remove };
