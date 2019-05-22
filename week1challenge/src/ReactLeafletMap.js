import React from "react";
import "./App.css";
import { Map, Marker, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default class ReactLeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.coords);
    return (
      <div>
        <Map
          style={{ height: "480px", width: "100%" }}
          zoom={14}
          center={[38.03, -78.48]}
        >
          <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {this.props.coords.map(location => {
            return (
              <div>
                <CircleMarker
                  center={[
                    location["coordinates"][0],
                    location["coordinates"][1]
                  ]}
                  radius={5}
                >
                  <Tooltip direction="right" offset={[-8, -2]} opacity={11}>
                    <span>{location["name"]}</span>
                  </Tooltip>
                </CircleMarker>
              </div>
            );
          })}
        </Map>
      </div>
    );
  }
}
