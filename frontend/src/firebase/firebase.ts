import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBhQM7gs7iAoKwdWZPkYyo6HyA1HqMhaFM",
    authDomain: "synova-212a2.firebaseapp.com",
    projectId: "synova-212a2",
    storageBucket: "synova-212a2.firebasestorage.app",
    messagingSenderId: "700777523280",
    appId: "1:700777523280:web:2d8d25d28223a500028955"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);