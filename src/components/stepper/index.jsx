import React from "react";

const Stepper = ({label, activeCheckpoint, checkpointLabels, handleClick}) => (
    <div className="stepper">
        <div className="button-container">
            <div>{activeCheckpoint}</div>
            {checkpointLabels && checkpointLabels.map(label => (
                <button onClick={() => handleClick(label)}>{label}</button>
            ))}
        </div>
    </div>
)

export default Stepper;
