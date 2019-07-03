import { h, Component } from "preact";

import style from "./sidebar.css";
import Publisher from "./publisher";
import Entry from './entry';
import logo from '../assets/icons/apple-icon-152x152.png';

class Sidebar extends Component {
  state = {
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

  render({ entries }, { isLoggedIn, loginRedirect }) {
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

        {isLoggedIn === true && <Publisher
          session={this.props.session}
          loadEntries={this.props.loadEntries}
          addEntry={this.props.addEntry}
        />}

        {isLoggedIn === true && <div class={style.entries}>
          {!entries && <div>Loading diary…</div>}
          {entries && <div>{entries.length === 0 ? 'No' : entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>}
          {entries && entries.map(entry => <Entry entry={entry} />)}
        </div>}

        {isLoggedIn === true && <div class={style.signin}>
          <div><input type="button" value="Logout" onClick={this.handleLogout} /></div>
        </div>}
      </div>
    );
  }
}

export default Sidebar;
