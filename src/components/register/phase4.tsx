import { Form, Button, ToggleButton, ToggleButtonGroup, Toast, Spinner } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent } from "./register";
import { FormEvent, useState } from "react";
import { Warning } from "../common/warning";
import { wrapComponent } from "../../utils/wrap";
import { RequiredAst } from "../common/symbol";
import { useWarningToast } from "@/hooks/useWarningToast";
import styled from "styled-components";

const Phase3: PhaseComponent = ({ formData, handleChange, setPhase, setFormData, submitRegister }) => {
  const rules = ruleFactory("bio");

  const [loading, setLoading] = useState<boolean>(false);
  const { openToast, WarningToast } = useWarningToast();

  const subjects = ["english", "math", "science", "computer"];
  const subjectsKor = ["영어", "수학", "과학", "컴퓨터"];

  const toggleSubject = (subject: string) => {
    setFormData({
      ...formData,
      desiredSubjects: formData.desiredSubjects.includes(subject)
        ? formData.desiredSubjects.filter((s) => s !== subject)
        : [...formData.desiredSubjects, subject].sort((a, b) => subjects.indexOf(a) - subjects.indexOf(b)),
    });
  };

  addRule(rules, "bio", (bio) => bio.length <= 100, "한 줄 소개는 100자 이하여야 합니다.");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitRegister();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      openToast(`회원가입에 실패했습니다.\n${msg}`);
      return;
    }
    setLoading(false);
    setPhase(5);
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          {wrapComponent(Warning)(
            formData.desiredSubjects.length === 0 ? ["희망 과목을 선택해주세요."] : [""]
          )}
          <Form.Label style={{ marginBottom: "5px" }}>
            희망 과목
            <RequiredAst />
          </Form.Label>
          <ToggleButtonGroup type="checkbox" style={{ width: "100%", justifyContent: "center" }}>
            {subjects.map((subject, i) => (
              <StyledToggle
                key={subject}
                id={subject}
                onChange={(e) => {
                  toggleSubject(subject);
                  e.target.blur();
                }}
                value={i}
                variant="outline-success"
                checked={formData.desiredSubjects.includes(subject)}
              >
                {subjectsKor[i]}
              </StyledToggle>
            ))}
          </ToggleButtonGroup>
          <Form.Label style={{ marginTop: "5px", marginBottom: "5px" }}>카카오톡 ID</Form.Label>
          <Form.Control
            name="ktalkID"
            value={formData.ktalkID}
            onChange={handleChange}
            style={{ marginBottom: "5px" }}
          />
          <div className="button-wrapper">
            <Button variant="dark" className="register-nextbutton" onClick={() => setPhase(3)}>
              이전
            </Button>
            <Button
              variant="success"
              className="register-nextbutton"
              type="submit"
              disabled={formData.desiredSubjects.length === 0 || loading}
            >
              {loading ? <Spinner size="sm" /> : "가입"}
            </Button>
          </div>
        </Form.Group>
      </Form>
      <WarningToast style={{ bottom: "2%" }} />
    </div>
  );
};

const StyledToggle = styled(ToggleButton)`
  &:hover {
    background: transparent;
    color: #198754;
  }
`;

export default Phase3;
