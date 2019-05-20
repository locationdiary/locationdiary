import { h, Component } from "preact";
import { v4 as uuid } from "uuid";

import style from "./sidebar.css";
import GeolocationBar from "./geolocationbar";
import logo from "../assets/icons/apple-icon-152x152.png";

class Sidebar extends Component {
  state = {
    location: null,
    message: "",
    entries: null
  };

  async componentDidMount() {
    await this.props.loadEntries();
  }

  async componentDidUpdate(prevProps) {
    const { session } = this.props;
    const oldSession = prevProps.session;
    if (session !== oldSession) {
      await this.props.loadEntries();
    }
  }

  handleMessage = event => {
    this.setState({ message: event.target.value });
  };

  handleNewLocation = (coords, geocode) => {
    this.setState({
      location: { coords, geocode }
    });
  };

  addEntry = async () => {
    const { message, location } = this.state;
    const { session } = this.props;
    const newEntry = {
      message,
      location,
      date: new Date().toISOString(),
      id: uuid()
    };

    const entries = (await session.getData()) || [];
    entries.push(newEntry);
    await session.saveData(entries);
    await this.props.loadEntries();
  };

  render({ session, entries }, { message }) {
    const isLoggedIn = session.isLoggedIn();

    return (
      <div class={style.sidebar}>
        <div class={style.logo}>
          <img src={logo} /> Location Diary
        </div>

        {!isLoggedIn && (
          <div class={style.signin}>
            <div>
              Please connect using Blockstack
              <br />
              to open your diary
            </div>
            <div>
              <input
                type="button"
                value="Login"
                onClick={() => session.login()}
              />
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div class={style.publisher}>
            <input
              type="text"
              value={message}
              onChange={this.handleMessage}
              placeholder="What are you up to?"
            />
            <GeolocationBar handleNewLocation={this.handleNewLocation} />
            <input type="button" value="Publish" onClick={this.addEntry} />
          </div>
        )}

        {isLoggedIn && entries && (
          <div class={style.entries}>
            {entries.length} entries
            {entries.map(entry => (
              <div>
                {entry.location && entry.location.geocode.display_name}{" "}
                {entry.message}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;
