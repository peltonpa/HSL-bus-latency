import React from "react";
import { Button } from "@blueprintjs/core";

export default class BuslineSettings extends React.Component {
  render() {
    return(
      <div>
        <Button 
          onClick={console.log("Context: ", this.context)}
          text="Testi" 
        />
      </div>
    );
  } 
}
