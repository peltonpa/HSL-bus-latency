import React from "react";
import { Button, Collapse, Icon } from "@blueprintjs/core";
import BuslineSelector from "./BuslineSelector";
import busData from "../../../loaders/bus_data.json";

export default class BuslineSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    }
  }

  render() {
    return(
      <div>
        <Button 
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          text={<span>Select bus <Icon iconName={this.state.isOpen ? "pt-icon-double-chevron-up" : "pt-icon-double-chevron-down"} /></span>}
        />
        <Collapse isOpen={this.state.isOpen}>
          <BuslineSelector onclick={this.props.onclick} />
        </Collapse>
      </div>
    );
  } 
}
