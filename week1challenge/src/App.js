import React from "react";
import "./App.css";
import axios from "axios";
import ReactLeafletMap from "./ReactLeafletMap.js";
const API_KEY = process.env.REACT_APP_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      bars: [],
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
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.029649,-78.476841&radius=3000&opennow&type=restaurant&key=+" +
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

        this.setState({
          restaurants: response.data.results,
          coords: coords
        });
      });

    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.029649,-78.476841&radius=3000&opennow&type=bar&key=+" +
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

        this.setState({
          bars: response.data.results,
          coords: coords
        });
      });
  }

  formatRestaurants = () => {
    let restaurant_list = this.state.restaurants.concat(this.state.bars);
    console.log(this.state.coords);

    return restaurant_list.map(location => {
      try {
        if (location.opening_hours.open_now != null)
          return (
            <li>
              <b> Name: </b> {location.name} <b>Rating: </b>
              {location.rating} <b>Price Level: </b>
              {location.price_level}
            </li>
          );
      } catch (err) {
        console.log(err);
      }
    });
  };

  handleChange = event => {
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
        <form>
          Category
          <label>
            <input
              type="text"
              value={this.state.category}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <button onClick={this.handleClick}>Submit</button>

        {this.formatRestaurants()}

        <ReactLeafletMap coords={this.state.coords} />
      </div>
    );
  }
}

export default App;
