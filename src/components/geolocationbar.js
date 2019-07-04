import { h, Component } from "preact";
import axios from "axios";

import style from './geolocationbar.css';
import refresh from '../assets/sync-solid.svg';

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
      loading: false
    });
  }
  async getGeocode(lat, lon) {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    if (data.error) {
      return null;
    }
    return data;
  }
  async handleNewLocation(position) {
    localStorage.setItem('geo_access_given', '1');

    const geocode = await this.getGeocode(
      position.coords.latitude,
      position.coords.longitude
    );
    this.setState({
      location: position.coords,
      geocode,
      errorMessage: null,
      loading: false
    });
    this.props.handleNewLocation(position.coords, geocode);
  }
  getLocation() {
    if (!navigator.geolocation) {
      return this.setState({
        errorMessage: "Your browser is not supported."
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

  componentDidMount() {
    if(localStorage.getItem('geo_access_given') === '1'){
      this.getLocation();
    }
    else if(!this.state.errorMessage) {
      this.setState({errorMessage: 'Click here to authorize location'});
    }
  }

  render({}, {loading, errorMessage, geocode}) {
    return (
      <div class={style.geolocation}>
        {loading && <div>Loading location…</div>}
        {!loading && errorMessage && <div>{errorMessage}</div>}
        {!loading && geocode && <div>{geocode.display_name}</div>}
        <input type="button" value="Use my current location" onClick={this.getLocation} />
      </div>
    );
  }
}

export default GeolocationBar;
