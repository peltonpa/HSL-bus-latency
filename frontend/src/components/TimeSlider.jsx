import React from "react";
import { NumberRange, RangeSlider } from "@blueprintjs/core";
import BuslineSelector from "./BuslineSelector";
import busData from "../../../loaders/bus_data.json";

export default class BuslineSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      range: [4, 20],
    }
  }

  handleValueChange(newRange) {
    this.setState({ range: newRange })
  }

  render() {
    return(
      <div style={{ textAlign: "center" }}>
        <span>Adjust this slider to set times of day on which to query bus latency. </span>
        <RangeSlider
          min={0}
          max={24} 
          stepSize={1}
          labelStepSize={1}
          onChange={(range) => {
            this.handleValueChange(range);
            this.props.loading();
            this.props.setRange(range);
          }}
          value={this.state.range}
        />
      </div>
    );
  } 
}
