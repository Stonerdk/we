import { Form, Button } from "react-bootstrap";
import { ruleFactory, addRule, useRules } from "../../hooks/formRules";
import type { RegisterFormData } from "./register";
import { useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Phase5 = ({ formData, router }: { formData: RegisterFormData; router: AppRouterInstance }) => {
  return (
    <Form>
      <Form.Group>
        <Form.Label style={{ marginBottom: "5px" }}>
          <h4>
            <b>거의 다 왔습니다!</b>
          </h4>
          {formData.email}로 인증 링크를 전송했습니다!
          <br />
          <small>인증 링크에 접속하시면 모든 가입이 완료됩니다.</small>
        </Form.Label>
        <div className="button-wrapper">
          <Button
            variant="success"
            className="register-nextbutton"
            onClick={(e) => {
              router.push("/");
            }}
          >
            완료
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
};

export default Phase5;
