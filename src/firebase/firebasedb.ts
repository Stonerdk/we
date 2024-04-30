// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import admin from "firebase-admin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXTJS_FIREBASE_API_KEY,
  authDomain: process.env.NEXTJS_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXTJS_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXTJS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXTJS_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXTJS_FIREBASE_APP_ID,
  measurementId: process.env.NEXTJS_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

if (!admin.apps.length) {
  const adminAccount = require("../../projectwe-421109-firebase-adminsdk-ixdhn-f87fcc7bf5.json");
  admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
  });
  const u = admin.auth();
}

export { auth, db, admin, firebaseConfig };
export default app;
