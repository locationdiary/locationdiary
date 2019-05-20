import { h } from "preact";
import style from "./style";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";

const TEST_LOCATIONS = [
  {
    coords: {
      latitude: 12,
      longitude: 12
    },
    message: "Hey test",
    date: new Date(),
    id: "b5e18746-a489-4f21-b318-1094ddacae4d"
  },
  {
    coords: {
      latitude: 12,
      longitude: 12
    },
    message: "Hey test",
    date: new Date(),
    id: "b5e18746-a489-4f21-b318-1094ddacae4d"
  }
];

const Home = ({ session }) => (
  <div class={style.home}>
    <div class={style.fullmap}>
      <FullMap locations={TEST_LOCATIONS} />
    </div>
    <div class={style.sidebar}>
      <Sidebar session={session} />
    </div>
  </div>
);

export default Home;
