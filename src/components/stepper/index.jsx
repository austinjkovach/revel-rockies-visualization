import React from "react";

const Stepper = ({
  label,
  activeCheckpoint,
  activeCheckpointIndex,
  checkpointLabels,
  handleClick
}) => (
  <div className="stepper">
    <div className="line-through" />
    <div className="stepper-btn-container">
      {checkpointLabels &&
        checkpointLabels.map((label, index) => (
          <div className={"stepper-btn"}>
            <button
              className={activeCheckpointIndex >= index ? "active" : ""}
              onClick={() => handleClick(label)}
            />
            <label>{label}</label>
          </div>
        ))}
    </div>
  </div>
);

export default Stepper;
