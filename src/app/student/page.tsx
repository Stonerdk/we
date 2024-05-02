"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { AssociatedMentorCard } from "@/components/student/AssociatedMentorCard";
import { MyInfoCard } from "@/components/student/myInfoCard";
import { db } from "@/firebase/firebaseClient";
import { useUser } from "@/hooks/useUser";
import { doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Protected from "../protected";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { userDoc, setUserDoc, fetchUserData } = useUser(session, setLoading);

  const onSubmit = async () => {
    if (session) {
      const docRef = doc(db, "users", session!.user.uid);
      await setDoc(docRef, userDoc);
      console.log("업데이트 성공");
    }
  };

  return (
    <Protected>
      <CommonLayout title="내 정보" loading={loading}>
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
