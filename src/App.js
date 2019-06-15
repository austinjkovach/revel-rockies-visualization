import React from "react";
import "./App.css";
import FlipMove from "react-flip-move";

import revel_data from "./data/revel-marathon.json";

import RunnerCard from "./components/runner_card/index";

const checkpointLabels = Object.keys(revel_data.data[0].data[0]);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      runners: revel_data.data.slice(0, 10),
      checkpointLabels: checkpointLabels,
      activeLabel: checkpointLabels[0]
    };
  }

  shuffleRunners = () => {
    const { runners } = this.state;

    let len = runners.length;
    let counter = runners.length;
    let oldRunners = runners.slice(0);
    let newRunners = [];

    for (let i = 0; i < counter; i++) {
      let randNum = Math.floor(Math.random() * len);
      const r = oldRunners.splice(randNum, 1)[0];
      newRunners.push(r);
      len = oldRunners.length;
    }

    this.setState({
      runners: newRunners
    });
  };

  setActiveLabel = label => {
    const { runners } = this.state;
    console.log("runners", runners);
    console.log("label", label);
    let newRunners = runners.sort((a, b) =>
      parseInt(a["data"][0][label]["chip_time_place_overall"]) <
      parseInt(b["data"][0][label]["chip_time_place_overall"])
        ? -1
        : 1
    );
    this.setState({ activeLabel: label, runners: newRunners });
  };

  render() {
    return (
      <div className="App">
        <div className="button-container">
          {this.state.checkpointLabels.map(label => (
            <button onClick={() => this.setActiveLabel(label)}>{label}</button>
          ))}
        </div>
        <div>{this.state.activeLabel}</div>
        <FlipMove className="card-container">
          {this.state.runners.map(runner => (
            <RunnerCard
              {...runner}
              key={runner.bib_number}
              activeLabel={this.state.activeLabel}
            />
          ))}
        </FlipMove>
      </div>
    );
  }
}

export default App;
