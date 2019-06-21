import React from "react";
import "./App.css";
import FlipMove from "react-flip-move";
import { scroller } from "react-scroll";

import RunnerCard from "./components/runner_card/index";
import FollowCard from "./components/follow_card/index";
import Stepper from "./components/stepper/index";
import AgeFilter from "./components/age_filter/index";
import SexFilter from "./components/sex_filter/index";

import revel_data from "./data/revel-marathon.json";

const chipPlace = runner =>
  runner["data"]["finish"]["chip_time_place_overall"] === ""
    ? 9999
    : parseInt(runner["data"]["finish"]["chip_time_place_overall"]);

const runner_data = revel_data.data
  .filter(runner => runner["data"]["start"] !== undefined)
  .sort((a, b) => (chipPlace(a) < chipPlace(b) ? -1 : 1));

const checkpointLabels = Object.keys(revel_data.data[0].data);

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
      following: [],
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

    let newFollowing = following.sort((a, b) =>
      chipPlace(a) < chipPlace(b) ? -1 : 1
    );

    const newActiveCheckpointIndex = this.state.checkpointLabels.indexOf(label);

    this.setState(
      {
        activeCheckpoint: label,
        runners: newRunners,
        following: newFollowing,
        activeCheckpointIndex: newActiveCheckpointIndex
      },
      () => this.scrollToRunner(following[0])
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

  addFollow = runner => {
    const { activeCheckpoint, following } = this.state;

    const chipPlace = runner =>
      runner["data"][activeCheckpoint]["chip_time_place_overall"] === ""
        ? 9999
        : parseInt(runner["data"][activeCheckpoint]["chip_time_place_overall"]);

    let newFollowing = [...following, runner].sort((a, b) =>
      chipPlace(a) < chipPlace(b) ? -1 : 1
    );

    this.setState({ following: newFollowing });
  };

  removeFollow = runner => {
    const { following } = this.state;
    const newFollowing = following.filter(
      r => r.bib_number !== runner.bib_number
    );
    this.setState({ following: newFollowing });
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
        <SexFilter
          handleChange={this.handleSexRadioChange}
          selectedOption={this.state.sexRadioOption}
        />
        <AgeFilter
          handleChange={this.handleAgeRadioChange}
          selectedOption={this.state.ageRadioOption}
        />
        <FlipMove
          className="card-container"
          staggerDelayBy={30}
          onFinishAll={() => this.scrollToRunner(following[0])}
          disableAllAnimations={runners.length > 100}
        >
          {runners.map((runner, index) => (
            <RunnerCard
              {...runner}
              currentPlacement={index + 1}
              key={runner.bib_number}
              activeCheckpoint={this.state.activeCheckpoint}
              scrollName={`${runner.bib_number}`}
              handleButton={this.addFollow}
              currentPlacement={
                runners.findIndex(r => r.bib_number === runner.bib_number) + 1
              }
              overallPlacement={
                runner["data"][activeCheckpoint]["chip_time_place_overall"]
              }
            />
          ))}
        </FlipMove>
        <div className="follow-container">
          <FlipMove
            staggerDelayBy={30}
            disableAllAnimations={runners.length > 100}
          >
            {following.map((follower, index) => (
              <FollowCard
                {...follower}
                currentPlacement={index + 1}
                key={`${follower.bib_number}`}
                activeCheckpoint={this.state.activeCheckpoint}
                scrollName={`${follower.bib_number}`}
                handleUnfollow={this.removeFollow}
                handleButton={this.scrollToRunner}
                currentPlacement={
                  runners.findIndex(r => r.bib_number === follower.bib_number) +
                  1
                }
                overallPlacement={
                  follower["data"][activeCheckpoint]["chip_time_place_overall"]
                }
              />
            ))}
          </FlipMove>
        </div>
        <div className="spacer" />
      </div>
    );
  }
}

export default App;
