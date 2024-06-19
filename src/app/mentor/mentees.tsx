import React, { SetStateAction, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { StudentCard } from "@/components/student/studentCard";
import { Button, Modal } from "react-bootstrap";
import { defaultClassesDoc } from "@/types/classesDoc";
import LoadingComponent from "@/components/common/loading";
import { useUser } from "@/hooks/useUser";
import { mentoringTime } from "@/utils/mentoringDates";

export const MenteeList = ({ selectedDate }: { selectedDate: string }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser(setLoading);
  const [mentees, setMentees] = useState<(UserDoc & { id: string })[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [assignedMentees, setAssignedMentees] = useState<string[]>([]);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchMentees = async () => {
      setLoading(true);
      const q = query(collection(db, "users"), where("isMentor", "==", false));
      const docs = await getDocs(q);
      const menteeList = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UserDoc & { id: string });
      setMentees(menteeList);
      setLoading(false);
    };

    const subscribeToAssignments = () => {
      const q = query(
        collection(db, "classes"),
        where("datetime", "==", Timestamp.fromMillis(new Date(`${selectedDate}T${mentoringTime}`).getTime()))
      );
      return onSnapshot(q, (snapshot) => {
        const assignedMenteesList = snapshot.docs.reduce((acc, doc) => {
          return acc.concat(doc.data().menteeIDs);
        }, [] as string[]);
        setAssignedMentees(assignedMenteesList);
      });
    };

    if (user) {
      fetchMentees();
      const unsubscribe = subscribeToAssignments();
      return () => unsubscribe();
    }
  }, [user, selectedDate]);

  const onApplyMentee = async (id: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "classes"),
        where("datetime", "==", Timestamp.fromMillis(new Date(`${selectedDate}T${mentoringTime}`).getTime())),
        where("menteeIDs", "array-contains", id)
      );
      const existingClassDocs = await getDocs(q);
      if (!existingClassDocs.empty) {
        throw new Error("Mentee is already assigned");
      }

      await addDoc(collection(db, "classes"), {
        ...defaultClassesDoc,
        mentorID: user!.id,
        menteeIDs: [id],
        datetime: Timestamp.fromMillis(new Date(`${selectedDate}T${mentoringTime}`).getTime()),
      });
    } catch (error) {
      setErrorModal(true);
    }
    setLoading(false);
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
      <Modal show={errorModal} centered>
        <Modal.Body>멘티가 이미 다른 멘토에게 배정되었습니다.</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setErrorModal(false)} style={{ width: 100 }}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex flex-column overflow-y-scroll" style={{ maxHeight: "80vh" }}>
        {mentees.map((mentee) => {
          const isAssigned = mentee.id ? assignedMentees.includes(mentee.id) : false;
          return (
            <StudentCard
              key={mentee.id}
              user={mentee}
              style={{ backgroundColor: isAssigned ? "#f0f0f0" : "#fff" }}
            >
              <Button
                variant="success"
                size="sm"
                style={{ width: "80px" }}
                onClick={() => {
                  setConfirmModal(true);
                  setSelectedMenteeId(mentee.id);
                }}
                disabled={isAssigned}
              >
                배정
              </Button>
            </StudentCard>
          );
        })}
      </div>
    </>
  );
};
