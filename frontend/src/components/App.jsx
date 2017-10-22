import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import LeafletContainer from "./LeafletContainer";
import "leaflet/dist/leaflet.css";
import "../theme/main.css";

export default class App extends React.Component {
  render() {
    return(
      <div>
        <LeafletContainer
          visibleStops={[14]} 
        />
      </div>
    );
  } 
}
