import * as blockstack from 'blockstack/dist/blockstack';

const FILE_KEY = "locations.json";

class Session {
  constructor() {
    this.userSession = new blockstack.UserSession();
  }
  async init() {
    if (this.userSession.isUserSignedIn()) {
      this.userSession.loadUserData();
    }
    else if (this.userSession.isSignInPending()) {
      await this.userSession.handlePendingSignIn();
    }
  }
  async login() {
    return this.userSession.redirectToSignIn();
  }
  async logout() {
    this.userSession.signUserOut();
  }
  async saveData(data) {
    await this.userSession.putFile(FILE_KEY, JSON.stringify(data));
  }
  isLoggedIn() {
    return this.userSession.isUserSignedIn();
  }
  async getData() {
    const fileContent = await this.userSession.getFile(FILE_KEY);
    return JSON.parse(fileContent);
  }
}

export default Session;
