import { h, Component } from 'preact';
import 'leaflet/dist/leaflet.css';
import pin from 'leaflet/dist/images/marker-icon.png';
import pin2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

import style from './fullmap.css';

class FullMap extends Component {
  componentDidMount() {
    const position = [51.505, -0.09];
    const map = L.map('map').setView(position, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: pin,
      iconRetinaUrl: pin2x,
      iconSize: [24, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: shadow,
      shadowSize: [41, 41],
    });

    L.marker(position, {icon: customIcon})
      .addTo(map)
      .bindPopup('A pretty CSS3 popup. <br> Easily customizable.');
  }

  render() {
    return (
      <div id="map" class={style.map}></div>
    );
  }

}

export default FullMap;
