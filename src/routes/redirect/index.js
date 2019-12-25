import { h, Component } from 'preact';

const APP_REDIRECT_URI = 'https://auth.expo.io/@apuyou/locationdiary-app';

class MobileRedirect extends Component {
  componentDidMount() {
    const url = new URL(window.location);
    const response = url.searchParams.get('authResponse');
    if (response) {
      window.location = `${APP_REDIRECT_URI}/?authResponse=${response}`;
    }
  }

  render() {
    return <div>Loading…</div>;
  }
}

export default MobileRedirect;
