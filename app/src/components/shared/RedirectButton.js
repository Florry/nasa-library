import React from "react";

/**
 * Button extension component for redirecting to a hash
 */
export default class RedirectButton extends React.Component {

    render() {
        return (
            <button onClick={e => this._redirect()}>
                {this.props.label}
            </button>
        );
    };

    /**
     * Redirects to the inputted hash
     */
    _redirect() {
        window.location.hash = this.props.to;
    }

}