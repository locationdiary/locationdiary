import { h, Component } from "preact";
import { route } from "preact-router";

import style from "./sidebar.css";
import Publisher from "./publisher";
import Entry from './entry';
import EmptyDiary from './emptydiary';
import logo from '../assets/icons/apple-icon-152x152.png';

class Sidebar extends Component {
  state = {
    isLoggedIn: null,
    showEntries: true,
  };

  componentDidMount() {
    const {session} = this.props;
    if(session) {
      const isLoggedIn = session.isLoggedIn();
      this.setState({isLoggedIn});
    }

    this.props.setShowCenter(!this.state.showEntries);
  }

  componentDidUpdate(prevProps, prevState) {
    const {session} = this.props;
    if(session) {
      const isLoggedIn = session.isLoggedIn();
      if(this.state.isLoggedIn !== isLoggedIn) {
        this.setState({isLoggedIn});
      }
    }

    if (prevState.showEntries !== this.state.showEntries) {
      this.props.setShowCenter(!this.state.showEntries);
    }
  }

  handleLogout = () => {
    const {session} = this.props;
    session.logout();
    this.setState({isLoggedIn: false});
  }

  handleShowEntries = (show) => {
    this.setState({ showEntries: show });
  }

  render({ entries }, { isLoggedIn, showEntries }) {
    if (isLoggedIn === false) {
      route('/');
    }

    return (
      <div class={style.sidebar}>
        <div class={style.logo}>
          <a href="/"><img src={logo} /> Location Diary</a>
        </div>

        {isLoggedIn === null && <div class={style.signin}>
          <div>Loading…</div>
        </div>}

        {isLoggedIn === true && <Publisher
          session={this.props.session}
          loadEntries={this.props.loadEntries}
          addEntry={this.props.addEntry}
          centerMap={this.props.centerMap}
          showEntries={this.handleShowEntries}
          currentMapCenter={this.props.currentMapCenter}
        />}

        {isLoggedIn === true && showEntries && <div class={style.entries}>
          {!entries && <div>Loading diary…</div>}
          {entries && entries.length === 0 && <EmptyDiary />}
          {entries && entries.length > 0 && <div>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>}
          {entries && entries.map(entry => <Entry entry={entry} />)}
        </div>}

        {isLoggedIn === true && showEntries && <div class={style.signin}>
          <div><input type="button" value="Logout" onClick={this.handleLogout} /></div>
        </div>}
      </div>
    );
  }
}

export default Sidebar;
