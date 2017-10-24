import React from "react";
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import popupmarkerimage from "../theme/bus_stop_2_36x36.png";
import busData from "../../../loaders/bus_data.json";

export default class LeafletContainer extends React.Component {
  render() {
    this.fixLeafletImagePaths();
    const position = [60.17, 24.94];
    this.busStopIcon = L.icon({
      iconUrl: popupmarkerimage,
      iconAnchor: [18, 18],
    });
    console.log(this.renderStops())
    return(
      <div id="mapid">
        <Map center={position} zoom={13} style={{height:"740px"}}>
          <TileLayer
            url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors<br><a href="http://www.clker.com/clipart-map-symbols-bus-stop-black.html">Bus stop icon by Mohamed Ibrahim at Clker.com</a>'
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
          <div>
            <Marker key={stop["gtfsId"]} position={coords} icon={this.busStopIcon}>
              <Popup>
                <span>Bus stop</span>
              </Popup>
            </Marker>
            <CircleMarker
              center={coords}
              radius={40}
              opacity={0.1}
            />
          </div>
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