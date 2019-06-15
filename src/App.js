import React from "react";
import "./App.css";
import FlipMove from "react-flip-move";
import { scroller } from "react-scroll";

import revel_data from "./data/revel-marathon.json";

import RunnerCard from "./components/runner_card/index";
import FollowCard from "./components/follow_card/index";
import Stepper from "./components/stepper/index";

const checkpointLabels = Object.keys(revel_data.data[0].data);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      runners: revel_data.data.slice(0, 10),
      // runners: revel_data.data.filter(
      //   runner => runner["data"]["start"] !== undefined
      // ),
      checkpointLabels: checkpointLabels,
      activeCheckpoint: checkpointLabels[0],
      activeCheckpointIndex: 0,
      following: null
    };
  }

  setActiveCheckpoint = label => {
    const { runners, following } = this.state;
    const chipPlace = runner =>
      parseInt(runner["data"][label]["chip_time_place_overall"]);

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
      () => {
        if (following) {
          setTimeout(() => this.scrollTo(following.bib_number), 400);
          // this.scrollTo(following.bib_number);
        }
      }
    );
  };

  scrollTo = name => {
    scroller.scrollTo(name, {
      duration: 500,
      smooth: true,
      offset: -300
    });
  };

  setFollow = runner => {
    this.setState({ following: runner });
  };

  render() {
    const {
      activeCheckpoint,
      activeCheckpointIndex,
      following,
      runners
    } = this.state;
    return (
      <div className="App">
        <Stepper
          activeCheckpoint={activeCheckpoint}
          activeCheckpointIndex={activeCheckpointIndex}
          checkpointLabels={checkpointLabels}
          handleClick={this.setActiveCheckpoint}
        />
        <FlipMove className="card-container">
          {runners.map(runner => (
            <RunnerCard
              {...runner}
              key={runner.bib_number}
              activeCheckpoint={this.state.activeCheckpoint}
              scrollName={`${runner.bib_number}`}
              setFollow={this.setFollow}
            />
          ))}
        </FlipMove>
        {following && (
          <FollowCard
            {...following}
            key={following.bib_number}
            activeCheckpoint={this.state.activeCheckpoint}
          />
        )}
        <div className="spacer" />
      </div>
    );
  }
}

export default App;
