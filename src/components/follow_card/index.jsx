import React from "react";
class FollowCard extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  render() {
    const {
      link,
      scrollName,
      first_name,
      last_name,
      bib_number,
      sex,
      age,
      data,
      activeCheckpoint,
      handleButton,
      handleUnfollow,
      currentPlacement
    } = this.props;
    return (
      <div className="runner-card" name={scrollName}>
        <button
          className="remove-btn"
          onClick={() => handleUnfollow(this.props)}
        >
          X
        </button>
        <div className="flex flex-col flex-1">
          <h1 className="runner-place">
            {currentPlacement > 0 ? currentPlacement : "N/A"}
          </h1>
          <button
            className="follow-btn"
            onClick={() => handleButton(this.props)}
          >
            {"Jump"}
          </button>
        </div>
        <div className="flex flex-col flex-4">
          <h3 className="runner-name">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {first_name} {last_name}
            </a>
            <span className="runner-bib">#{bib_number}</span>
          </h3>
          <h4 className="runner-time">
            Course Time: {data[activeCheckpoint]["course_time"]}
          </h4>
          <h4 className="runner-pace">
            Pace: {data[activeCheckpoint]["interval_pace"]}
          </h4>
          <h6 className="runner-overall">
            Overall:{" "}
            {activeCheckpoint === "start"
              ? "N/A"
              : data[activeCheckpoint]["chip_time_place_overall"]}
          </h6>
        </div>
        <div className="flex flex-col flex-1">
          <span>{age}</span>
          <span>{sex}</span>
        </div>
      </div>
    );
  }
}

export default FollowCard;
