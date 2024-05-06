import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent, RegisterFormData } from "./register";
import { Warning } from "../common/warning";
import { RequiredAst } from "../common/symbol";
import { wrapComponent } from "../../utils/wrap";

const Phase1: PhaseComponent = ({ formData, handleChange, setPhase }) => {
  const rules = ruleFactory<RegisterFormData>("name", "birthday", "gender");
  const verifyBirthday = (birthday: string) => {
    if (birthday.length !== 6 || isNaN(Number(birthday))) {
      return false;
    }

    const yearPrefix = parseInt(birthday.substring(0, 2)) > 21 ? "19" : "20";
    const year = parseInt(yearPrefix + birthday.substring(0, 2));
    const month = parseInt(birthday.substring(2, 4));
    const day = parseInt(birthday.substring(4, 6));

    if (year < 1960 || year > 2021) {
      return false;
    }

    const birthdate = new Date(year, month - 1, day + 1);
    if (
      birthdate.getFullYear() !== year ||
      birthdate.getMonth() !== month - 1 ||
      birthdate.getDate() !== day + 1
    ) {
      return false;
    }

    // 입력된 날짜가 현재 날짜 이전인지 확인
    const today = new Date();
    if (birthdate >= today) {
      return false;
    }

    return true;
  };
  const verifyName = (name: string) => name.length >= 2 && name.length <= 12;
  addRule(rules, "name", verifyName, "이름은 2자 이상 12자 이하여야 합니다.");
  addRule(rules, "birthday", verifyBirthday, "올바른 생년월일을 입력해 주세요.");
  const { validity, errorMessages } = useRules(rules, formData);

  const onSubmit = () => {
    setPhase(2);
  };

  return (
    <Form onSubmit={onSubmit}>
      {wrapComponent(Warning)(errorMessages)}
      {formData.isMentor ? (
        <div className="column">
          <Form.Group style={{ width: "100%" }}>
            <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
              이름
              <RequiredAst />
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="2자 이상 12자 이하"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group style={{ width: "100%" }}>
            <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
              학년
              <RequiredAst />
            </Form.Label>
            <Form.Control as="select" name="grade" value={formData.grade ?? ""} onChange={handleChange}>
              <option value="">학년</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}학년
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
      ) : (
        <Form.Group>
          <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
            이름
            <RequiredAst />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="2자 이상 12자 이하"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>
      )}
      <div className="column">
        <Form.Group style={{ width: "100%" }}>
          <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
            생일
            <RequiredAst />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="ex. 091205"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group style={{ width: "100%" }}>
          <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
            성별
            <RequiredAst />
          </Form.Label>
          <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">성별</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">기타</option>
          </Form.Control>
        </Form.Group>
      </div>
      <div className="button-wrapper">
        <Button variant="success" type="submit" disabled={!validity} className="register-nextbutton">
          다음
        </Button>
      </div>
    </Form>
  );
};

export default Phase1;
