const FILE_KEY = "locations.json";

class Session {
  constructor() {
    this.userSession = new window.blockstack.UserSession();
  }
  async login() {
    if (this.userSession.isUserSignedIn()) {
      this.userSession.loadUserData();
    } else if (this.userSession.isSignInPending()) {
      await this.userSession.handlePendingSignIn();
    } else {
      return this.userSession.redirectToSignIn();
    }
  }
  async logout() {
    this.userSession.signUserOut();
  }
  async saveData(data) {
    await this.userSession.putFile(FILE_KEY, JSON.stringify(data));
  }
  async getData() {
    const fileContent = await this.userSession.getFile(FILE_KEY);
    return JSON.parse(fileContent);
  }
}

export default Session;
