import type { FormData } from "../register/register";
import { useState } from "react";
import { Row, Col, Image, Form, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { CardContainer } from "../common/cardContainer";
import { PropsWithChildren } from "react";

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
  ktalkID: string;
  desiredSubjects: string[];
  setBio: (bio: string) => void;
  setKtalkID: (ktalkID: string) => void;
  setDesiredSubjects: (desiredSubjects: string[]) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export const MyInfoCard = ({
  username,
  birthday,
  gender,
  bio,
  email,
  ktalkID,
  desiredSubjects,
  setBio,
  setKtalkID,
  setDesiredSubjects,
  onSubmit,
  onReset,
}: MyInfoCardProps) => {
  const subjects = ["english", "math", "science", "computer"];
  const subjectsKor = ["영어", "수학", "과학", "컴퓨터"];

  return (
    <CardContainer>
      <Row className="pb-1 pt-1">
        <Col>
          <b style={{ fontSize: "18px" }}>내 프로필</b>
        </Col>
      </Row>
      <Row className="pb-1 pt-1 justify-content-center align-items-center">
        <Col xs={4}>
          {/* <div style={{ width: "100%", height: "100%" }}> */}
          <Image src="https://via.placeholder.com/150" roundedCircle alt="profile" />
          {/* </div> */}
        </Col>
        <Col>
          <RowPanel title="이름">
            <Form.Control size="sm" type="text" value={username} disabled />
          </RowPanel>
          <RowPanel title="생일">
            <Form.Control size="sm" type="text" value={birthday} disabled />
          </RowPanel>
          <RowPanel title="성별">
            <Form.Control size="sm" type="text" value={gender} disabled />
          </RowPanel>
        </Col>
      </Row>

      <RowPanel title="이메일">
        <Form.Control size="sm" type="text" value={email} disabled />
      </RowPanel>
      <RowPanel title="카카오톡">
        <Form.Control size="sm" type="text" value={ktalkID} onChange={(e) => setKtalkID(e.target.value)} />
      </RowPanel>
      <RowPanel title="희망과목">
        <ToggleButtonGroup type="checkbox" style={{ width: "100%", justifyContent: "center" }}>
          {subjects.map((subject, i) => (
            <ToggleButton
              key={subject}
              id={subject}
              size="sm"
              value={i}
              variant="outline-success"
              active={desiredSubjects.includes(subject)}
              onChange={(e) => {
                if (e.target.checked) {
                  setDesiredSubjects([...desiredSubjects, subject]);
                } else {
                  setDesiredSubjects(desiredSubjects.filter((s) => s !== subject));
                }
              }}
            >
              {subjectsKor[i]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
    </CardContainer>
  );
};
