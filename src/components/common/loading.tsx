import { Spinner } from "react-bootstrap";
import styled from "styled-components";

export default function LoadingComponent() {
  return (
    <FullDiv>
      <Spinner animation="border" role="status" />
    </FullDiv>
  );
}

const FullDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
