import React from "react";
import "./App.css";
import { Header, Table, Rating, Progress } from "semantic-ui-react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  progressBar = location => {
    if (location.price_level != null) {
      return (
        <div>
          <b>Price Level </b> <br />
          <Progress
            progress="value"
            value={location.price_level}
            total={4}
          />{" "}
        </div>
      );
    } else {
      return (
        <Header as="h4" image>
          <Header.Content>
            Price Level
            <Header.Subheader>Unknown</Header.Subheader>
          </Header.Content>
        </Header>
      );
    }
  };
  formatRestaurants = () => {
    let restaurant_list = this.props.restaurants;

    return restaurant_list.map(location => {
      try {
        return (
          <Table celled>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Header as="h4" image>
                    <Header.Content>
                      {location.name}
                      <Header.Subheader>{location.vicinity}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  <b>Rating </b> {location.rating} <br />
                  <Rating
                    icon="star"
                    defaultRating={location.rating}
                    maxRating={5}
                  />
                </Table.Cell>
                <Table.Cell>{this.progressBar(location)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        );
      } catch (err) {
        console.log(err);
      }
    });
  };

  render() {
    return <div>{this.formatRestaurants()}</div>;
  }
}
