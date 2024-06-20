import { UserDoc } from "@/types/userDoc";
import { getAge } from "@/utils/getAge";
import styled from "styled-components";
import { Button, Image } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { MdEmail } from "react-icons/md";
import { RiKakaoTalkFill } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export const ReviewCard = ({
  username,
  profileURL,
  score,
  date,
  review,
}: PropsWithChildren<{
  username: string;
  profileURL: string;
  score: number;
  date: string;
  review: string;
}>) => {
  const getStarIcon = (index: number, score: number) => {
    if (index < score) {
      if (index + 0.5 < score) {
        return <FaStar color="gold" size="0.8em" />;
      } else {
        return <FaStarHalfAlt color="gold" />;
      }
    } else {
      return <FaRegStar color="gold" />;
    }
  };

  return (
    <ReviewContainer>
      <ProfileImageContainer>
        <ProfileImage src={profileURL} roundedCircle alt="profile" />
      </ProfileImageContainer>
      <ReviewPanel>
        <div className="flex justify-content-between" style={{ width: "100%" }}>
          <div className="flex flex-column justify-content-start flex-grow-1 align-items-start">
            <ProfileName>{username}</ProfileName>
            <ProfileAux>{date} 수업</ProfileAux>
          </div>
          <div className="flex align-items-center gap-1">
            {[...Array(parseInt(`${score}`))].map((_, idx) => (
              <FaStar color="gold" size="0.8em" key={idx}>
                {idx}
              </FaStar>
            ))}
          </div>
        </div>
        {review}
      </ReviewPanel>
    </ReviewContainer>
  );
};

const ReviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  background: white;
  margin-right: 6px;
  padding: 6px;
`;

const ProfileImage = styled(Image)`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 20px;
`;

const ProfileImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const ReviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProfileName = styled.div`
  font-size: 15px;
  font-weight: bold;
`;

const ProfileAux = styled.span`
  font-weight: normal;
  font-size: 12px;
  color: gray;
  margin-bottom: 5px;
`;
