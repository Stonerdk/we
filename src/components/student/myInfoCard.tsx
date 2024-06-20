import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Image, Form, Button, Accordion } from "react-bootstrap";
import { CardContainer } from "../common/cardContainer";
import { PropsWithChildren } from "react";
import { Warning } from "../common/warning";
import { SubjectSelector } from "../common/subjectSelector";
import styled from "styled-components";
import { ReviewCard } from "./reviewCard";
import { ReviewsDoc } from "@/types/reviewsDoc";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserDoc } from "@/types/userDoc";
import { FaStar } from "react-icons/fa";

const RowPanel = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <Row className="pb-1 pt-1 align-items-center">
    <Col xs={3}>
      <strong>{title}</strong>
    </Col>
    <Col>{children}</Col>
  </Row>
);

type MyInfoCardProps = {
  username: string;
  birthday: string;
  gender: string;
  bio: string;
  email: string;
  grade: string;
  isMentor: boolean;
  reviews: (ReviewsDoc & { id: string })[];
  avgScore: number;
  ktalkID: string;
  profileURL: string;
  desiredSubjects: string[];
  setBio: (bio: string) => void;
  setKtalkID: (ktalkID: string) => void;
  setDesiredSubjects: React.Dispatch<React.SetStateAction<string[]>> | ((state: string[]) => void);
  setProfileImage: (file: File) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export const MyInfoCard = ({
  username,
  birthday,
  gender,
  bio,
  grade,
  reviews,
  avgScore,
  email,
  profileURL,
  isMentor,
  ktalkID,
  desiredSubjects,
  setBio,
  setKtalkID,
  setDesiredSubjects,
  setProfileImage,
  onSubmit,
  onReset,
}: MyInfoCardProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [profileImageError, setProfileImageError] = useState<string>("");
  const randomQ = `${Math.random()}`;

  return (
    <CardContainer>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            if (file.size > 10 * 1024 * 1024) {
              setProfileImageError("10MB 이하의 이미지 파일을 선택해주세요.");
              return;
            }
            if (!file.type.startsWith("image/")) {
              setProfileImageError("이미지 파일을 선택해주세요.");
              return;
            } else {
              setProfileImageError("");
            }
            setProfileImage(file);
          }
        }}
        style={{ marginBottom: "5px", display: "none" }}
        ref={imageInputRef}
      />
      <Row className="pb-1 pt-1">
        <Col>
          <div style={{ fontSize: "18px" }}>
            <b>내 프로필</b> - {isMentor ? "멘토" : "멘티"}
          </div>
        </Col>
      </Row>
      <Row className="pb-1 pt-1 justify-content-center align-items-center">
        <Col xs={4}>
          {/* <div style={{ width: "100%", height: "100%" }}> */}
          <Image
            src={profileURL + randomQ}
            roundedCircle
            alt="profile"
            onClick={() => {
              imageInputRef?.current?.click();
            }}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          {/* </div> */}
        </Col>
        <Col>
          <RowPanel title="이름">{username}</RowPanel>
          <RowPanel title="생일">{birthday}</RowPanel>
          <RowPanel title="성별">{gender}</RowPanel>
          <RowPanel title="학년">{grade}</RowPanel>
        </Col>
      </Row>
      {profileImageError && <Warning>{profileImageError}</Warning>}

      <RowPanel title="이메일">
        <Form.Control size="sm" type="text" value={email} disabled />
      </RowPanel>
      <RowPanel title="카카오톡">
        <Form.Control size="sm" type="text" value={ktalkID} onChange={(e) => setKtalkID(e.target.value)} />
      </RowPanel>
      <RowPanel title="희망과목">
        <SubjectSelector dispatch={setDesiredSubjects} state={desiredSubjects} />
      </RowPanel>

      <Row className="pb-1 pt-1 ">
        <Col>
          <Form.Control
            size="sm"
            as="textarea"
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="pb-1 pt-1 align-items-center">
        <Col xs={12} className="flex justify-content-center gap-2 mt-2">
          <Button variant="dark" onClick={onReset}>
            초기화
          </Button>
          <Button variant="success" type="submit" onClick={onSubmit}>
            저장
          </Button>
        </Col>
      </Row>
      <hr />

      {isMentor && (
        <Accordion className="ml-2 mr-2" defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0" style={{ border: "none" }}>
            <CustomAccordionButton>
              <div className="flex justify-content-between align-items-center" style={{ width: "100%" }}>
                <b>
                  <small>리뷰 보기</small>
                </b>
                <div className="flex justify-content-between align-items-center gap-1 mr-2">
                  <FaStar color="gold" /> {avgScore.toFixed(1)}
                </div>
              </div>
            </CustomAccordionButton>
            <Accordion.Body style={{ padding: 0 }}>
              <div style={{ maxHeight: "450px", overflowY: "scroll" }}>
                {reviews.map((review, idx) => (
                  <ReviewCard
                    username={review.menteeName}
                    profileURL={review.menteeProfileURL}
                    score={review.score}
                    date={review.datetime.toDate().toLocaleDateString()}
                    review={review.review}
                    key={idx}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </CardContainer>
  );
};

const CustomAccordionButton = styled(Accordion.Button)`
  padding: 4px 0;
  border: none;
  margin: 0;
  background: none;
  color: black;
  &:not(.collapsed) {
    background: none;
    color: black;
    ::after {
      color: black;
    }
  }
`;
