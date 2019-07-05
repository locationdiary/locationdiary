import { h, Component } from 'preact';
import axios from 'axios';

import style from './geolocationbar.css';

class GeolocationBar extends Component {
  handleError = error => {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          'Please authorize this app to access your location or select the location manually.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage =
          'Location information is unavailable. Please select the location manually.';
        break;
      case error.TIMEOUT:
        errorMessage =
          'The request to get your location timed out. Please try again or select the location manually.';
        break;
      case error.UNKNOWN_ERROR:
        errorMessage =
          'We were unable to get your location. Please try again or select the location manually.';
        break;
    }
    this.setState({
      errorMessage,
      loading: false,
    });
  };

  async getGeocode(lat, lon) {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    if (data.error) {
      return null;
    }
    return data;
  }

  handleBrowserLocation = position => {
    localStorage.setItem('geo_access_given', '1');

    if (
      this.props.currentMapCenter &&
      this.props.currentMapCenter.lat === position.coords.latitude &&
      this.props.currentMapCenter.lng === position.coords.longitude
    ) {
      this.handleLocation(this.props.currentMapCenter);
    } else {
      this.props.centerMap([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    }
  };

  getLocation = () => {
    if (!navigator.geolocation) {
      return this.setState({
        errorMessage:
          'Your browser is not supported. Please set the location manually.',
      });
    }

    this.setState({
      loading: true,
    });

    navigator.geolocation.getCurrentPosition(
      this.handleBrowserLocation,
      this.handleError
    );
  };

  handleLocation = async center => {
    const location = {
      latitude: center.lat,
      longitude: center.lng,
    };

    const geocode = await this.getGeocode(
      location.latitude,
      location.longitude
    );

    this.setState({
      location,
      geocode,
      errorMessage: null,
      loading: false,
    });

    this.props.handleNewLocation(location, geocode);
  };

  componentDidMount() {
    if (localStorage.getItem('geo_access_given') === '1') {
      this.getLocation();
    } else if (!this.state.errorMessage) {
      this.setState({
        errorMessage:
          'Your browser will ask you to share your location. As all your data, your location is encrypted and not shared with anyone.',
      });
    }

    if (this.props.currentMapCenter !== null) {
      this.handleLocation(this.props.currentMapCenter);
    }
  }

  componentDidUpdate = async prevProps => {
    if (
      this.props.currentMapCenter !== null &&
      prevProps.currentMapCenter !== this.props.currentMapCenter
    ) {
      this.handleLocation(this.props.currentMapCenter);
    }
  };

  render({}, { loading, errorMessage, geocode }) {
    return (
      <div class={style.geolocation}>
        {loading && <div>Loading location…</div>}
        {!loading && geocode && <div>{geocode.display_name}</div>}
        <input
          type="button"
          value="Use my current location"
          onClick={this.getLocation}
        />
        {!loading && errorMessage && (
          <div class={style.help}>{errorMessage}</div>
        )}
      </div>
    );
  }
}

export default GeolocationBar;
