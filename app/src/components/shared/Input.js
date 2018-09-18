import React from "react";

export default class Input extends React.Component {

    render() {
        return <input
            {...this.props}
            onChange={e => this.onChange(e)}
        />
    }

    onChange(e) {
        this.props.onChange(e.target.value, e);
    }

}