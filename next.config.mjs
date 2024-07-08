import pwa from 'next-pwa';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const withPWA = pwa({
    dest: 'public',
  });

const generateServiceWorker = () => {
  const env = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  };

  const serviceWorkerTemplate = `
    importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

    firebase.initializeApp({
      apiKey: '${env.NEXT_PUBLIC_FIREBASE_API_KEY}',
      authDomain: '${env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}',
      projectId: '${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}',
      storageBucket: '${env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}',
      messagingSenderId: '${env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}',
      appId: '${env.NEXT_PUBLIC_FIREBASE_APP_ID}',
      measurementId: '${env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}',
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  `;

  const __filename = fileURLToPath(import.meta.url);
  fs.writeFileSync(path.resolve(path.dirname(__filename), 'public/firebase-messaging-sw.js'), serviceWorkerTemplate);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://projectwe-421109.firebaseapp.com/",
        port: "",
        pathname: "/assets/main/**"
      },
      {
        protocol: "https",
        hostname: "https://projectwe-421109.web.app/",
        port: "",
        pathname: "/assets/main/**"
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      generateServiceWorker();
    }
    return config;
  }
};

export default nextConfig;
