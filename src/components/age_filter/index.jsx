import React from "react";

const ageRangesMax = [
  { min: 0, max: 18 },
  { min: 19, max: 24 },
  { min: 25, max: 29 },
  { min: 30, max: 34 },
  { min: 35, max: 39 },
  { min: 40, max: 44 },
  { min: 45, max: 49 },
  { min: 50, max: 54 },
  { min: 55, max: 59 },
  { min: 60, max: 64 },
  { min: 65, max: 69 },
  { min: 70, max: 74 },
  { min: 75, max: 79 },
  { min: 80, max: 120 }
];

const AgeFilter = props => (
  <div className="filter-container filter-age">
    <div className="input-wrapper">
      <label>{"ALL AGES"}</label>
      <input
        type="radio"
        value={"ALL"}
        checked={props.selectedOption === "ALL"}
        onChange={() => props.handleChange("ALL")}
      />
    </div>
    {ageRangesMax.map(range => (
      <div key={range.max} className="input-wrapper">
        <label>
          {range.min}-{range.max}
        </label>
        <input
          type="radio"
          value={range}
          checked={props.selectedOption === range}
          onChange={() => props.handleChange(range)}
        />
      </div>
    ))}
  </div>
);

export default AgeFilter;
