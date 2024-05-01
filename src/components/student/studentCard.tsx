import styled from "styled-components";

export const StudentCard = () => (
  <ProfileContainer>
    <ProfileImageContainer></ProfileImageContainer>
    <ProfileDescription>
      <ProfileName>
        강두경 <ProfileAux>23세</ProfileAux>
      </ProfileName>

      <DesiredSubjectsContainer>
        <DesiredSubject>수학</DesiredSubject>
        <DesiredSubject>과학</DesiredSubject>
        <DesiredSubject>영어</DesiredSubject>
      </DesiredSubjectsContainer>
      <ProfileAux>서울대학교 수학과</ProfileAux>
    </ProfileDescription>
  </ProfileContainer>
);

const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  gap: 10px;
`;

const ProfileImageContainer = styled.div`
  width: 100px;
  border-radius: 10px;
  position: relative;
  background-color: pink;
`;

const ProfileDescription = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProfileAux = styled.span`
  font-weight: normal;
  font-size: 15px;
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
  color: gray;
  font-size: 15px;
`;
