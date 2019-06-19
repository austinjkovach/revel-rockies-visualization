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
      data
    } = this.props;
    const { activeCheckpoint, handleScrollTo } = this.props;
    return (
      <div className="follow-container">
        <div className="runner-card follow-card">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <h3 className="runner-name">
              {first_name} {last_name}
            </h3>
          </a>
          <h5 className="runner-place">
            {data.finish.chip_time_place_overall}
          </h5>
          <h6 className="runner-bib">{bib_number}</h6>
          <h6 className="runner-place">
            active place: {data[activeCheckpoint]["chip_time_place_overall"]}
          </h6>
          <button onClick={handleScrollTo}>Jump to {data.first_name}</button>
        </div>
      </div>
    );
  }
}

export default FollowCard;
