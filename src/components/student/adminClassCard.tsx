import { ClassesDoc } from "@/types/classesDoc";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { RowPanel } from "../common/rowPanel";
import { subjectMap } from "../common/subjectSelector";
import { UserDoc } from "@/types/userDoc";

export const AdminClassCard = ({
  cl,
  mentor,
  mentee,
  children,
}: PropsWithChildren<{
  cl: ClassesDoc & { id: string };
  mentor: (UserDoc & { id: string }) | null;
  mentee: (UserDoc & { id: string }) | null;
}>) => {
  const SmallUserPanel = ({
    user,
    isMentor,
  }: {
    user: (UserDoc & { id: string }) | null;
    isMentor: boolean;
  }) => (
    <SmallUserPanelContainer>
      <ProfileImageContainer />
      <ProfileDescription>
        <ProfileName>
          <small>
            {user ? user.name : "???"}
            <ProfileAux> {isMentor ? "멘토" : "멘티"}</ProfileAux>
          </small>
        </ProfileName>

        <ProfileEmail>이메일</ProfileEmail>
      </ProfileDescription>
    </SmallUserPanelContainer>
  );

  return (
    <Container>
      <MentorMenteePartition>
        <MentorMentee>
          <SmallUserPanel user={mentor} isMentor />
          {/* cl.mentorID */}
        </MentorMentee>
        <MentorMentee>
          <SmallUserPanel user={mentee} isMentor={false} />
        </MentorMentee>
      </MentorMenteePartition>
      <small>
        {cl.subjects.map((subject, index) => (
          <Subject key={index}>{subjectMap[subject]}</Subject>
        ))}{" "}
        {cl.description}
      </small>
      <ButtonContainer>{children}</ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 8px;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  padding: 12px;
`;

const MentorMenteePartition = styled.div`
  display: flex;
  width: 100%;
`;

const MentorMentee = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0.5;
`;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const SmallUserPanelContainer = styled.div`
  display: flex;
  gap: 6px;
`;

const ProfileContainerFrameless = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 2px;
  margin-right: 2px;
  padding-left: 6px;
  padding-right: 6px;
  background: white;
`;

const ProfileImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: pink;
`;

const ProfileDescription = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProfileName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ProfileEmail = styled.span`
  font-weight: normal;
  font-size: 13px;
  color: black;
  margin-bottom: 5px;
`;

const ProfileAux = styled.span`
  font-weight: normal;
  font-size: 13px;
  color: gray;
  margin-bottom: 5px;
`;

const DesiredSubjectsContainer = styled.div`
  display: flex;
  margin-bottom: 5px;
  gap: 5px;
`;

const DesiredSubject = styled.div`
  padding-left: 7px;
  padding-right: 7px;
  border-radius: 5px;
  background-color: lightgray;
  color: black;
  font-size: 12px;
`;
