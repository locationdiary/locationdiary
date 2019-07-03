import { h, Component } from "preact";
import { v4 as uuid } from "uuid";

import style from "./publisher.css";
import GeolocationBar from "./geolocationbar";

class Publisher extends Component {
  state = {
    location: null,
    message: "",
  };

  handleMessage = event => {
    this.setState({ message: event.target.value });
  };

  handleNewLocation = (coords, geocode) => {
    this.setState({
      location: {
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
          altitudeAccuracy: coords.altitudeAccuracy,
        },
        geocode
      }
    });
  };

  addEntry = async (e) => {
    e.preventDefault();

    const { message, location } = this.state;
    const { session } = this.props;

    if(!message && !location) {
      return;
    }

    const newEntry = {
      message,
      location,
      date: new Date().toISOString(),
      id: uuid()
    };

    this.props.addEntry({
      ...newEntry,
      provisional: true
    });
    this.setState({message: ''});

    const entries = (await session.getData()) || [];
    entries.push(newEntry);
    await session.saveData(entries);
    await this.props.loadEntries();
  };

  render({}, { message }) {
    return (
      <div class={style.publisher}>
        <form onSubmit={this.addEntry}>
          <input type="text" value={message} onChange={this.handleMessage} placeholder="What are you up to?" />
          <div class={style.geo}>
            <GeolocationBar handleNewLocation={this.handleNewLocation} />
            <input type="submit" value="Publish" />
          </div>
        </form>
      </div>
    );
  }
}

export default Publisher;
