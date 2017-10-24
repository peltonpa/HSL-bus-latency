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
        <Button 
          onClick={() => {
            this.setState({
              style: "hidden",
            });
          }}
          text="Sulje" 
        />
        <p>Tervetuloa HSL:n bussidata-appiin</p>
      </div>
    );
  } 
}
