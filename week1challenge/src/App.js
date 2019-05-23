import React, { createRef } from "react";
import "./App.css";
import axios from "axios";
import ReactLeafletMap from "./ReactLeafletMap.js";
import RestaurantList from "./RestaurantList.js";
import { Affix } from "antd";
import { Grid, Header, Button, Input, Segment } from "semantic-ui-react";
const API_KEY = process.env.REACT_APP_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      category: "",
      coords: []
    };
  }

  changeParent = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  handleChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  componentDidMount() {
    let coords = [];
    axios
      .get(
        "https://cors-anywhere-hclaunch.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.029649,-78.476841&radius=3000&opennow&type=restaurant&name=" +
          this.state.category +
          "&key=+" +
          API_KEY
      )
      .then(response => {
        try {
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

        let address = response.data.results.map(
          location => location.types.vicinity
        );

        this.setState({
          restaurants: response.data.results,
          coords: coords,
          address: address
        });
      });
  }

  handleChange = event => {
    this.setState({
      category: event.target.value
    });
  };

  handleClick = event => {
    this.componentDidMount();
  };

  contextRef = () => createRef();

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
                      onChange={this.handleChange}
                      placeholder="Cuisine Category..."
                    />
                  </div>{" "}
                  <Button name="submitButton" onClick={this.handleClick}>
                    Submit
                  </Button>
                </Grid.Row>
              </Segment>
            </Grid.Column>
            <RestaurantList restaurants={this.state.restaurants} />
          </Grid.Column>

          <Grid.Column width="9">
            <Affix offsetTop={this.state.top}>
              <ReactLeafletMap coords={this.state.coords} />
            </Affix>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
export default App;
