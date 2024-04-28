import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { PhaseComponent, FormData } from "./register";
import { Warning } from "../common/warning";
import { RequiredAst } from "../common/symbol";
import { wrapComponent } from "../../utils/wrap";

const Phase1: PhaseComponent = ({ formData, handleChange, setPhase }) => {
  const rules = ruleFactory<FormData>("name", "grade", "gender");
  const verifyName = (name: string) => name.length >= 2 && name.length <= 12;
  addRule(rules, "name", verifyName, "이름은 2자 이상 12자 이하여야 합니다.");
  const { validity, errorMessages } = useRules(rules, formData);

  const onSubmit = () => {
    setPhase(1);
  };

  return (
    <Form onSubmit={onSubmit}>
      {wrapComponent(Warning)(errorMessages)}
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
      <div className="column">
        <Form.Group style={{ width: "100%" }}>
          <Form.Label style={{ marginBottom: "3px", marginLeft: "5px" }}>
            학년
            <RequiredAst />
          </Form.Label>
          <Form.Control as="select" name="grade" value={formData.grade} onChange={handleChange}>
            <option value="">학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년</option>
            <option value="6">6학년</option>
            <option value="7">7학년</option>
            <option value="8">8학년</option>
            <option value="9">9학년</option>
            <option value="10">10학년</option>
            <option value="11">11학년</option>
            <option value="12">12학년</option>
          </Form.Control>
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
