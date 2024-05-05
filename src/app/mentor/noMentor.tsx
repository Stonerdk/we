import styled from "styled-components";

export const NoMentor = () => {
  return <FullContainer>아직 배정된 멘토가 없습니다.</FullContainer>;
};

const FullContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: #6c757d;
`;
