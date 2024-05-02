"use client";
import { CommonLayout } from "@/components/background/commonLayout";
import { useUser } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Protected from "../protected";
import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserDoc } from "@/types/userDoc";
import LoadingComponent from "@/components/common/loading";
import { StudentCard } from "@/components/student/studentCard";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { userDoc, setUserDoc, fetchUserData } = useUser(session, setLoading);
  const [mentees, setMentees] = useState<(UserDoc & { id: string })[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchMentees = useCallback(async () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("isMentor", "==", true),
      orderBy("isAdminVerified", "asc"),
      orderBy("name"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisible);
    console.log(querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as UserDoc) })));
    setMentees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as UserDoc) })));
    setLoading(false);
  }, []);

  const fetchMoreMentees = async () => {
    if (!lastVisible) return;
    const q = query(
      collection(db, "users"),
      where("isMentor", "==", true),
      orderBy("isAdminVerified"),
      orderBy("name"),
      startAfter(lastVisible),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setMentees([
      ...mentees,
      ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as UserDoc) })),
    ]);
    setHasMore(querySnapshot.docs.length >= 5);
  };

  useEffect(() => {
    fetchMentees();
  }, [fetchMentees, session]);

  const onAdminVerify = async (id: string) => {
    setLoading(true);
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { isAdminVerified: true });
    setLoading(false);
    setMentees(mentees.map((mentee) => (mentee.id === id ? { ...mentee, isAdminVerified: true } : mentee)));
  };

  if (!userDoc.isAdmin) {
    return (
      <CommonLayout title="관리자">
        <div>관리자만 접근 가능합니다.</div>
      </CommonLayout>
    );
  }

  return (
    <Protected>
      <CommonLayout title="관리자" loading={loading}>
        <InfiniteScroll
          dataLength={mentees.length}
          next={fetchMoreMentees}
          hasMore={hasMore}
          loader={<LoadingComponent />}
          endMessage={<hr />}
        >
          {mentees.map((mentee, idx) => (
            <StudentCard
              key={idx}
              user={mentee}
              onAdminVerify={() => {
                onAdminVerify(mentee.id);
              }}
            />
          ))}
        </InfiniteScroll>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
