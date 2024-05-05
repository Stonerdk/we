"use client";
import { CommonLayout } from "@/components/background/commonLayout";
import { useUser } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Protected from "../protected";
import { collection, doc, orderBy, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { StudentCard } from "@/components/student/studentCard";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { Button } from "react-bootstrap";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { userDoc } = useUser(session, setLoading);

  const {
    WrappedInfiniteScroll,

    setEntries: setMentees,
    entries: mentees,
  } = useInfinityScroll<UserDoc>(
    collection(db, "users"),
    [where("isMentor", "==", true), orderBy("isAdminVerified", "asc"), orderBy("name")],
    setLoading,
    session
  );

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
        <WrappedInfiniteScroll>
          {mentees.map((mentee, idx) => (
            <StudentCard key={idx} user={mentee}>
              {mentee.isAdminVerified ? (
                <Button disabled variant="secondary" size="sm" style={{ width: "80px" }}>
                  승인됨
                </Button>
              ) : (
                <Button
                  onClick={() => onAdminVerify(mentee.id)}
                  variant="success"
                  size="sm"
                  style={{ width: "80px" }}
                >
                  승인
                </Button>
              )}
            </StudentCard>
          ))}
        </WrappedInfiniteScroll>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
