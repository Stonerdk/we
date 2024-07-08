import { Warning } from "@/components/common/warning";
import { StudentCard } from "@/components/student/studentCard";
import { db } from "@/firebase/firebaseClient";
import { ClassesDoc } from "@/types/classesDoc";
import { UserDoc } from "@/types/userDoc";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

import { CardContainer } from "@/components/common/cardContainer";
import LoadingComponent from "@/components/common/loading";
import { formatClassDuration } from "@/utils/dateUtil";
import { SubjectSelector } from "@/components/common/subjectSelector";
import { RowPanel } from "@/components/common/rowPanel";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useChatroom } from "@/hooks/useChatroom";
export const MentorClass = ({
  cl,
  setCl,
}: {
  cl: ClassesDoc & { id: string };
  setCl: React.Dispatch<SetStateAction<(ClassesDoc & { id: string }) | null>>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser(setLoading);
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
      setUserDoc({ id: res.id, ...res.data() } as UserDoc & { id: string });
    };
    fetchUser();
  }, []);

  const startMessage = async (u: UserDoc & { id: string }) => {
    if (user?.id) {
      console.log(user.id, u);
      const q = query(collection(db, "chats"), where("mentor", "==", user.id), where("mentee", "==", u.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "chats"), {
          mentor: user.id,
          mentee: u.id,
        });
      }

      router.push(`/chat/${u.id}`);
    }
  };

  if (loading) return <LoadingComponent />;
  return (
    <CardContainer style={{ marginTop: "5px" }}>
      <div className="m-2">
        <b>내 멘티</b>
      </div>

      {userDoc && <StudentCard user={userDoc} frame={false} onMessage={() => startMessage(userDoc)} />}
      <div className="ml-2 mr-2 flex flex-column gap-2 overflow-y-scroll" style={{ maxHeight: "80vh" }}>
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
