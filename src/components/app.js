import { h, Component } from "preact";
import { Router } from "preact-router";

import Session from "./session";

// Code-splitting is automated for routes
import Home from "../routes/home";

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  componentDidMount() {
    this.session = new Session();
  }

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" />
        </Router>
      </div>
    );
  }
}
