import "./phasebar.css";
import { Fragment } from "react";

const Step = ({ number, isCurrent, isCompleted }) => {
  return (
    <div className="step-container">
      <div className={`circle ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""}`}>{number}</div>
    </div>
  );
};

export const PhaseBar = ({ phase }: { phase: number }) => {
  const steps = [1, 2, 3, 4];
  return (
    <div className="progress-container">
      {steps.map((number, index) => (
        <Fragment key={number}>
          {index !== 0 && <div className={`line ${phase > index ? "active" : ""}`}></div>}
          <Step number={number} isCurrent={number === phase} isCompleted={number < phase} />
        </Fragment>
      ))}
    </div>
  );
};
