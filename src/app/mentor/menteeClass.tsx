import { StudentCard } from "@/components/student/studentCard";
import { db } from "@/firebase/firebaseClient";
import { ClassesDoc } from "@/types/classesDoc";
import { UserDoc } from "@/types/userDoc";
import { doc, getDoc } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";

import { PropsWithChildren } from "react";
import { CardContainer } from "@/components/common/cardContainer";
import { formatClassDuration } from "@/utils/dateUtil";

const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

const RowPanel = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <Row className="pb-1 pt-1 align-items-center">
    <Col xs={3}>
      <strong>{title}</strong>
    </Col>
    <Col>{children}</Col>
  </Row>
);
export const MenteeClass = ({
  cl,
  setCl,
}: {
  cl: ClassesDoc & { id: string };
  setCl: React.Dispatch<SetStateAction<(ClassesDoc & { id: string }) | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [userDoc, setUserDoc] = useState<(UserDoc & { id: string }) | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (cl.menteeIDs.length === 0) return;
      const res = await getDoc(doc(db, "users", cl.mentorID));
      setUserDoc(res.data() as UserDoc & { id: string });
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading || !userDoc) return <></>;
  return (
    <CardContainer style={{ marginTop: "5px" }}>
      <div className="m-2">
        <b>내 멘토</b>
      </div>
      {userDoc && <StudentCard user={userDoc} frame={false} />}
      <div className="ml-2 mr-2">
        <RowPanel title="시간">{formatClassDuration(cl.datetime.toDate(), cl.duration)}</RowPanel>
        <RowPanel title="과목">
          {cl.subjects.map((subject, index) => (
            <Subject key={index}>{subjectMap[subject]}</Subject>
          ))}
        </RowPanel>
        <RowPanel title="내용">{cl.description}</RowPanel>
        <RowPanel title="URL">
          <div
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              width: "100%",
            }}
          >
            {cl.associatedURL.startsWith("http") ? (
              <a href={cl.associatedURL} target="_blank" rel="noreferrer">
                {cl.associatedURL}
              </a>
            ) : (
              cl.associatedURL
            )}
          </div>
        </RowPanel>
        {cl.note && <RowPanel title="비고">{cl.note}</RowPanel>}
      </div>
    </CardContainer>
  );
};

const Subject = styled.span`
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 5px;
  border-radius: 5px;
  background-color: lightgray;
  color: black;
  font-size: 12px;
`;
