import type { FormData } from "../register/register";
import React, { useRef, useState } from "react";
import { Row, Col, Image, Form, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { CardContainer } from "../common/cardContainer";
import { PropsWithChildren } from "react";
import { Warning } from "../common/warning";
import { SubjectSelector } from "../common/subjectSelector";

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
  ktalkID: string;
  profileURL: string;
  desiredSubjects: string[];
  isEmailVerified?: boolean;
  isAdminVerified?: boolean;
  setBio: (bio: string) => void;
  setKtalkID: (ktalkID: string) => void;
  setDesiredSubjects: React.Dispatch<React.SetStateAction<string[]>>;
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
  email,
  profileURL,
  isMentor,
  ktalkID,
  desiredSubjects,
  isEmailVerified,
  isAdminVerified,
  setBio,
  setKtalkID,
  setDesiredSubjects,
  setProfileImage,
  onSubmit,
  onReset,
}: MyInfoCardProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [profileImageError, setProfileImageError] = useState<string>("");
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
            src={profileURL}
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

      <Row className="pb-1 pt-1">
        <Col xs={12}>
          <Warning>{!isEmailVerified && "이메일 인증이 완료되지 않았습니다."}</Warning>
          <Warning>{isMentor && !isAdminVerified && "관리자에 의해 멘토로 인증되지 않았습니다."}</Warning>
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
    </CardContainer>
  );
};
