import { h, Component } from "preact";
import "leaflet/dist/leaflet.css";
import pin from "leaflet/dist/images/marker-icon.png";
import pin2x from "leaflet/dist/images/marker-icon-2x.png";
import newPin from "../assets/marker-icon.png";
import newPin2x from "../assets/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';

dayjs.extend(LocalizedFormat);

const customIcon = L.icon({
  iconUrl: pin,
  iconRetinaUrl: pin2x,
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: shadow,
  shadowSize: [41, 41]
});

const customIconNew = L.icon({
  iconUrl: newPin,
  iconRetinaUrl: newPin2x,
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: shadow,
  shadowSize: [41, 41]
});

const temporaryMarker = L.marker([0,0], { icon: customIconNew, zIndexOffset: 1000 });

import style from "./fullmap.css";

class FullMap extends Component {
  addLocations(locations) {
    const markers = this.state.markers;
    locations.map(location => {
      if (markers[location.id]) {
        return null;
      }
      if (!location.location || !location.location.coords || !location.location.coords.latitude) {
        return null;
      }
      const date = dayjs(location.date).format('lll');
      markers[location.id] = L.marker(
        [location.location.coords.latitude, location.location.coords.longitude],
        {
          icon: customIcon
        }
      )
        .addTo(this.state.map)
        .bindPopup(location.message
          ? `${date}<br/><b>${location.message}</b> @ <em>${location.location.geocode.display_name}</em>`
          : `${date}<br/><em>${location.location.geocode.display_name}</em>`);
    });
    this.setState({
      markers
    });
  }

  componentDidMount() {
    const position = [51.505, -0.09];
    const map = L.map("map", {
      maxBounds: [[85, -180], [-85, 180]],
      maxBoundsViscosity: 1,
      minZoom: 3,
    }).setView(position, 3);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    temporaryMarker.setLatLng(map.getCenter());
    map.on('move', (e) => {
      temporaryMarker.setLatLng(e.target.getCenter());
    });

    map.on('moveend', (e) => {
      this.props.onMapMove(e.target.getCenter());
    });

    if (this.props.locations) {
      this.addLocations(this.props.locations, map);
    }

    if (this.props.showCenter) {
      temporaryMarker.addTo(map);
    }

    this.setState({
      map
    });
  }

  componentWillUnmount() {
    this.state.map.remove();
  }

  componentWillReceiveProps(nextProps, nexState) {
    if (nextProps.locations) {
      this.addLocations(nextProps.locations, nexState.map);
    }

    if (nextProps.mapCenter !== this.props.mapCenter) {
      this.state.map.setView(nextProps.mapCenter, 10);
    }

    if (nextProps.showCenter !== this.props.showCenter) {
      if (nextProps.showCenter) {
        temporaryMarker.addTo(this.state.map);
      }
      else {
        temporaryMarker.remove();
      }
    }
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      markers: {}
    };
    this.addLocations = this.addLocations.bind(this);
  }

  render() {
    return <div id="map" class={style.map} />;
  }
}

export default FullMap;
