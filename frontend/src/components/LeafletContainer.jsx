import React from "react";
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import popupmarkerimage from "../theme/bus_stop_2_36x36.png";
import busData from "../../../loaders/bus_data.json";

export default class LeafletContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      latencies: {},
    }
  }

  render() {
    this.fixLeafletImagePaths();
    const position = [60.17, 24.94];
    this.busStopIcon = L.icon({
      iconUrl: popupmarkerimage,
      iconAnchor: [18, 18],
    });
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

  async componentDidMount() {
    await this.runDelays(this.props.visibleStop);
  }

  async componentWillReceiveProps(nextProps) {
    await this.runDelays(nextProps.visibleStop); 
  }

  async runDelays(visibleStop) {
    const stopDelays = await this.getLatency(visibleStop).then((result) => {
      return result;
    });
    this.setState({ latencies: stopDelays });
  }
  
  async getLatency(line) {
    const busId = busData[line].gtfsId;
    let allStops = {};
    await Promise.all(busData[line].stops.map(async (stop) => {
      allStops[stop.gtfsId] = await this.fetchData(busId, stop.gtfsId).then((res) => {
        return res;
      });
      return null;
    }));
    return allStops;
  }

  async fetchData(busId, stopId) {
    const data = {
      "starts": 0,
      "ends": 10000,
      "stopgtfsid": stopId,
      "tripgtfsid": busId,
    };
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const json = JSON.stringify(data);
    const response = await fetch("http://hsldata.science/hslapi", {
      method: "POST",
      headers: headers,
      body: json,
      cache: "default",
      mode: "cors"
    }).then((res) => {
      return res.json();
    }).then((dataRes) => {
      return dataRes;
    });
    return response;
  }

  getDelaySecondsForRendering(stopGtfsId) {
    const delay = (stopGtfsId in this.state.latencies && "averageDelay" in this.state.latencies[stopGtfsId]) ? this.state.latencies[stopGtfsId].averageDelay : "No data available for this stop.";
    if (isNaN(delay)) {
      return delay;
    }
    const toRender = delay > 0 ? <span>{delay}</span> : <span>{delay}</span>;
    return toRender;
  }
  
  renderStops() {
    const stopsToBeRendered = [];
    stopsToBeRendered.push(busData[this.props.visibleStop]["stops"].map((stop) => {
      const stopGtfsId = stop.gtfsId;
      const lat = stop["lat"];
      const lon = stop["lon"];
      const coords = [lat, lon];

      return(
        <div>
          <Marker key={stopGtfsId} position={coords} icon={this.busStopIcon}>
            <Popup>
              <span>Stop name: {stop.desc}, {stop.name}<br /> 
              ID: {stopGtfsId}<br />
              <a href={stop.url}>Schedules at HSL website</a><br />
                {this.getDelaySecondsForRendering(stopGtfsId)}
              </span>
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
