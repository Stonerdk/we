import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent } from "./register";
import { useState } from "react";
import { Warning } from "../common/warning";
import { wrapComponent } from "../../utils/wrap";

const Phase3: PhaseComponent = ({
  formData,
  handleChange,
  setPhase,
  profileImageUrl,
  setProfileImageUrl,
}) => {
  const rules = ruleFactory("bio");
  const { validity, errorMessages } = useRules(rules, formData);
  addRule(rules, "bio", (bio) => bio.length <= 100, "한 줄 소개는 100자 이하여야 합니다.");

  const onSubmit = () => {
    setPhase(3);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        {wrapComponent(Warning)(errorMessages)}
        <Form.Label style={{ marginBottom: "5px" }}>
          프로필 사진을 선택해주세요.
          <br />
          <small>Zepeto에서 캡처한 본인 이미지를 선택하세요.</small>
        </Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          value={profileImageUrl}
          onChange={(e) => setProfileImageUrl(e.target.value)}
          style={{ marginBottom: "5px" }}
        />
        <Form.Label style={{ marginBottom: "5px" }}>한 줄 소개</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="100자 이내로 입력하세요"
          rows={3}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          style={{ marginBottom: "5px" }}
        />
        <div className="button-wrapper">
          <Button variant="dark" className="register-nextbutton" onClick={() => setPhase(0)}>
            이전
          </Button>
          <Button variant="success" className="register-nextbutton" type="submit" disabled={!validity}>
            다음
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
};

export default Phase3;
