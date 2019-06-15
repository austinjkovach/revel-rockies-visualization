import React from 'react';

class RunnerCard extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {
            first_name,
            last_name
        } = this.props
        return(
            <div>{first_name} {last_name}</div>
        )
    }
}

export default RunnerCard
