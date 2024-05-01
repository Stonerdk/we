import { CardContainer } from "../common/cardContainer";
import { Row, Col } from "react-bootstrap";

export const AssociatedMentorCard = ({ isMentor }: { isMentor: boolean }) => (
  <CardContainer>
    <Row className="pb-1 pt-1">
      <Col>
        <b style={{ fontSize: "18px" }}>배정된 {isMentor ? "멘티" : "멘토"}</b>
      </Col>
    </Row>
    <Row className="pb-1 pt-1">
      <Col>배정된 멘토가 없습니다</Col>
    </Row>
  </CardContainer>
);
