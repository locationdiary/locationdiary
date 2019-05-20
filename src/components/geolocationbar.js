import { h, Component } from "preact";
import axios from "axios";

import style from "./fullmap.css";

class GeolocationBar extends Component {
  handleError(error) {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "You need to authorize this app to access your location.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "The request to get your location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = "We were unable to get your location";
        break;
    }
    this.setState({
      errorMessage,
      errored: true,
      loading: false
    });
  }
  async getGeocode(lat, lon) {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return data;
  }
  async handleNewLocation(position) {
    const geocode = await this.getGeocode(
      position.coords.latitude,
      position.coords.longitude
    );
    this.setState({
      location: position.coords,
      geocode,
      loading: false
    });
    this.props.handleNewLocation(position.coords, geocode);
  }
  getLocation() {
    if (!navigator.geolocation) {
      return this.setState({
        errorMessage: "Your browser is not supported.",
        errored: true
      });
    }

    this.setState({
      loading: true
    });

    navigator.geolocation.getCurrentPosition(
      this.handleNewLocation,
      this.handleError
    );
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.getLocation = this.getLocation.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleNewLocation = this.handleNewLocation.bind(this);
  }

  render() {
    return (
      <div>
        {this.state.loading && <div>Loading...</div>}
        {this.state.errored && <div>{this.state.errorMessage}</div>}
        {this.state.geocode && <div>{this.state.geocode.display_name}</div>}
        <button onClick={this.getLocation}>Geolocate me</button>
      </div>
    );
  }
}

export default GeolocationBar;
