import { h, Component } from "preact";
import { Router } from "preact-router";
import 'babel-polyfill';

import Session from "./session";

// Code-splitting is automated for routes
import LocationApp from "../routes/app";
import Home from "../routes/home";

export default class App extends Component {
  state = {
    session: null,
  };

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  async componentDidMount() {
    const session = new Session();
    await session.init();
    this.setState({session});
  }

  render({}, {session}) {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" session={session} />
          <LocationApp path="/app" session={session} />
        </Router>
      </div>
    );
  }
}
