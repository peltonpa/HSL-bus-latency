import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import popupmarkerimage from "../theme/bus_stop48x48_bw.png";
import busData from "../../../loaders/bus_data.json";

export default class LeafletContainer extends React.Component {
  render() {
    this.fixLeafletImagePaths();
    const position = [60.17, 24.94];
    this.busStopIcon = L.icon({
      iconUrl: popupmarkerimage,
      iconAnchor: [24, 44],
    });
    console.log(this.renderStops());
    return(
      <div id="mapid">
        <Map center={position} zoom={13} style={{height:"600px"}}>
          <TileLayer
            url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors<br><a href="https://thenounproject.com/serre.marc/">Bus stop icon copyright of Marc Serre</a>'
          />
          {this.renderStops()}
        </Map>
      </div>
    );
  } 
  
  renderStops() {
    const stopsToBeRendered = [];
    this.props.visibleStops.forEach((visibleStop) => {
      stopsToBeRendered.push(busData[visibleStop]["stops"].map((stop) => {
        const lat = stop["lat"];
        const lon = stop["lon"];
        const coords = [lat, lon];
        return(
          <Marker key={stop["gtfsId"]} position={coords} icon={this.busStopIcon}>
            <Popup>
              <span>Bus stop</span>
            </Popup>
          </Marker>
        );
      }));
    });
    return stopsToBeRendered;
  }

  fixLeafletImagePaths() {
    L.Icon.Default.imagePath = '.';
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }
}