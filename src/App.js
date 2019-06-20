import React from "react";
import "./App.css";
import FlipMove from "react-flip-move";
import { scroller } from "react-scroll";

import RunnerCard from "./components/runner_card/index";
import FollowCard from "./components/follow_card/index";
import Stepper from "./components/stepper/index";

import revel_data from "./data/revel-marathon.json";

const chipPlace = runner =>
  runner["data"]["finish"]["chip_time_place_overall"] === ""
    ? 9999
    : parseInt(runner["data"]["finish"]["chip_time_place_overall"]);

const runner_data = revel_data.data
  .filter(runner => runner["data"]["start"] !== undefined)
  .sort((a, b) => (chipPlace(a) < chipPlace(b) ? -1 : 1));

const checkpointLabels = Object.keys(revel_data.data[0].data);

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allRunners: runner_data,
      runners: runner_data.slice(0, 10),
      // runners: runner_data,
      checkpointLabels: checkpointLabels,
      activeCheckpoint: checkpointLabels[0],
      activeCheckpointIndex: 0,
      following: null,
      sexRadioOption: "ALL",
      ageRadioOption: "ALL"
    };
  }

  setActiveCheckpoint = label => {
    const { runners, following } = this.state;
    const chipPlace = runner =>
      runner["data"][label]["chip_time_place_overall"] === ""
        ? 9999
        : parseInt(runner["data"][label]["chip_time_place_overall"]);

    let newRunners = runners.sort((a, b) =>
      chipPlace(a) < chipPlace(b) ? -1 : 1
    );

    const newActiveCheckpointIndex = this.state.checkpointLabels.indexOf(label);

    this.setState(
      {
        activeCheckpoint: label,
        runners: newRunners,
        activeCheckpointIndex: newActiveCheckpointIndex
      },
      () => this.scrollToRunner(following)
    );
  };

  scrollToRunner = runner => {
    if (!runner) {
      return;
    }
    scroller.scrollTo(runner.bib_number, {
      duration: 500,
      smooth: true,
      offset: -300
    });
  };

  setFollow = runner => {
    this.setState({ following: runner });
  };

  filterSex = (runnersList, sortValue) =>
    runnersList.filter(r => sortValue === "ALL" || r.sex === sortValue);

  filterAge = (runnersList, sortObj) =>
    runnersList.filter(
      r =>
        sortObj === "ALL" ||
        (parseInt(r.age) >= sortObj.min && parseInt(r.age) <= sortObj.max)
    );

  filterRunners = (runnersList, sexFilter, ageFilter) =>
    this.filterAge(this.filterSex(runnersList, sexFilter), ageFilter);

  handleSexRadioChange = e => {
    const { allRunners, ageRadioOption } = this.state;
    const sexRadioOption = e.target.value;

    const newRunners = this.filterRunners(
      allRunners,
      sexRadioOption,
      ageRadioOption
    );

    this.setState({
      sexRadioOption,
      runners: newRunners
    });
  };

  handleAgeRadioChange = ageRadioOption => {
    const { allRunners, sexRadioOption } = this.state;

    const newRunners = this.filterRunners(
      allRunners,
      sexRadioOption,
      ageRadioOption
    );

    this.setState({
      ageRadioOption,
      runners: newRunners
    });
  };

  render() {
    const {
      activeCheckpoint,
      activeCheckpointIndex,
      following,
      runners,
      allRunners
    } = this.state;
    return (
      <div className="App">
        <Stepper
          activeCheckpoint={activeCheckpoint}
          activeCheckpointIndex={activeCheckpointIndex}
          checkpointLabels={checkpointLabels}
          handleClick={this.setActiveCheckpoint}
        />
        <div className="filter-container filter-sex">
          <div className="input-wrapper">
            <label>All</label>
            <input
              type="radio"
              value="ALL"
              checked={this.state.sexRadioOption === "ALL"}
              onChange={this.handleSexRadioChange}
            />
          </div>
          <div className="input-wrapper">
            <label>Male</label>
            <input
              type="radio"
              value="M"
              checked={this.state.sexRadioOption === "M"}
              onChange={this.handleSexRadioChange}
            />
          </div>
          <div className="input-wrapper">
            <label>Female</label>
            <input
              type="radio"
              value="F"
              checked={this.state.sexRadioOption === "F"}
              onChange={this.handleSexRadioChange}
            />
          </div>
        </div>
        <div className="filter-container filter-age">
          <div className="input-wrapper">
            <label>{"ALL AGES"}</label>
            <input
              type="radio"
              value={"ALL"}
              checked={this.state.ageRadioOption === "ALL"}
              onChange={() => this.handleAgeRadioChange("ALL")}
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
                checked={this.state.ageRadioOption === range}
                onChange={() => this.handleAgeRadioChange(range)}
              />
            </div>
          ))}
        </div>
        {/* <FlipMove
          className="card-container"
          staggerDelayBy={30}
          onFinishAll={() => this.scrollToRunner(following)}
        > */}
        <div className="card-container">
          {runners.map((runner, index) => (
            <RunnerCard
              {...runner}
              currentPlacement={index + 1}
              key={runner.bib_number}
              activeCheckpoint={this.state.activeCheckpoint}
              scrollName={`${runner.bib_number}`}
              setFollow={this.setFollow}
              currentPlacement={
                runners.findIndex(r => r.bib_number === runner.bib_number) + 1
              }
              overallPlacement={
                runner["data"][activeCheckpoint]["chip_time_place_overall"]
              }
            />
          ))}
        </div>
        {/* </FlipMove> */}
        {following && (
          <FollowCard
            {...following}
            key={following.bib_number}
            activeCheckpoint={activeCheckpoint}
            handleScrollTo={() => this.scrollToRunner(following)}
            setFollow={this.setFollow}
            currentPlacement={
              runners.findIndex(r => r.bib_number === following.bib_number) + 1
            }
            overallPlacement={
              following["data"][activeCheckpoint]["chip_time_place_overall"]
            }
          />
        )}
        <div className="spacer" />
      </div>
    );
  }
}

export default App;
