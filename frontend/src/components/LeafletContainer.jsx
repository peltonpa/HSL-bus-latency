import React from "react";
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Spinner } from "@blueprintjs/core";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import popupmarkerimage from "../theme/bus_stop_2_36x36.png";
import busData from "../../../loaders/bus_data.json";

export default class LeafletContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      latencies: {currentBus: 14},
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
    this._ismounted = true;
  }

  async componentWillReceiveProps(nextProps) {
    await this.runDelays(nextProps.visibleStop); 
  }

  async runDelays(visibleStop) {
    const oldLatency = Object.keys(this.state.latencies)[0] ? Object.keys(this.state.latencies).sort()[0] : "";
    const stopDelays = await this.getLatency(visibleStop).then((result) => {
      return result;
    });
    this.setState({ latencies: stopDelays }, () => {
      if (this.props.visibleStop === this.state.latencies.currentBus) {
        this.props.notLoading();
      }
    });
  }
  
  async getLatency(line) {
    const busId = busData[line].gtfsId;
    let allStops = {currentBus: line};
    const stops = busData[line].stops.map((stop) => {
      return stop.gtfsId;
    });
    let response = await this.fetchData(busId, stops);
    response.currentBus = line;
    console.log("Response: ", response);
    return response;
  }

  async fetchData(busId, stopIds) {
    const data = {
      "starts": 0,
      "ends": 10000,
      "stopgtfsids": stopIds,
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
    if (delay == null) {
      return(
        <span>No data available for this stop. </span>
      )
    }
    if (isNaN(delay)) {
      const spanStyle = {
        fontSize: "75%",
      };
      return (
        <div>
          <span>Fetching data... <Spinner /></span> 
          <br />
          <span style={spanStyle}>(This might take ten seconds)</span>
        </div>
      );
    }
    const minutes = Math.floor(delay / 60);
    const seconds = Math.floor(delay % 60);
    const red = { color: "crimson", fontSize: "200%" };
    const blue = { color: "lightskyblue", fontSize: "200%" };
    
    const toRender = delay > 0 ? 
    <div className="delaytext"><span style={red}>{minutes}</span><p> &nbsp;minutes&nbsp; </p><span style={red}>{seconds}</span><p> &nbsp;seconds&nbsp; </p></div> : 
    <div className="delaytext"><span style={blue}>{minutes}</span><p> &nbsp;minutes&nbsp; </p><span style={blue}>{seconds}</span><p> &nbsp;seconds&nbsp; </p></div>;
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
                <div className="poptext">
                  <span><h5>Stop name:</h5> {stop.name}, {stop.desc}<br /><br />
                    <h5>ID:</h5> {stopGtfsId} <br /><br />
                    <h5><a href={stop.url}>Info at HSL website</a></h5><br />
                    <h5>Average arrival delay:</h5> {this.getDelaySecondsForRendering(stopGtfsId)}
                  </span>
                </div>
            </Popup>
          </Marker>
          <CircleMarker
            color={(stopGtfsId in this.state.latencies && "averageDelay" in this.state.latencies[stopGtfsId] && this.state.latencies[stopGtfsId].averageDelay > 0) ? "red" : "blue" }
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
