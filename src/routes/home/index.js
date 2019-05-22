import { h, Component } from "preact";
import style from "./style";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";

class Home extends Component {
  state = {
    index: null,
    entries: null,
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
    const {session, page} = this.props;

    const index = await session.getIndex();
    this.setState({index});

    if(index.pages.length > 0) {
      const pageId = page
      ? `${page}.json`
      : index.pages[index.pages.length-1];
      const pageContent = await session.getData(pageId);
      const entries = pageContent ? pageContent.entries : [];
      entries.reverse();
      this.setState({entries});
    }
    else {
      this.setState({entries: []})
    }
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
            entries={entries}
            index={index}
            handleNewLocation={this.handleNewLocation}
            loadEntries={this.loadEntries}
            addEntry={this.addEntry}
          />
        </div>
      </div>
    );
  }
}

export default Home;
