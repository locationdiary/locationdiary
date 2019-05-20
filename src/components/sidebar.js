import { h, Component } from "preact";

import style from "./sidebar.css";
import GeolocationBar from "./geolocationbar";
import logo from '../assets/icons/apple-icon-152x152.png';

class Sidebar extends Component {
  state = {
    location: null,
    message: '',
  }

  handleMessage = (event) => {
    this.setState({message: event.target.value});
  }

  handleNewLocation = (coords, geoloc) => {
    this.setState({
      location: {coords, geoloc},
    });
    console.log(coords, geoloc);
  }

  addEntry = (entry) => {

  };

  render({session}, {message}) {
    const isLoggedIn = session.isLoggedIn();

    return (
      <div class={style.sidebar}>
        <div class={style.logo}>
          <img src={logo} /> Location Diary
        </div>

        {!isLoggedIn && <div class={style.signin}>
          <div>Please connect using Blockstack<br/>to open your diary</div>
          <div><input type="button" value="Login" onClick={() => session.login()} /></div>
        </div>}

        {isLoggedIn && <div class={style.publisher}>
          <input type="text" value={message} onChange={this.handleMessage} placeholder="What are you up to?" />
          <GeolocationBar handleNewLocation={this.handleNewLocation} />
          <input type="button" value="Publish" />
        </div>}
      </div>
    );
  }
}

export default Sidebar;
