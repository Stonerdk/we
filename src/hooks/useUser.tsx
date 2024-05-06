import { doc, getDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";

export const useUser = (
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  callback?: (u: UserDoc) => void
) => {
  const [userData, setUserData] = useState<UserDoc | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading?.(true);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userInfo = { id: docSnap.id, ...docSnap.data() } as UserDoc;
          setUserData(userInfo);
          callback?.(userInfo);
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null); // inconsistent DB! (auth != firestore)
      }
      setLoading?.(false);
    });

    return () => unsubscribe();
  }, []);

  return { user: userData };
};
