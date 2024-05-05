import { PropsWithChildren } from "react";
import { Col, Row } from "react-bootstrap";

export const RowPanel = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <Row className="pb-1 pt-1 align-items-center">
    <Col xs={2}>
      <strong>{title}</strong>
    </Col>
    <Col>{children}</Col>
  </Row>
);
