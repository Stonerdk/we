import { UserDoc } from "@/types/userDoc";
import { getAge } from "@/utils/getAge";
import styled from "styled-components";
import { Button, Image } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { MdEmail } from "react-icons/md";
import { RiKakaoTalkFill } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";

const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

export const StudentCard = ({
  user,
  children,
  style,
  frame = true,
  onClick = () => {},
}: PropsWithChildren<{
  user: UserDoc & { id: string };
  style?: React.CSSProperties;
  frame?: boolean;
  onClick?: () => void;
}>) => {
  const Inner = () => (
    <>
      <ProfileImageContainer>
        <ProfileImage src={user.profileURL} roundedCircle alt="profile" />
      </ProfileImageContainer>
      <ProfileDescription>
        <div className="flex justify-content-between" style={{ width: "100%" }}>
          <div className="flex justify-content-start flex-grow-1 align-items-center">
            <ProfileName>
              {user.name}{" "}
              <ProfileAux>{user.grade ? `${user.grade}학년` : `${getAge(user.birthday)}세`}</ProfileAux>
            </ProfileName>
            <div className="flex gap-1 ml-2 ">
              <CopyToClipboard text={user.email}>
                <MdEmail
                  color="darkgray"
                  fontSize="1.5em"
                  onClick={() => {
                    window.location.href = "mailto:" + user.email;
                  }}
                />
              </CopyToClipboard>
              {/* <CopyToClipboard text={user.ktalkID}>
                <RiKakaoTalkFill
                  color="gray"
                  fontSize="1.2em"
                  onClick={() => {
                    window.location.href = "kakaotalk://profile/" + user.ktalkID;
                  }}
                />
              </CopyToClipboard> */}
            </div>
          </div>
          <div className="mr-2 mt-2">{children}</div>
        </div>
        <DesiredSubjectsContainer>
          {user.desiredSubjects.map((subject, index) => (
            <DesiredSubject key={index}>{subjectMap[subject]}</DesiredSubject>
          ))}
        </DesiredSubjectsContainer>
        <ProfileAux>{user.bio}</ProfileAux>
      </ProfileDescription>
    </>
  );

  return frame ? (
    <ProfileContainer style={style} onClick={onClick}>
      <Inner />
    </ProfileContainer>
  ) : (
    <ProfileContainerFrameless style={style} onClick={onClick}>
      <Inner />
    </ProfileContainerFrameless>
  );
};

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

const ProfileImage = styled(Image)`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
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
  width: 70px;
  height: 70px;
  border-radius: 10px;
  flex-shrink: 0;
`;

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
