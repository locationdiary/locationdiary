import { h, Component } from "preact";
import style from "./style";
import { v4 as uuid } from "uuid";

import FullMap from "../../components/fullmap";
import Sidebar from "../../components/sidebar";

class Home extends Component {
  async componentDidMount() {
    await this.loadEntries();
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      locations: []
    };
  }

  loadEntries = async () => {
    const { session } = this.props;
    if (session) {
      const entries = (await session.getData()) || [];
      this.setState({ entries });
    }
  };

  render() {
    return (
      <div class={style.home}>
        <div class={style.fullmap}>
          <FullMap locations={this.state.entries} />
        </div>
        <div class={style.sidebar}>
          <Sidebar
            session={this.props.session}
            entries={this.state.entries}
            handleNewLocation={this.handleNewLocation}
            loadEntries={this.loadEntries}
          />
        </div>
      </div>
    );
  }
}

export default Home;
