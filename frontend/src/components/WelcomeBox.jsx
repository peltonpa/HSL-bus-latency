import React from "react";
import { Button } from "@blueprintjs/core";

export default class BuslineSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      style: "white-box",
    }
  }
  render() {
    return(
      <div className={this.state.style}>
        <p>Welcome. This map interactively shows latency (or earliness) of 
          some 20 of the most popular buses in HSL public transit.</p>
        <p>We queried realtime data from Digitransit.fi API for a week and
          compared those times to HSL's schedules. Click on a bus stop to
          see if the bus was (on average) late or early on that specific stop.
        </p>
        <Button 
          onClick={() => {
            this.setState({
              style: "hidden",
            });
          }}
          text="Click to Start" 
          className="pt-large pt-intent-primary"
        />
      </div>
    );
  } 
}
