import React from "react";

const SexFilter = props => (
  <div className="filter-container filter-sex">
    <div className="input-wrapper">
      <label>All</label>
      <input
        type="radio"
        value="ALL"
        checked={props.selectedOption === "ALL"}
        onChange={e => props.handleChange(e)}
      />
    </div>
    <div className="input-wrapper">
      <label>Male</label>
      <input
        type="radio"
        value="M"
        checked={props.selectedOption === "M"}
        onChange={e => props.handleChange(e)}
      />
    </div>
    <div className="input-wrapper">
      <label>Female</label>
      <input
        type="radio"
        value="F"
        checked={props.selectedOption === "F"}
        onChange={e => props.handleChange(e)}
      />
    </div>
  </div>
);

export default SexFilter;
