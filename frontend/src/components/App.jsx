import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import BuslineSettings from "./BuslineSettings";
import LeafletContainer from "./LeafletContainer";
import WelcomeBox from "./WelcomeBox";
import "leaflet/dist/leaflet.css";
import "../theme/main.css";

export default class App extends React.Component {
  render() {
    return(
      <div className="root-content">
        <div>
          <WelcomeBox />
        </div>
        <div id="mapid">
          <LeafletContainer
            visibleStops={[14]} 
          />
        </div>
        <div className="root-content buslines">
          <BuslineSettings />
        </div>
      </div>
    );
  } 
}
