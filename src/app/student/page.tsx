"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { AssociatedMentorCard } from "@/components/student/AssociatedMentorCard";
import { MyInfoCard } from "@/components/student/myInfoCard";
import { db, storage } from "@/firebase/firebaseClient";
import { useUser } from "@/hooks/useUser";
import { doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Protected from "../protected";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { userDoc, setUserDoc, fetchUserData } = useUser(session, setLoading);
  //const [profileImage, setProfileImage] = useState<File | null>(null);

  const onSubmit = async () => {
    if (session) {
      setLoading(true);
      const docRef = doc(db, "users", session!.user.uid);
      await setDoc(docRef, userDoc);
      setLoading(false);
    }
  };

  const setProfileImage = async (file: File | null) => {
    if (file) {
      const storageRef = ref(storage, `profileImages/${session!.user.uid}`);
      setLoading(true);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setLoading(false);
      setUserDoc({ ...userDoc, profileURL: imageUrl });
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
            profileURL={userDoc.profileURL}
            isEmailVerified={userDoc.isEmailVerified}
            isAdminVerified={userDoc.isAdminVerified}
            desiredSubjects={userDoc.desiredSubjects}
            setProfileImage={setProfileImage}
            setBio={(bio: string) => setUserDoc({ ...userDoc, bio })}
            setKtalkID={(ktalkID: string) => setUserDoc({ ...userDoc, ktalkID })}
            setDesiredSubjects={(f: (s: string[]) => string[]) =>
              setUserDoc({ ...userDoc, desiredSubjects: f(userDoc.desiredSubjects) })
            }
            onSubmit={onSubmit}
            onReset={() => fetchUserData(session!.user.uid)}
          />
        </div>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
