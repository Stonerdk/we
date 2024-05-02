import { UserDoc } from "@/types/userDoc";
import { getAge } from "@/utils/getAge";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

export const StudentCard = ({
  user,
  onAdminVerify,
}: {
  user: UserDoc & { id: string };
  onAdminVerify: () => void;
}) => (
  <ProfileContainer>
    <ProfileImageContainer></ProfileImageContainer>
    <ProfileDescription>
      <div className="flex justify-content-between" style={{ width: "100%" }}>
        <div className="flex flex-column justify-content-start">
          <ProfileName>
            {user.name}{" "}
            <ProfileAux>{user.grade ? `${user.grade}학년` : `${getAge(user.birthday)}세`}</ProfileAux>
          </ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
        </div>
        <div className="mr-2 mt-2">
          {user.isAdminVerified ? (
            <Button disabled variant="secondary" size="sm" style={{ width: "80px" }}>
              승인됨
            </Button>
          ) : (
            <Button onClick={onAdminVerify} variant="success" size="sm" style={{ width: "80px" }}>
              승인
            </Button>
          )}
        </div>
      </div>

      <DesiredSubjectsContainer>
        {user.desiredSubjects.map((subject, index) => (
          <DesiredSubject key={index}>{subjectMap[subject]}</DesiredSubject>
        ))}
      </DesiredSubjectsContainer>

      <ProfileAux>{user.bio}</ProfileAux>
    </ProfileDescription>
  </ProfileContainer>
);

const ProfileContainer = styled.div`
  display: flex;

  gap: 10px;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 8px;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  padding: 6px;
`;

const ProfileImageContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background-color: pink;
`;

const ProfileUpperWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileNameEmailWrapper = styled.div``;

const ProfileButtonWrapper = styled.div``;

const ProfileDescription = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProfileName = styled.div`
  font-size: 18px;
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
