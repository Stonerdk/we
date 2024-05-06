import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

export const subjects = ["english", "math", "science", "computer"];
export const subjectsKor = ["영어", "수학", "과학", "컴퓨터"];
export const subjectMap: { [key: string]: string } = {
  english: "영어",
  math: "수학",
  science: "과학",
  computer: "컴퓨터",
};

export const SubjectSelector = ({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<React.SetStateAction<string[]>> | ((f: (s: string[]) => string[]) => void);
  state: string[];
}) => {
  return (
    <ToggleButtonGroup type="checkbox" style={{ width: "100%", justifyContent: "center" }}>
      {subjects.map((subject, i) => (
        <ToggleButton
          key={subject}
          id={subject}
          size="sm"
          value={i}
          variant="outline-success"
          active={state.includes(subject)}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch((subjects) => [...subjects, subject]);
            } else {
              dispatch((subjects) => subjects.filter((s) => s !== subject));
            }
          }}
        >
          {subjectsKor[i]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
