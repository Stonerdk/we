import { doc, getDoc } from "firebase/firestore";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { db } from "@/firebase/firebaseClient";
import { UserDoc, defaultUserDoc } from "@/types/userDoc";
import { Session } from "next-auth";

export const useUser = (
  session: Session | null,
  setLoading?: React.Dispatch<SetStateAction<boolean>>,
  noSessionHandler?: () => void
) => {
  const [userDoc, setUserDoc] = useState<UserDoc>(defaultUserDoc);
  const fetchUserData = useCallback(
    async (uid: string) => {
      if (session) {
        setLoading?.(true);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDoc(docSnap.data() as UserDoc);
        } else {
          noSessionHandler?.();
        }
        setLoading?.(false);
      } else {
        noSessionHandler?.();
      }
    },
    [noSessionHandler, session, setLoading]
  );

  useEffect(() => {
    if (session) fetchUserData(session.user.uid);
  }, [session, fetchUserData]);

  return { userDoc, setUserDoc, fetchUserData };
};
