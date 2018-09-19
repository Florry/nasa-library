import React from "react";

/**
 * Input extension component
 */
export default class Input extends React.Component {

    render() {
        return <input
            {...this.props}
            onChange={e => this._onChange(e)}
        />
    }

    /**
     * Handles on change event to just be able to get value right away
     * 
     * @param {React.SyntheticEvent<HTMLInputElement>} e the on change event
     */
    _onChange(e) {
        // @ts-ignore
        this.props.onChange(e.target.value, e);
    }

}