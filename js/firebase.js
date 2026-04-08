import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo7n9Nki8QIMgD37wGvEhtrl9n0raykgc",
  authDomain: "blockforge-mods.firebaseapp.com",
  projectId: "blockforge-mods",
  storageBucket: "blockforge-mods.firebasestorage.app",
  messagingSenderId: "320068220568",
  appId: "1:320068220568:web:580bbb2f348147480c02ed"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);