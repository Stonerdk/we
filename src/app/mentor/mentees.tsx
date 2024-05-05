import React, { SetStateAction, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { StudentCard } from "@/components/student/studentCard";
import { Session } from "next-auth";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { Button, Modal } from "react-bootstrap";
import { defaultClassesDoc } from "@/types/classesDoc";
import LoadingComponent from "@/components/common/loading";

export const MenteeList = ({ session, selectedDate }: { session: Session | null; selectedDate: string }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const {
    WrappedInfiniteScroll,
    entries: mentees,
    fetchEntries: fetchMentees,
  } = useInfinityScroll<UserDoc>(
    async () => {
      setLoading(true);
      const q = query(collection(db, "users"), where("isMentor", "==", false));
      const docs = await getDocs(q);
      setLoading(false);
      return docs;
    },
    async (lastVisible) => {
      const q = query(
        collection(db, "users"),
        where("isMentor", "==", false),
        orderBy("name"),
        startAfter(lastVisible)
      );
      return await getDocs(q);
    }
  );

  useEffect(() => {
    if (session) {
      fetchMentees();
    }
  }, [session]);

  const onApplyMentee = async (id: string) => {
    setLoading?.(true);
    await addDoc(collection(db, "classes"), {
      ...defaultClassesDoc,
      mentorID: session!.user.uid,
      menteeIDs: [id],
      datetime: Timestamp.fromMillis(new Date(selectedDate).getTime()),
    });
    setLoading?.(false);
  };

  return (
    <>
      {loading && <LoadingComponent />}
      <Modal show={confirmModal} centered>
        <Modal.Body>멘티에게 수업을 제안하시겠습니까?</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="success"
            onClick={() => {
              setConfirmModal(false);
              onApplyMentee(selectedMenteeId);
            }}
            style={{ width: 100 }}
          >
            확인
          </Button>
          <Button variant="secondary" onClick={() => setConfirmModal(false)} style={{ width: 100 }}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
      <WrappedInfiniteScroll>
        {mentees.map((mentee) => (
          <StudentCard key={mentee.id} user={mentee}>
            <Button
              variant="success"
              size="sm"
              style={{ width: "80px" }}
              onClick={() => {
                setConfirmModal(true);
                setSelectedMenteeId(mentee.id);
              }}
            >
              배정
            </Button>
          </StudentCard>
        ))}
      </WrappedInfiniteScroll>
    </>
  );
};