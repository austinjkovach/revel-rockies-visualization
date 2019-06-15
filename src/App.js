import React from "react";
import "./App.css";
import FlipMove from "react-flip-move";

import revel_data from "./data/revel-marathon.json";

import RunnerCard from "./components/runner_card/index";
import Stepper from "./components/stepper/index";

const checkpointLabels = Object.keys(revel_data.data[0].data);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      runners: revel_data.data.slice(0, 10),
      // runners: revel_data.data.filter(runner => runner["data"]["start"] !== undefined),
      checkpointLabels: checkpointLabels,
      activeCheckpoint: checkpointLabels[0],
      activeCheckpointIndex: 0
    };
  }

  setActiveCheckpoint = label => {
    const { runners } = this.state;
    const chipPlace = runner =>
      parseInt(runner["data"][label]["chip_time_place_overall"]);

    let newRunners = runners.sort((a, b) =>
      chipPlace(a) < chipPlace(b) ? -1 : 1
    );

    const newActiveCheckpointIndex = this.state.checkpointLabels.indexOf(label);

    this.setState({
      activeCheckpoint: label,
      runners: newRunners,
      activeCheckpointIndex: newActiveCheckpointIndex
    });
  };

  render() {
    return (
      <div className="App">
        <Stepper
          activeCheckpoint={this.state.activeCheckpoint}
          activeCheckpointIndex={this.state.activeCheckpointIndex}
          checkpointLabels={checkpointLabels}
          handleClick={this.setActiveCheckpoint}
        />
        <FlipMove className="card-container">
          {this.state.runners.map(runner => (
            <RunnerCard
              {...runner}
              key={runner.bib_number}
              activeCheckpoint={this.state.activeCheckpoint}
            />
          ))}
        </FlipMove>
      </div>
    );
  }
}

export default App;
