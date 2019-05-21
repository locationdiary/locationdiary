import { h, Component } from "preact";
import style from "./style";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";

class Home extends Component {
  state = {
    entries: null,
  };

  async componentDidMount() {
    const {session} = this.props;
    if(session && session.isLoggedIn()) {
      await this.loadEntries();
    }
  }

  async componentDidUpdate(prevProps) {
    const {session} = this.props;
    const oldSession = prevProps.session;
    if (session && session !== oldSession && session.isLoggedIn()) {
      await this.loadEntries();
    }
  }

  loadEntries = async () => {
    const {session} = this.props;
    const entries = (await session.getData()) || [];
    this.setState({ entries });
  };

  render() {
    const {entries} = this.state;

    return (
      <div class={style.home}>
        <div class={style.fullmap}>
          <FullMap locations={entries} />
        </div>
        <div class={style.sidebar}>
          <Sidebar
            session={this.props.session}
            entries={entries}
            handleNewLocation={this.handleNewLocation}
            loadEntries={this.loadEntries}
          />
        </div>
      </div>
    );
  }
}

export default Home;
