import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent, FormData } from "./register";
import { useState } from "react";
import { Warning } from "../common/warning";
import { wrapComponent } from "../../utils/wrap";
import { RequiredAst } from "../common/symbol";

const Phase2: PhaseComponent = ({ formData, handleChange, setPhase }) => {
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const rules = ruleFactory<FormData>("email", "password");
  const emailRE = /^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

  addRule(rules, "email", (email) => emailRE.test(email), "올바른 이메일 주소를 입력하세요.");
  addRule(rules, "password", (password) => password == passwordConfirm, "비밀번호가 일치하지 않습니다.");
  addRule(rules, "password", (password) => password.length >= 6, "비밀번호가 너무 짧습니다.");
  const { validity, errorMessages } = useRules(rules, formData);

  const onSubmit = () => {
    setPhase(2);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        {wrapComponent(Warning)(errorMessages)}
        <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
          이메일
          <RequiredAst />
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="이메일"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginBottom: "5px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
          비밀번호
          <RequiredAst />
        </Form.Label>
        <Form.Control
          type="password"
          placeholder="비밀번호 (6자 이상)"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ marginBottom: "5px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
          비밀번호 확인
          <RequiredAst />
        </Form.Label>
        <Form.Control
          type="password"
          placeholder="비밀번호 확인"
          name="password_confirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={{ marginBottom: "5px" }}
        />
      </Form.Group>
      <Form.Group>
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

export default Phase2;
