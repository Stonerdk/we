"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import { MyInfoCard } from "@/components/student/myInfoCard";
import { db, storage } from "@/firebase/firebaseClient";
import { useUser } from "@/hooks/useUser";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Protected from "../protected";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { defaultUserDoc, UserDoc } from "@/types/userDoc";
import { ReviewsDoc } from "@/types/reviewsDoc";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<UserDoc>({ ...defaultUserDoc });
  const { user } = useUser(setLoading, setNewUser);
  const [reviews, setReviews] = useState<(ReviewsDoc & { id: string })[]>([]);
  const [avgScore, setAvgScore] = useState<number>(0);

  const [dirty, setDirty] = useState(false);

  const setUser = (newUser: UserDoc) => {
    setNewUser(newUser);
    setDirty(true);
  };

  const onSubmit = async () => {
    if (user) {
      setLoading(true);
      const docRef = doc(db, "users", user.id!);
      await setDoc(docRef, user);
      setLoading(false);
    }
  };

  const setProfileImage = async (file: File | null) => {
    if (file) {
      setLoading(true);
      const storageRef = ref(storage, `profileImages/${user!.id}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setUser({ ...newUser, profileURL: imageUrl });
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const q = query(
        collection(db, "reviews"),
        where("mentorID", "==", user?.id ?? ""),
        orderBy("datetime", "desc")
      );
      const docs = await getDocs(q);
      const reviews = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ReviewsDoc & { id: string });
      const reviewsWithMenteeInfo = await Promise.all(
        reviews.map(async (review) => {
          const menteeDoc = await getDoc(doc(db, "users", review.menteeID));
          const menteeData = menteeDoc.data() as UserDoc;
          return {
            ...review,
            menteeName: menteeData.name,
            menteeProfileURL: menteeData.profileURL,
          };
        })
      );
      setReviews(reviewsWithMenteeInfo);
      setLoading(false);
    };
    fetchReviews();
  }, [user]);

  return (
    <>
      <Protected>
        <CommonLayout title="내 정보" loading={loading}>
          {user && (
            <div className="fcg10">
              <MyInfoCard
                isMentor={newUser.isMentor}
                username={newUser.name}
                birthday={newUser.birthday.replace(/(\d{2})(\d{2})(\d{2})/, "$1. $2. $3")}
                gender={newUser.gender === "male" ? "남성" : newUser.gender === "female" ? "여성" : "기타"}
                bio={newUser.bio}
                email={newUser.email}
                grade={newUser.grade ?? ""}
                reviews={reviews}
                avgScore={avgScore}
                ktalkID={newUser.ktalkID}
                profileURL={newUser.profileURL}
                desiredSubjects={newUser.desiredSubjects}
                setProfileImage={setProfileImage}
                setBio={(bio: string) => setUser({ ...newUser, bio })}
                setKtalkID={(ktalkID: string) => setUser({ ...newUser, ktalkID })}
                setDesiredSubjects={(s: string[]) => setUser({ ...newUser, desiredSubjects: s })}
                onSubmit={onSubmit}
                onReset={() => {
                  if (user) {
                    setNewUser(user);
                    setDirty(false);
                  }
                }}
              />
            </div>
          )}
        </CommonLayout>
      </Protected>
    </>
  );
};

export default Page;
