import { h } from "preact";

import style from "./sidebar.css";
import GeolocationBar from "./geolocationbar";

const Sidebar = () => (
  <div class={style.sidebar}>
    Hey
    <GeolocationBar />
  </div>
);

export default Sidebar;
