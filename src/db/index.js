// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfYC1zUldsfQtlbyc4hIB8iotpU12_API",
  authDomain: "lit-share.firebaseapp.com",
  projectId: "lit-share",
  storageBucket: "lit-share.appspot.com",
  messagingSenderId: "775399411697",
  appId: "1:775399411697:web:1af2f736a71624d99f3e50",
  measurementId: "G-764JLHET81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore();
