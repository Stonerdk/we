import { Warning } from "@/components/common/warning";
import { StudentCard } from "@/components/student/studentCard";
import { db } from "@/firebase/firebaseClient";
import { ClassesDoc } from "@/types/classesDoc";
import { UserDoc } from "@/types/userDoc";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Session } from "next-auth";
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Image, Form, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";

import { PropsWithChildren } from "react";
import { CardContainer } from "@/components/common/cardContainer";
import LoadingComponent from "@/components/common/loading";
import { formatClassDuration } from "@/utils/dateUtil";
import { SubjectSelector } from "@/components/common/subjectSelector";
import { RowPanel } from "@/components/common/rowPanel";
export const MentorClass = ({
  session,
  cl,
  setCl,
}: {
  session: Session | null;
  cl: ClassesDoc & { id: string };
  setCl: React.Dispatch<SetStateAction<(ClassesDoc & { id: string }) | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [userDoc, setUserDoc] = useState<(UserDoc & { id: string }) | null>(null);
  const [clInfo, setClInfo] = useState<ClassesDoc>(cl);
  const [clSubjects, setClSubjects] = useState<string[]>(cl.subjects);

  const updateCl = async () => {
    setLoading(true);
    setCl({ ...cl, ...clInfo, subjects: clSubjects });
    await updateDoc(doc(db, "classes", cl.id), {
      title: clInfo.title,
      subjects: clSubjects,
      description: clInfo.description,
      associatedURL: clInfo.associatedURL,
    });
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (cl.menteeIDs.length === 0) return;
      const res = await getDoc(doc(db, "users", cl.menteeIDs[0]));
      setUserDoc(res.data() as UserDoc & { id: string });
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingComponent />;
  return (
    <CardContainer style={{ marginTop: "5px" }}>
      <div className="m-2">
        <b>내 멘티</b>
      </div>

      {userDoc && <StudentCard user={userDoc} frame={false} />}
      <div className="ml-2 mr-2">
        <Warning>
          <small>{!cl.isAdminVerified && "아직 관리자로부터 승인되지 않았습니다."}</small>
        </Warning>

        <RowPanel title="시간">{formatClassDuration(clInfo.datetime.toDate(), clInfo.duration)}</RowPanel>
        <RowPanel title="과목">
          <SubjectSelector dispatch={setClSubjects} state={clSubjects} />
        </RowPanel>
        <RowPanel title="내용">
          <Form.Control
            size="sm"
            as="textarea"
            rows={4}
            value={clInfo.description}
            onChange={(e) => {
              setClInfo({ ...clInfo, description: e.target.value });
            }}
          />
        </RowPanel>
        <RowPanel title="URL">
          <Form.Control
            size="sm"
            type="text"
            value={clInfo.associatedURL}
            onChange={(e) => {
              setClInfo({ ...clInfo, associatedURL: e.target.value });
            }}
          />
        </RowPanel>
        <RowPanel title="비고">{clInfo.note}</RowPanel>
        <div className="d-flex justify-content-center">
          <Button
            variant="success"
            style={{ width: "100px" }}
            onClick={() => {
              updateCl();
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </CardContainer>
  );
};
