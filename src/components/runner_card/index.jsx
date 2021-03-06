import React from "react";
class RunnerCard extends React.Component {
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
      currentPlacement
    } = this.props;
    return (
      <div className="runner-card" name={scrollName}>
        <div className="flex flex-col flex-1">
          <h1 className="runner-place">
            {currentPlacement > 0 ? currentPlacement : "N/A"}
          </h1>
          <button
            className="follow-btn"
            onClick={() => handleButton(this.props)}
          >
            {"Follow"}
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

export default RunnerCard;

// {
//     "link": "https://www.runrevel.com/rdv/results?pk=1580643",
//     "last_name": "Rusu",
//     "first_name": "Petru",
//     "bib_number": "1527",
//     "sex": "M",
//     "age": "28",
//     "data": {
//           "start": {
//               "time": "6:00:01AM",
//               "course_distance": "0.0",
//               "course_time": "00:00.00",
//               "course_pace": "",
//               "interval_distance": "0.0",
//               "interval_time": "",
//               "interval_pace": "",
//               "chip_time_place_overall": "4",
//               "chip_time_place_sex": "3 M",
//               "chip_time_place_age": ""
//           },
//           "first_quarter": {
//               "time": "6:38:09AM",
//               "course_distance": "6.55",
//               "course_time": "38:08.31",
//               "course_pace": "5:49",
//               "interval_distance": "6.55",
//               "interval_time": "38:08.31",
//               "interval_pace": "5:49",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           },
//           "half_way": {
//               "time": "7:15:27AM",
//               "course_distance": "13.1",
//               "course_time": "1:15:25.93",
//               "course_pace": "5:45",
//               "interval_distance": "6.55",
//               "interval_time": "37:17.61",
//               "interval_pace": "5:41",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           },
//           "three_quarter": {
//               "time": "7:54:30AM",
//               "course_distance": "19.65",
//               "course_time": "1:54:29.39",
//               "course_pace": "5:49",
//               "interval_distance": "6.55",
//               "interval_time": "39:03.46",
//               "interval_pace": "5:57",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           },
//           "5k_to_go": {
//               "time": "8:16:57AM",
//               "course_distance": "23.1",
//               "course_time": "2:16:56.81",
//               "course_pace": "5:55",
//               "interval_distance": "3.45",
//               "interval_time": "22:27.42",
//               "interval_pace": "6:30",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           },
//           "1_mile_to_go": {
//               "time": "8:30:24AM",
//               "course_distance": "25.2",
//               "course_time": "2:30:23.85",
//               "course_pace": "5:58",
//               "interval_distance": "2.1",
//               "interval_time": "13:27.03",
//               "interval_pace": "6:24",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           },
//           "finish": {
//               "time": "8:37:35AM",
//               "course_distance": "26.2",
//               "course_time": "2:37:34.24",
//               "course_pace": "6:00",
//               "interval_distance": "1.0",
//               "interval_time": "07:10.38",
//               "interval_pace": "7:10",
//               "chip_time_place_overall": "1",
//               "chip_time_place_sex": "1 M",
//               "chip_time_place_age": ""
//           }
//       }
// },
