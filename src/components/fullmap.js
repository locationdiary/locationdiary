import { h, Component } from "preact";
import "leaflet/dist/leaflet.css";
import pin from "leaflet/dist/images/marker-icon.png";
import pin2x from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: pin,
  iconRetinaUrl: pin2x,
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: shadow,
  shadowSize: [41, 41]
});

import style from "./fullmap.css";

class FullMap extends Component {
  addLocations(locations, map) {
    const markers = this.state.markers;
    locations.map(location => {
      if (markers[location.id]) {
        return null;
      }
      markers[location.id] = L.marker(
        [location.coords.latitude, location.coords.longitude],
        {
          icon: customIcon
        }
      )
        .addTo(map)
        .bindPopup(location.message);
    });
    this.setState({
      markers
    });
  }
  componentDidMount() {
    const position = [51.505, -0.09];
    const map = L.map("map").setView(position, 2);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    if (this.props.locations) {
      this.addLocations(this.props.locations, map);
    }

    this.setState({
      map
    });
  }

  componentWillUnmount() {
    this.state.map.remove();
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
