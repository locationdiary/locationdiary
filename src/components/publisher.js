import { h, Component } from "preact";
import { v4 as uuid } from "uuid";

import style from "./publisher.css";
import GeolocationBar from "./geolocationbar";

class Publisher extends Component {
  state = {
    location: null,
    message: "",
    showForm: false,
  };

  handleClickNew = () => {
    this.props.showEntries(false);
    this.setState({
      showForm: true
    });
  }

  handleCancel = () => {
    this.props.showEntries(true);
    this.setState({
      showForm: false
    });
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
    this.setState({message: '', showForm: false});
    this.props.showEntries(true);

    const entries = (await session.getData()) || [];
    entries.push(newEntry);
    await session.saveData(entries);
    await this.props.loadEntries();
  };

  render({}, { message, showForm }) {
    return (
      <div class={style.publisher}>
        {!showForm && <input type="submit" value="New Entry" onClick={this.handleClickNew} />}
        {showForm && <form onSubmit={this.addEntry}>
          <h2>New Entry</h2>
          <div>You are adding an entry to your Location Diary. Only you will be able to see this data.</div>
          <div>
            <label for="location">Location</label>
            <div><small>Move the map to set the green pin to your entry's location</small></div>
            <GeolocationBar
              handleNewLocation={this.handleNewLocation}
              centerMap={this.props.centerMap}
              currentMapCenter={this.props.currentMapCenter}
            />
          </div>
          <div>
            <label for="message">Message</label>
            <input id="message" type="text" value={message} onChange={this.handleMessage} />
          </div>
          <input type="submit" value="Publish" /> <input type="button" value="Cancel" onClick={this.handleCancel} />
        </form>}
      </div>
    );
  }
}

export default Publisher;
