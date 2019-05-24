import React, { createRef } from "react";
import "./App.css";
import axios from "axios";
import ReactLeafletMap from "./ReactLeafletMap.js";
import RestaurantList from "./RestaurantList.js";
import { Affix } from "antd";
import { Grid, Header, Button, Segment } from "semantic-ui-react";
const API_KEY = process.env.REACT_APP_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      category: "",
      coords: [],
      address: "San Francisco",
      searchAddress: false,
      newCoords: [38.029649, -78.476841]
    };
  }

  changeParent = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  handleAddress = event => {
    this.setState({
      address: event.target.value
    });
  };

  componentDidMount() {
    let coords = [];

    axios
      .get(
        "https://cors-anywhere-hclaunch.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
          this.state.address +
          "&key=AIzaSyBQRbOl8Z5HnrY12zURP84C6Tdwsoy-HUI"
      )
      .then(response => {
        let address = response.data.results[0].geometry.location;

        this.setState({
          newCoords: [address.lat, address.lng],
          searchAddress: false
        });

        axios
          .get(
            "https://cors-anywhere-hclaunch.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
              this.state.newCoords[0] +
              "," +
              this.state.newCoords[1] +
              "&radius=1000&opennow&type=restaurant&name=" +
              this.state.category +
              "&key=+" +
              API_KEY
          )

          .then(response => {
            try {
              console.log(response.data.results);
              for (let i = 0; i < response.data.results.length; i++) {
                coords.push({
                  coordinates: [
                    response.data.results[i].geometry.location.lat,
                    response.data.results[i].geometry.location.lng
                  ],
                  name: response.data.results[i].name,
                  open_now: response.data.results[i].opening_hours.open_now
                });
              }
            } catch (err) {
              console.log(err);
            }

            this.setState({
              restaurants: response.data.results,
              coords: coords
            });

            console.log(this.state.newCoords[0]);
            console.log(this.state.newCoords[1]);
          });
      });
  }

  handleCategory = event => {
    this.setState({
      category: event.target.value
    });
  };

  handleClick = event => {
    this.componentDidMount();
  };

  render() {
    return (
      <div>
        <Grid divided="true" centered="true">
          <Grid.Column width="7">
            <Grid.Row style={{ padding: "1em 0em" }}>
              <Header
                as="h3"
                content="Restauraunt Screener"
                textAlign="center"
              />
            </Grid.Row>
            <Grid.Column>
              <Segment>
                <Grid.Row style={{ padding: "1em 7.5em" }}>
                  <div class="ui input">
                    <input
                      type="text"
                      value={this.state.category}
                      onChange={this.handleCategory}
                      placeholder="Cuisine Category..."
                    />
                  </div>{" "}
                  <Button name="submitButton" onClick={this.handleClick}>
                    Search
                  </Button>
                </Grid.Row>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Grid.Row style={{ padding: "1em 7.5em" }}>
                  <div class="ui input">
                    <input
                      type="text"
                      value={this.state.address}
                      onChange={this.handleAddress}
                      placeholder="Address..."
                    />
                  </div>{" "}
                  <Button name="submitButton" onClick={this.handleClick}>
                    Search
                  </Button>
                </Grid.Row>
              </Segment>
            </Grid.Column>
            <RestaurantList restaurants={this.state.restaurants} />
            <Grid.Row style={{ padding: "1em 7.5em" }}>
              <a href="https://www.linkedin.com/in/theodore-rose-315527156/">
                <button class="ui linkedin button">
                  <i class="linkedin icon" />
                  LinkedIn
                </button>
              </a>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column width="9">
            <Affix offsetTop={this.state.top}>
              <ReactLeafletMap
                coords={this.state.coords}
                newCoords={this.state.newCoords}
              />
            </Affix>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
export default App;
