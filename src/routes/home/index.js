import { h, Component } from 'preact';

class Home extends Component {
  state = {
    isLoggedIn: null,
    loginRedirect: false,
  };

  componentDidMount() {
    const { session } = this.props;
    if (session) {
      const isLoggedIn = session.isLoggedIn();
      this.setState({ isLoggedIn });
    }
  }

  componentDidUpdate() {
    const { session } = this.props;
    if (session) {
      const isLoggedIn = session.isLoggedIn();
      if (this.state.isLoggedIn !== isLoggedIn) {
        this.setState({ isLoggedIn });
      }
    }
  }

  handleLogin = e => {
    const { session } = this.props;
    this.setState({ loginRedirect: true });
    session.login();
  };

  getStarted = props => {
    if (this.state.isLoggedIn) {
      return (
        <a {...props} href="/app">
          Get Started
        </a>
      );
    }
    return (
      <a {...props} href="#" onClick={this.handleLogin}>
        {this.state.loginRedirect ? 'Loading…' : 'Get Started'}
      </a>
    );
  };

  render() {
    return (
      <div>
        <header class="header_area">
          <div class="main_menu">
            <nav class="navbar navbar-expand-lg navbar-light">
              <div class="container box_1620">
                <a class="navbar-brand" href="/">
                  <h3>📍Location Diary</h3>
                </a>
                <div class="navbar-toggler">
                  <this.getStarted class="button" />
                </div>

                <div
                  class="collapse navbar-collapse offset"
                  id="navbarSupportedContent"
                >
                  <ul class="nav navbar-nav menu_nav justify-content-end">
                    <li class="nav-item active">
                      <a class="nav-link" href="/">
                        Home
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#features">
                        Features
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#explore">
                        Explore
                      </a>
                    </li>
                  </ul>

                  <div class="nav-right text-center text-lg-right py-4 py-lg-0">
                    <this.getStarted class="button" />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <section class="hero-banner magic-ball">
          <div class="container">
            <div class="row align-items-center text-center text-md-left">
              <div class="col-md-6 col-lg-5 mb-5 mb-md-0">
                <h1>Location Diary</h1>
                <p>
                  Keep a track of where you have been, all that saved securely
                  so that only you can access your data.
                </p>
                <this.getStarted class="button button-hero mt-4" />
              </div>
              <div class="d-none d-md-block col-md-5 col-lg-6 col-xl-5 offset-md-1 offset-lg-1 offset-xl-2">
                <img class="img-fluid" src="/assets/img/hero-img.png" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section class="section-margin">
          <div class="container">
            <div class="section-intro text-center pb-90px">
              <h2 id="features">Features</h2>
              <p>Here is what our app can do</p>
            </div>

            <div class="row">
              <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
                <div class="service-card text-center">
                  <div class="service-card-img">
                    <img
                      class="img-fluid"
                      src="/assets/img/adventure.svg"
                      width="130"
                      alt=""
                    />
                  </div>
                  <div class="service-card-body">
                    <h3>Save locations</h3>
                    <p>
                      You are on holiday and you want to save all locations
                      you've been to?
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
                <div class="service-card text-center">
                  <div class="service-card-img">
                    <img
                      class="img-fluid"
                      src="/assets/img/security.svg"
                      width="130"
                      alt=""
                    />
                  </div>
                  <div class="service-card-body">
                    <h3>Secure</h3>
                    <p>
                      Location Diary is end-to-end encrypted, so your locations
                      are securely stored.
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 mb-4 mb-lg-0">
                <div class="service-card text-center">
                  <div class="service-card-img">
                    <img
                      class="img-fluid"
                      src="/assets/img/authentication.svg"
                      width="130"
                      alt=""
                    />
                  </div>
                  <div class="service-card-body">
                    <h3>Privacy friendly</h3>
                    <p>
                      As your data is encrypted with Blockstack, only you can
                      see your data!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="explore"
          class="bg-gray section-padding magic-ball magic-ball-about"
        >
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 mb-4 mb-md-0">
                <div class="about-img">
                  <img
                    class="img-fluid"
                    src="/assets/img/screenshots/capture.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div class="col-lg-5 col-md-6 align-self-center about-content">
                <h2>
                  Exploration is <br class="d-none d-xl-block" /> really the
                  essence <br class="d-none d-xl-block" /> of the human spirit
                </h2>
                <p>
                  We spend so many time exploring the world, and never remember
                  where we have been in the past. Thanks to Location Diary, you
                  can keep track of all places you have been to and display them
                  on a beautiful map.
                </p>
                <this.getStarted class="button" />
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" class="footer-area">
          <div class="container">
            <div class="row">
              <div class="col-lg-4  col-md-6 col-sm-6">
                <div class="single-footer-widget">
                  <h6>About Location Diary</h6>
                  <p>
                    We wanted to create an app which respects our users privacy,
                    that's why we created Location Diary.
                  </p>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="single-footer-widget">
                  <h6>Navigation Links</h6>
                  <div class="row">
                    <div class="col">
                      <ul>
                        <li>
                          <a href="#">Home</a>
                        </li>
                        <li>
                          <a href="#features">Features</a>
                        </li>
                        <li>
                          <a href="#explore">Explore</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="single-footer-widget">
                  <h6>Social</h6>
                  <div class="row">
                    <div class="col">
                      <ul>
                        <li>
                          <a href="https://facebook.com/locationdiary">
                            Facebook
                          </a>
                        </li>
                        <li>
                          <a href="https://twitter.com/locationdiary">
                            Twitter
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer-bottom">
              <div class="row align-items-center">
                <p class="col-lg-8 col-sm-12 footer-text m-0 text-center text-lg-left">
                  Copyright &copy;
                  {new Date().getFullYear()} All rights reserved
                </p>
                <div class="col-lg-4 col-sm-12 footer-social text-center text-lg-right">
                  <a href="https://facebook.com/locationdiary">
                    <i class="fab fa-facebook-f" />
                  </a>
                  <a href="https://twitter.com/locationdiary">
                    <i class="fab fa-twitter" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
