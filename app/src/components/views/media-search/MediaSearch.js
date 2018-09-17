import React from "react";

export default class MediaSearch extends React.Component {

    // TODO: TEMP
    styling = {
        border: "1px solid black",
        maxWidth: "49%",
        width: "100%",
        float: "left"
    };

    render() {
        return (

            <span>
                <div style={{
                    marginTop: "20px", width: "100%", padding: "10px"
                }}>

                    <div style={this.styling} >
                        <img src="https://images-assets.nasa.gov/image/PIA07081/PIA07081~thumb.jpg" title="Mars Rover Studies Soil on Mars" />
                        <h4>Mars Rover Studies Soil on Mars</h4>
                        <p>Mars Rover Studies Soil on Mars</p>
                        <p>2004-11-30T21:29:24Z</p>
                    </div>

                    <div style={this.styling}>
                        <img src="https://images-assets.nasa.gov/image/PIA04778/PIA04778~thumb.jpg" title="Mars Rover Studies Soil on Mars" />
                        <h4>Mars Rover Studies Soil on Mars</h4>
                        <p>Mars Rover Studies Soil on Mars</p>
                        <p>2004-11-30T21:29:24Z</p>
                    </div>
                    <div style={this.styling} >
                        <img src="https://images-assets.nasa.gov/image/PIA07081/PIA07081~thumb.jpg" title="Mars Rover Studies Soil on Mars" />
                        <h4>Mars Rover Studies Soil on Mars</h4>
                        <p>Mars Rover Studies Soil on Mars</p>
                        <p>2004-11-30T21:29:24Z</p>
                    </div>

                    <div style={this.styling}>
                        <img src="https://images-assets.nasa.gov/image/PIA07081/PIA07081~thumb.jpg" title="Mars Rover Studies Soil on Mars" />
                        <h4>Mars Rover Studies Soil on Mars</h4>
                        <p>Mars Rover Studies Soil on Mars</p>
                        <p>2004-11-30T21:29:24Z</p>
                    </div>

                </div>
            </span >

        );
    }

}