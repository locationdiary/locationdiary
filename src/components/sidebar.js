import { h, Component } from "preact";
import { Link } from 'preact-router';
import { v4 as uuid } from "uuid";

import style from "./sidebar.css";
import GeolocationBar from "./geolocationbar";
import Entry from './entry';
import logo from '../assets/icons/apple-icon-152x152.png';

class Sidebar extends Component {
  state = {
    location: null,
    message: "",
    isLoggedIn: null,
    loginRedirect: false,
  };

  componentDidMount() {
    const {session} = this.props;
    if(session) {
      const isLoggedIn = session.isLoggedIn();
      this.setState({isLoggedIn});
    }
  }

  componentDidUpdate() {
    const {session} = this.props;
    if(session) {
      const isLoggedIn = session.isLoggedIn();
      if(this.state.isLoggedIn !== isLoggedIn) {
        this.setState({isLoggedIn});
      }
    }
  }

  handleMessage = event => {
    this.setState({ message: event.target.value });
  };

  handleNewLocation = (coords, geocode) => {
    this.setState({
      location: {
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
          altitudeAccuracy: coords.altitudeAccuracy,
        },
        geocode
      }
    });
  };

  addEntry = async (e) => {
    e.preventDefault();

    const { message, location } = this.state;
    const { session } = this.props;
    const newEntry = {
      message,
      location,
      date: new Date().toISOString(),
      id: uuid()
    };

    this.props.addEntry({
      ...newEntry,
      provisional: true
    });
    this.setState({message: ''});

    await session.addEntry(newEntry);
    await this.props.loadEntries();
  };

  handleLogin = () => {
    const {session} = this.props;
    this.setState({loginRedirect: true});
    session.login();
  }

  handleLogout = () => {
    const {session} = this.props;
    session.logout();
    this.setState({isLoggedIn: false});
  }

  render({entries, index}, {message, isLoggedIn, loginRedirect}) {
    return (
      <div class={style.sidebar}>
        <div class={style.logo}>
          <img src={logo} /> Location Diary
        </div>

        {isLoggedIn === null && <div class={style.signin}>
          <div>Loading…</div>
        </div>}

        {isLoggedIn === false && <div class={style.signin}>
          <div>Please connect using Blockstack<br/>to open your diary</div>
          <div><input type="button" value={loginRedirect ? 'Loading…' : 'Login'} disabled={loginRedirect} onClick={this.handleLogin} /></div>
        </div>}

        {isLoggedIn === true && <div class={style.publisher}>
          <form onSubmit={this.addEntry}>
            <input type="text" value={message} onChange={this.handleMessage} placeholder="What are you up to?" />
            <div class={style.geo}>
              <GeolocationBar handleNewLocation={this.handleNewLocation} />
              <input type="submit" value="Publish" />
            </div>
          </form>
        </div>}

        {isLoggedIn === true && <div class={style.entries}>
          {!entries && <div>Loading diary…</div>}
          {entries && <div>{entries.length === 0 ? 'No' : entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>}
          {entries && entries.map(entry => <Entry entry={entry} />)}
          <div>
            {index && index.pages.map((page, index) => <span><Link class={style.bla} activeClassName={style.active} href={`/${page.replace('.json', '')}`}>{index+1}</Link> </span>)}
          </div>
        </div>}

        {isLoggedIn === true && <div class={style.signin}>
          <div><input type="button" value="Logout" onClick={this.handleLogout} /></div>
        </div>}
      </div>
    );
  }
}

export default Sidebar;
