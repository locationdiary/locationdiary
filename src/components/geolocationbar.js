import { h, Component } from "preact";
import axios from "axios";

import style from './geolocationbar.css';

class GeolocationBar extends Component {
  handleError = (error) => {
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

  handleBrowserLocation = (position) => {
    localStorage.setItem('geo_access_given', '1');
    this.props.centerMap([
      position.coords.latitude,
      position.coords.longitude,
    ]);
  }

  getLocation = () => {
    if (!navigator.geolocation) {
      return this.setState({
        errorMessage: "Your browser is not supported."
      });
    }

    this.setState({
      loading: true
    });

    navigator.geolocation.getCurrentPosition(
      this.handleBrowserLocation,
      this.handleError
    );
  }

  componentDidMount() {
    if(localStorage.getItem('geo_access_given') === '1'){
      this.getLocation();
    }
    else if(!this.state.errorMessage) {
      this.setState({errorMessage: 'Click here to authorize location'});
    }
  }

  componentDidUpdate = async (prevProps) => {
    if (prevProps.currentMapCenter !== this.props.currentMapCenter && this.props.currentMapCenter !== null) {
      const location = {
        latitude: this.props.currentMapCenter.lat,
        longitude: this.props.currentMapCenter.lng,
      };

      const geocode = await this.getGeocode(
        location.latitude,
        location.longitude,
      );

      this.setState({
        location,
        geocode,
        errorMessage: null,
        loading: false
      });

      this.props.handleNewLocation(location, geocode);
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
