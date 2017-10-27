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
      <div style={{ minWidth: "175px" }} >
        <Button 
          style={{ minWidth: "175px", width: "175px" }}
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          text={<span style={{ float: "left" }}>Select Bus &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Icon iconName={this.state.isOpen ? "pt-icon-double-chevron-up" : "pt-icon-double-chevron-down"} /></span>}
          className="pt-large pt-dark"
        />
        <div style={{ maxWidth: "175px", height: "400px", overflowX: "hidden", overflowY: "scroll" }} className={!this.state.isOpen ? "hidden" : "" } >
          <Collapse isOpen={this.state.isOpen}>
            <BuslineSelector 
              onclick={this.props.onclick} 
              loading={this.props.loading} 
              isLoading={this.props.isLoading}
            />
          </Collapse>
        </div>
      </div>
    );
  } 
}
