import "./phasebar.css";
import { Fragment } from "react";

interface StepProps {
  isCurrent: boolean;
  isCompleted: boolean;
}

const Step = ({ isCurrent, isCompleted }: StepProps) => {
  return (
    <div className="step-container">
      <div className={`circle ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""}`}></div>
    </div>
  );
};

export const PhaseBar = ({ phase }: { phase: number }) => {
  const steps = [0, 1, 2, 3, 4, 5];
  return (
    <div className="progress-container">
      {steps.map((number, index) => (
        <Fragment key={number}>
          {index !== 0 && <div className={`line ${phase > index ? "active" : ""}`}></div>}
          <Step isCurrent={number + 1 === phase} isCompleted={number < phase} />
        </Fragment>
      ))}
    </div>
  );
};
