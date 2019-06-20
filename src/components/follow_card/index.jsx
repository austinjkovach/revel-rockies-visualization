import React from "react";
import { Link, Element, animateScroll as scroll, scroller } from "react-scroll";
class FollowCard extends React.Component {
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
      currentPlacement,
      overallPlacement
    } = this.props;
    const { activeCheckpoint, handleScrollTo } = this.props;
    return (
      <div className="follow-container">
        <div className="runner-card follow-card">
          <div className="flex flex-col flex-1">
            <h1 className="runner-place">{currentPlacement}</h1>
            <button onClick={handleScrollTo}>Jump</button>
          </div>
          <div className="flex flex-col flex-4">
            <h3 className="runner-name">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {first_name} {last_name}
              </a>
              <span className="runner-bib">#{bib_number}</span>
            </h3>
            <h4 className="runner-time">
              Time: {data[activeCheckpoint]["course_time"]}
            </h4>
            <h4 className="runner-pace">
              Pace: {data[activeCheckpoint]["interval_pace"]}
            </h4>
            <h6 className="runner-overall">
              Overall: {activeCheckpoint === "start" ? "N/A" : overallPlacement}
            </h6>
          </div>
          <div className="flex flex-col flex-1">
            <span>{age}</span>
            <span>{sex}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default FollowCard;
