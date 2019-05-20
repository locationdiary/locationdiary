import { h } from "preact";
import style from "./style";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";

const Home = () => (
  <div class={style.home}>
    <div class={style.fullmap}>
      <FullMap />
    </div>
    <div class={style.sidebar}>
      <Sidebar />
    </div>
  </div>
);

export default Home;
