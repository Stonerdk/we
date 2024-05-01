import { Form, Button } from "react-bootstrap";
import type { PhaseComponent } from "./register";

const Phase0: PhaseComponent = ({ formData, setPhase, setFormData }) => {
  return (
    <div className="fcg10">
      <Button
        variant="success"
        style={{ height: "60px" }}
        onClick={() => {
          setFormData({ ...formData, isMentor: false });
          setPhase(1);
        }}
      >
        <b>멘티</b>로 가입하기
      </Button>
      <Button
        variant="secondary"
        style={{ height: "60px" }}
        onClick={() => {
          setFormData({ ...formData, isMentor: true });
          setPhase(1);
        }}
      >
        <b>멘토</b>로 가입하기
        <small style={{ fontSize: "11px" }}>
          <br />
          SJA 소속만 가능합니다.
        </small>
      </Button>
    </div>
  );
};

export default Phase0;
