import React from "react";

const Stepper = ({
  label,
  activeCheckpoint,
  activeCheckpointIndex,
  checkpointLabels,
  handleClick
}) => (
  <div className="stepper">
    <div className="stepper-btn-container">
      {checkpointLabels.map((label, index) => (
        <div
          className={`stepper-btn${
            activeCheckpointIndex >= index ? " active" : ""
          }`}
        >
          <button onClick={() => handleClick(label)} />
          <label>{label}</label>
          <div className="divider" />
        </div>
      ))}
    </div>
  </div>
);

export default Stepper;
