import { Form, Button, Toast, Spinner } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent, RegisterFormData } from "./register";
import { FormEvent, Fragment, useState } from "react";
import { Warning } from "../common/warning";
import { wrapComponent } from "../../utils/wrap";
import { RequiredAst } from "../common/symbol";

const Phase2: PhaseComponent = ({ formData, handleChange, setPhase, checkValidEmail }) => {
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const rules = ruleFactory<RegisterFormData>("email", "password");
  const emailRE = formData.isMentor
    ? /s[0-9]+@sjajeju.kr/
    : /^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

  addRule(
    rules,
    "email",
    (email) => emailRE.test(email),
    formData.isMentor ? "멘토는 sjajeju 이메일을 사용해야 합니다." : "올바른 이메일 주소를 입력하세요."
  );
  addRule(rules, "password", (password) => password == passwordConfirm, "비밀번호가 일치하지 않습니다.");
  addRule(rules, "password", (password) => password.length >= 6, "비밀번호가 너무 짧습니다.");
  const { validity, errorMessages } = useRules(rules, formData);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await checkValidEmail();
    setLoading(false);
    if (res) {
      setPhase(3);
    } else {
      setShowToast(true);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
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
            <Button variant="dark" className="register-nextbutton" onClick={() => setPhase(1)}>
              이전
            </Button>
            <Button
              variant="success"
              className="register-nextbutton"
              type="submit"
              disabled={!validity || loading}
            >
              {loading ? <Spinner size="sm" /> : "다음"}
            </Button>
          </div>
        </Form.Group>
      </Form>

      <Toast
        onClose={() => setShowToast(false)}
        delay={3000}
        show={showToast}
        autohide
        animation={true}
        style={{ position: "absolute", bottom: "2%", left: "5%", width: "90%" }}
      >
        <Toast.Body>
          <Warning>
            중복된 이메일이 존재합니다.
            <br />
            다른 이메일을 입력해주세요.
          </Warning>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Phase2;
