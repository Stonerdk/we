"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { AssociatedMentorCard } from "@/components/student/AssociatedMentorCard";
import { MyInfoCard } from "@/components/student/myInfoCard";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Protected from "../protected";
import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useSession } from "next-auth/react";
import { UserDoc, defaultUserDoc } from "@/types/userDoc";

const Page = () => {
  const { data: session, status } = useSession();
  const [userDoc, setUserDoc] = useState<UserDoc>(defaultUserDoc);
  const [loading, setLoading] = useState(true);

  async function fetchUserData(uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserDoc(docSnap.data() as UserDoc);
      console.log(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (session) {
      fetchUserData(session.user.uid);
    }
  }, [session]);

  const onSubmit = async () => {
    if (session) {
      const docRef = doc(db, "users", session!.user.uid);
      await setDoc(docRef, userDoc);
      console.log("업데이트 성공");
    }
  };

  if (loading) {
    return <>loading...</>;
  }

  return (
    <Protected>
      <CommonLayout title="내 정보">
        <div className="fcg10">
          <MyInfoCard
            isMentor={userDoc.isMentor}
            username={userDoc.name}
            birthday={userDoc.birthday.replace(/(\d{2})(\d{2})(\d{2})/, "$1. $2. $3")}
            gender={userDoc.gender === "male" ? "남성" : userDoc.gender === "female" ? "여성" : "기타"}
            bio={userDoc.bio}
            email={userDoc.email}
            grade={userDoc.grade ?? ""}
            ktalkID={userDoc.ktalkID}
            isEmailVerified={userDoc.isEmailVerified}
            isAdminVerified={userDoc.isAdminVerified}
            desiredSubjects={userDoc.desiredSubjects}
            setBio={(bio: string) => setUserDoc({ ...userDoc, bio })}
            setKtalkID={(ktalkID: string) => setUserDoc({ ...userDoc, ktalkID })}
            setDesiredSubjects={(desiredSubjects: string[]) => setUserDoc({ ...userDoc, desiredSubjects })}
            onSubmit={onSubmit}
            onReset={() => fetchUserData(session!.user.uid)}
          />
          <AssociatedMentorCard isMentor={userDoc.isMentor} />
        </div>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
