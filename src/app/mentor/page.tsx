"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Protected from "../protected";
import { useUser } from "@/hooks/useUser";
import { db } from "@/firebase/firebaseClient";
import { collection, getDocs, limit, onSnapshot, Query, query, Timestamp, where } from "firebase/firestore";
import { ClassesDoc } from "@/types/classesDoc";
import LoadingComponent from "@/components/common/loading";
import { MenteeList } from "./mentees";
import { useMentoringSchedule } from "@/hooks/useMentoringSchedule";
import { MentorClass } from "./mentoringClass";
import { NoMentor } from "./noMentor";
import { MenteeClass } from "./menteeClass";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser(setLoading);
  const [cl, setCl] = useState<(ClassesDoc & { id: string }) | null>(null);
  const { selectedDate, ScheduleSelector } = useMentoringSchedule();

  const fetchClasses = useCallback(
    async (q: Query) => {
      if (user) {
        setLoading(true);
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setCl(null);
        } else {
          querySnapshot.docs[0].id;
          setCl({
            id: querySnapshot.docs[0].id,
            ...(querySnapshot.docs[0].data() as ClassesDoc),
          });
        }
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      const targetDate = Timestamp.fromMillis(new Date(selectedDate).getTime());
      const selector = user.isMentor
        ? where("mentorID", "==", user.id)
        : where("menteeIDs", "array-contains", user.id);
      const q = query(
        collection(db, "classes"),
        where("datetime", ">=", targetDate),
        where("datetime", "<", new Timestamp(targetDate.seconds + 86400, 0)),
        selector,
        limit(1)
      );
      fetchClasses(q);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified" || change.type === "removed") {
            fetchClasses(q); // Call fetchClasses to update the state
          }
        });
      });
      return () => unsubscribe();
    }
  }, [fetchClasses, selectedDate, user, user?.id]);

  const menteeNoCl = () => (
    <div>
      <h1>배정된 수업이 없습니다.</h1>
    </div>
  );

  const menteeCl = () => (
    <div>
      <h1>멘토가 있습니다.</h1>
    </div>
  );

  return (
    <Protected>
      <CommonLayout title="내 수업">
        <ScheduleSelector>
          {loading ? (
            <LoadingComponent />
          ) : user!.isMentor ? (
            cl ? (
              <MentorClass cl={cl} setCl={setCl} />
            ) : (
              <MenteeList selectedDate={selectedDate} />
            )
          ) : cl ? (
            <MenteeClass cl={cl} setCl={setCl} />
          ) : (
            <NoMentor />
          )}
        </ScheduleSelector>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
