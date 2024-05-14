import React, { useEffect, useState, memo } from "react";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { Button, Modal, Form } from "react-bootstrap";
import { useMentoringSchedule } from "@/hooks/useMentoringSchedule";
import { ClassesDoc } from "@/types/classesDoc";
import { AdminClassCard } from "@/components/student/adminClassCard";
import LoadingComponent from "@/components/common/loading";

export const AdminClasses = ({ user }: { user: UserDoc }) => {
  const [loading, setLoading] = useState(true);
  const { selectedDate, ScheduleSelector } = useMentoringSchedule();
  const [userInfo, setUserInfo] = useState<{ [key: string]: UserDoc & { id: string } }>({});
  const [classes, setClasses] = useState<ClassesDoc[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const getTargetDate = () => {
    return Timestamp.fromMillis(new Date(selectedDate).getTime());
  };

  const fetchClasses = async () => {
    setLoading(true);
    const q = query(
      collection(db, "classes"),
      where("datetime", ">=", getTargetDate()),
      where("datetime", "<", new Timestamp(getTargetDate().seconds + 86400, 0))
    );
    const docs = await getDocs(q);
    const classesList = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ClassesDoc);
    setClasses(classesList);
    setLoading(false);
  };

  const onAdminVerify = async (id: string) => {
    setLoading(true);
    const userRef = doc(db, "classes", id);
    await updateDoc(userRef, { isAdminVerified: true });
    setLoading(false);
    setClasses(classes.map((cl) => (cl.id === id ? { ...cl, isAdminVerified: true } : cl)));
  };

  const onRejectClass = async () => {
    if (selectedClassId) {
      setLoading(true);
      const classRef = doc(db, "classes", selectedClassId);
      await deleteDoc(classRef);
      setLoading(false);
      setClasses(classes.filter((cl) => cl.id !== selectedClassId));
      setShowRejectModal(false);
      setSelectedClassId(null);

      // TODO: Implement push notification to mentor with rejectReason
    }
  };

  useEffect(() => {
    const ids = classes
      .reduce<string[]>((acc, cur) => [...acc, ...cur.menteeIDs, cur.mentorID], [])
      .filter((id) => userInfo[id] === undefined && id !== "");
    if (ids.length === 0) return;

    const q = query(collection(db, "users"), where(documentId(), "in", ids));
    getDocs(q).then(({ docs }) => {
      const dr = docs.reduce<{ [key: string]: UserDoc & { id: string } }>(
        (acc, cur) => ({ ...acc, [cur.id]: { ...cur.data(), id: cur.id } as UserDoc & { id: string } }),
        {}
      );
      setUserInfo((prev) => ({ ...prev, ...dr }));
    });
  }, [classes]);

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user, selectedDate]);

  const AdminClassCardMemo = memo(AdminClassCard);

  return (
    <ScheduleSelector>
      {loading && <LoadingComponent />}

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Body>삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={onRejectClass}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        {classes.map((cl, idx) => (
          <AdminClassCardMemo
            key={idx}
            cl={cl}
            mentor={userInfo[cl.mentorID] ?? null}
            mentee={cl.menteeIDs.length > 0 ? userInfo[cl.menteeIDs[0]] ?? null : null}
          >
            {cl.isAdminVerified ? (
              <Button disabled variant="secondary" size="sm" style={{ width: "80px" }}>
                승인됨
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onAdminVerify(cl.id)}
                  variant="success"
                  size="sm"
                  style={{ width: "80px", marginRight: "5px" }}
                >
                  승인
                </Button>
                <Button
                  onClick={() => {
                    setSelectedClassId(cl.id);
                    setShowRejectModal(true);
                  }}
                  variant="danger"
                  size="sm"
                  style={{ width: "80px" }}
                >
                  삭제
                </Button>
              </>
            )}
          </AdminClassCardMemo>
        ))}
      </div>
    </ScheduleSelector>
  );
};
