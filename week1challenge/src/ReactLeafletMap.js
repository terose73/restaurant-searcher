import React from "react";
import "./App.css";
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
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
          style={{ height: "600px", width: "100%" }}
          zoom={15}
          center={[this.props.newCoords[0], this.props.newCoords[1]]}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

          {this.props.coords.map(location => {
            return (
              <div>
                <CircleMarker
                  center={[
                    location["coordinates"][0],
                    location["coordinates"][1]
                  ]}
                  radius={6}
                  fillOpacity={0.6}
                  color="purple"
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
