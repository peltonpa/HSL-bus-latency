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
      loading: true,
    };
    this.setLine = this.setLine.bind(this);
    this.loading = this.loading.bind(this);
    this.notLoading = this.notLoading.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
  }

  setLine(line) {
    this.setState({ selectedBus: line });
  }

  loading() {
    this.setState({ loading: true });
  }

  notLoading() {
    this.setState({ loading: false });
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
            notLoading={this.notLoading}
          />
        </div>
        <div className="root-content buslines">
          <BuslineSettings 
            onclick={this.setLine} 
            loading={this.loading}
            isLoading={this.state.loading}
          />
        </div>
      </div>
    );
  } 
}
