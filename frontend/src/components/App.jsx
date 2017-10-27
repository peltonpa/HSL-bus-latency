import React from "react";
import BuslineSettings from "./BuslineSettings";
import LeafletContainer from "./LeafletContainer";
import { Position, Toaster } from "@blueprintjs/core";
import WelcomeBox from "./WelcomeBox";
import TimeSlider from "./TimeSlider";
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
      range: [4, 20],
    };
    this.setLine = this.setLine.bind(this);
    this.loading = this.loading.bind(this);
    this.notLoading = this.notLoading.bind(this);
    this.setRange = this.setRange.bind(this);
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

  setRange(newRange) {
    this.setState({ range: newRange })
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
            range={this.state.range}
            isLoading={this.state.loading}
          />
        </div>
        <div className="root-content buslines">
          <BuslineSettings 
            onclick={this.setLine} 
            loading={this.loading}
            isLoading={this.state.loading}
          />
        </div>
        <div className="slider-box">
          <TimeSlider 
            loading={this.loading}
            setRange={this.setRange}
          />
        </div>
      </div>
    );
  } 
}
