import React, { useEffect } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import styled from "styled-components";

export const subjects = ["english", "math", "science", "computer"];
export const subjectsKor = ["영어", "수학", "과학", "컴퓨터"];
export const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

const StyledToggle = styled(ToggleButton)`
  &:focus {
    box-shadow: none !important;
    outline: none !important;
  }
`;

export const SubjectSelector = ({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<React.SetStateAction<string[]>> | ((state: string[]) => void);
  state: string[];
}) => {
  const [bitState, setBitState] = React.useState<boolean[]>(subjects.map((s) => state.includes(s)));
  useEffect(() => {
    const newState = subjects.filter((_, i) => bitState[i]);
    console.log(newState);
    dispatch(newState);
  }, [bitState]);
  return (
    <ToggleButtonGroup type="checkbox" style={{ width: "100%", justifyContent: "center" }}>
      {subjects.map((subject, i) => (
        <StyledToggle
          key={subject}
          id={subject}
          size="sm"
          value={i}
          variant="outline-success"
          active={bitState[i]}
          onChange={(e) => {
            bitState[i] = !bitState[i];
            setBitState([...bitState]);
          }}
        >
          {subjectsKor[i]}
        </StyledToggle>
      ))}
    </ToggleButtonGroup>
  );
};
