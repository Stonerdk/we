import { doc, getDoc, updateDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { getMessaging } from "firebase/messaging/sw";
import { getToken, onMessage } from "firebase/messaging";

export const useUser = (
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  callback?: (u: UserDoc) => void
) => {
  const [userData, setUserData] = useState<(UserDoc & { id: string }) | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading?.(true);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userInfo = { id: docSnap.id, ...docSnap.data() } as UserDoc & { id: string };
          setUserData(userInfo);
          callback?.(userInfo);
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading?.(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && userData?.id) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registration successful with scope: ", registration.scope);
        })
        .catch((err) => {
          console.log("Service Worker registration failed: ", err);
        });
      const messaging = getMessaging();
      console.log(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
      getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            const userRef = doc(db, "users", userData.id);
            updateDoc(userRef, { fcmToken: currentToken });
          } else {
            console.log("No registration token available. Request permission to generate one.");
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });

      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
      });
    }
  }, [userData]);

  return { user: userData };
};
