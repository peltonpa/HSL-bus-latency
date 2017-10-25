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
    console.log("Did update");
    const stopDelays = await this.getLatency(this.props.visibleStop);
    setInterval(() => {
      this.setState({ latencies: stopDelays }, () => {
        /*
        Object.keys(this.state.latencies).forEach((key) => {
          console.log("Key: ", key);
          console.log("Haku keylllä: ", this.state.latencies[key]);
        });
        */
      });
      console.log("Stopdelays fetched");
    }, 5000);
    console.log("Latencies: ", stopDelays);
    this.renderStops();
  }
  
  async getLatency(line) {
    const busId = busData[line].gtfsId;
    let allStopsDelayForBus = {};
    await busData[line].stops.forEach(async (stop) => {
      const busStopDelay = await this.fetchData(busId, stop.gtfsId).then((res) => {
        allStopsDelayForBus[stop.gtfsId] = res;
      });
    });
    return allStopsDelayForBus;
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
  
  renderStops() {
    const stopsToBeRendered = [];
    stopsToBeRendered.push(busData[this.props.visibleStop]["stops"].map((stop) => {
      const stopGtfsId = stop.gtfsId;
      const lat = stop["lat"];
      const lon = stop["lon"];
      const coords = [lat, lon];
      /*
      console.log("State latencyt: ", this.state.latencies);
      console.log("Testilatency HSL:1461108 : ", this.state.latencies["HSL:1461108"]);
      console.log("GTfsid nyt: ", stopGtfsId);
      console.log("Latencyt stopilla: ", this.state.latencies[stopGtfsId]);
      */
      /*
      Object.keys(this.state.latencies).forEach((key) => {
        console.log("Key: ", key);
        console.log("Haku keylllä: ", this.state.latencies[key]);
      });
      */
      return(
        <div>
          <Marker key={stopGtfsId} position={coords} icon={this.busStopIcon}>
            <Popup>
              <span>Average latency in this stop in seconds on specified timeframe: <br /> 
                {
                  stopGtfsId in this.state.latencies && "averageDelay" in this.state.latencies[stopGtfsId] ? this.state.latencies[stopGtfsId].averageDelay : "No data available for this stop."
                }
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
