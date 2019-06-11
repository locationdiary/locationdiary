import { h, Component } from "preact";
import style from "./style";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";
import JsonStore from '../../storage/jsonstore';

class Home extends Component {
  state = {
    index: null,
    entries: null,
    count: null,
  };

  async componentDidMount() {
    const {session} = this.props;
    if(session && session.isLoggedIn()) {
      await this.loadEntries();
    }
  }

  async componentDidUpdate(prevProps) {
    const {session, page} = this.props;
    const {session: oldSession, page: oldPage} = prevProps;
    if (session && session.isLoggedIn()) {
      if(session !== oldSession || page !== oldPage) {
        this.setState({entries: null});
        await this.loadEntries();
      }
    }
  }

  addEntry = (entry) => {
    this.setState((state) => ({
      entries: [
        entry,
        ...state.entries
      ]
    }));
  };

  loadEntries = async () => {
    const store = await JsonStore.getInstance();
    const entries = await store.getEntries(0, 10);
    this.setState({entries});
  };

  render({}, {entries, index}) {
    return (
      <div class={style.home}>
        <div class={style.fullmap}>
          <FullMap locations={entries} />
        </div>
        <div class={style.sidebar}>
          <Sidebar
            session={this.props.session}
            handleNewLocation={this.handleNewLocation}
          />
        </div>
      </div>
    );
  }
}

export default Home;
