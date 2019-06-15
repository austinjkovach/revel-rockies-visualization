import React from 'react';
import './App.css';
import FlipMove from 'react-flip-move';


import revel_data from './data/revel-marathon.json'

import RunnerCard from './components/runner_card/index';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      runners: revel_data.data.slice(0, 10)
    }
  }

  shuffleRunners = () => {
    const {runners} = this.state

    let len = runners.length;
    let counter = runners.length;
    let oldRunners = runners.slice(0);
    let newRunners = []

    for(let i=0;i<counter;i++) {
      let randNum = Math.floor(Math.random() * len)
      const r = oldRunners.splice(randNum, 1)[0]
      newRunners.push(r)
      len = oldRunners.length;
    }

    this.setState({
      runners: newRunners
    })
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.shuffleRunners}>Switch</button>
        <FlipMove>
          {this.state.runners.map(runner => (
            <RunnerCard {...runner} key={runner.bib_number}/>
          ))}
        </FlipMove>
    </div>
    );
  }
}

export default App;
