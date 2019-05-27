import React, { createRef } from "react";
import "./App.css";
import axios from "axios";
import ReactLeafletMap from "./ReactLeafletMap.js";
import RestaurantList from "./RestaurantList.js";
import { Affix } from "antd";
import { Grid, Header, Button, Segment } from "semantic-ui-react";

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
    axios
      .get("/api/geocode?address=" + this.state.address)
      .then(response => {
        let address = response.data.results[0].geometry.location;

        return new Promise(resolve => {
          this.setState(
            {
              newCoords: [address.lat, address.lng],
              searchAddress: false
            },
            () => resolve()
          );
        });
      })
      .then(() => {
        return axios.get(
          "/api/find?lat=" +
            this.state.newCoords[0] +
            "&lng=" +
            this.state.newCoords[1] +
            "&category=" +
            this.state.category
        );
      })
      .then(response => {
        let holder = response.data;
        this.setState({
          restaurants: holder["restaurants"],
          coords: holder["coords"]
        });
      })
      .catch(e => console.log(e));
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
            <Grid.Row>
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
