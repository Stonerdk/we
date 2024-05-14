import { CommonLayout } from "@/components/background/commonLayout";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState, memo, Dispatch, SetStateAction } from "react";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { Button } from "react-bootstrap";
import { useMentoringSchedule } from "@/hooks/useMentoringSchedule";
import { ClassesDoc } from "@/types/classesDoc";
import { AdminClassCard } from "@/components/student/adminClassCard";

export const AdminClasses = ({ user }: { user: UserDoc }) => {
  const [loading, setLoading] = useState(true);
  const { selectedDate, ScheduleSelector } = useMentoringSchedule();
  const [userInfo, setUserInfo] = useState<{ [key: string]: UserDoc & { id: string } }>({});
  const getTargetDate = () => {
    return Timestamp.fromMillis(new Date(selectedDate).getTime());
  };

  const onAdminVerify = async (id: string) => {
    setLoading(true);
    const userRef = doc(db, "classes", id);
    await updateDoc(userRef, { isAdminVerified: true });
    setLoading(false);
    setClasses(classes.map((cl) => (cl.id === id ? { ...cl, isAdminVerified: true } : cl)));
  };

  const {
    WrappedInfiniteScroll,
    fetchEntries: fetchClasses,
    setEntries: setClasses,
    entries: classes,
  } = useInfinityScroll<ClassesDoc>(
    async () => {
      setLoading(true);
      const q = query(
        collection(db, "classes"),
        where("datetime", ">=", getTargetDate()),
        where("datetime", "<", new Timestamp(getTargetDate().seconds + 86400, 0))
      );
      const docs = await getDocs(q);
      setLoading(false);
      return docs;
    },
    async (lastVisible) => {
      const q = query(
        collection(db, "classes"),
        where("datetime", ">=", getTargetDate()),
        where("datetime", "<", new Timestamp(getTargetDate().seconds + 86400, 0)),
        startAfter(lastVisible)
      );
      return await getDocs(q);
    }
  );

  useEffect(() => {
    const ids = classes
      .reduce<string[]>((acc, cur) => [...acc, ...cur.menteeIDs, cur.mentorID], [])
      .filter((id) => userInfo[id] === undefined && id !== "");
    if (ids.length === 0) return;
    console.log(ids);
    const q = query(collection(db, "users"), where(documentId(), "in", ids));
    getDocs(q).then(({ docs }) => {
      const dr = docs.reduce<{ [key: string]: UserDoc & { id: string } }>(
        (acc, cur) => ({ ...acc, [cur.id]: cur.data() as UserDoc & { id: string } }),
        {}
      );
      setUserInfo({ ...userInfo, ...dr });
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
      <WrappedInfiniteScroll>
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
              <Button
                onClick={() => onAdminVerify(cl.id)}
                variant="success"
                size="sm"
                style={{ width: "80px" }}
              >
                승인
              </Button>
            )}
          </AdminClassCardMemo>
        ))}
      </WrappedInfiniteScroll>
    </ScheduleSelector>
  );
};
