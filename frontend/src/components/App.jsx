import React from "react";
import BuslineSettings from "./BuslineSettings";
import LeafletContainer from "./LeafletContainer";
import WelcomeBox from "./WelcomeBox";
import "leaflet/dist/leaflet.css";
import "../theme/main.css";
import "@blueprintjs/core/dist/blueprint.css";
import busData from "../../../loaders/bus_data.json";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedBus: 14,
    };
  }

  render() {
    return(
      <div className="root-content">
        <div>
          <WelcomeBox />
        </div>
        <div id="mapid">
          <LeafletContainer
            visibleStop={this.state.selectedBus} 
          />
        </div>
        <div className="root-content buslines">
          <BuslineSettings 
            onclick={() => this.setState({ selectedBus: 58})} 
          />
        </div>
      </div>
    );
  } 
}
