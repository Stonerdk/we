import { Form, Button } from "react-bootstrap";
import type { PhaseComponent } from "./register";
import { useState } from "react";

const AgreeOnCollection = `[개인정보 제공 동의서]

본 앱에서는 서비스 제공을 위해 필요한 개인정보를 수집하며, 해당 정보는 아래와 같은 목적으로 사용됩니다:
서비스 제공 및 개선: 사용자 식별, 멘토링 매칭 시스템, 서비스 이용에 대한 통계 및 분석, 서비스 개선

[수집하는 개인정보 항목]
필수 정보: 이메일, 이름, 생일, 성별,
선택 정보: 카카오톡 ID

[개인정보의 보유 및 이용 기간]
본 앱은 법적 의무 이행을 위해 수집 시점으로부터 서비스 이용 계약 종료 후 1년 간 개인정보를 보유합니다. 그 이후 해당 정보는 지체 없이 파기합니다.

[동의 거부 권리 및 동의 거부 시 불이익]
귀하는 개인정보 제공에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 정보의 제공 동의를 거부할 경우 서비스 이용에 제한이 있을 수 있습니다.`;

const Phase0: PhaseComponent = ({ formData, setPhase, setFormData }) => {
  const [agree, setAgree] = useState<boolean>(false);
  return (
    <div className="fcg10">
      <Form.Control as="textarea" value={AgreeOnCollection} rows={11} readOnly size="sm" />
      <Form.Check
        type="checkbox"
        label="개인정보 제공에 동의합니다."
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
      />
      <Button
        variant="success"
        style={{ height: "40px" }}
        disabled={!agree}
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
        disabled={!agree}
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
