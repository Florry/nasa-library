import React from "react";

export default class RedirectButton extends React.Component {

    render() {
        return (
            <button onClick={e => this._redirect()}>
                {this.props.label}
            </button>
        );
    };

    _redirect() {
        window.location.hash = this.props.to;
    }

}