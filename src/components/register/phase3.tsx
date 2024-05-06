import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent } from "./register";
import { useState } from "react";
import { Warning } from "../common/warning";
import { wrapComponent } from "../../utils/wrap";

const Phase3: PhaseComponent = ({ formData, handleChange, setPhase, setProfileImage }) => {
  const rules = ruleFactory("bio");
  const { validity, errorMessages } = useRules(rules, formData);
  addRule(rules, "bio", (bio) => bio.length <= 100, "한 줄 소개는 100자 이하여야 합니다.");

  const [profileImageError, setProfileImageError] = useState<string>("");

  const onSubmit = () => {
    setPhase(4);
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
          style={{ marginBottom: "5px" }}
        />
        {profileImageError && <Warning>{profileImageError}</Warning>}
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
          <Button variant="dark" className="register-nextbutton" onClick={() => setPhase(2)}>
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
