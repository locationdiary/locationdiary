import * as blockstack from 'blockstack/dist/blockstack';
import { v4 as uuid } from 'uuid';

class Session {
  static instance = null;

  static async getInstance() {
    if(this.instance === null) {
      this.instance = new Session();
      await this.instance.init();
    }
    return this.instance;
  }

  constructor() {
    this.userSession = new blockstack.UserSession();
  }

  async init() {
    if (this.userSession.isUserSignedIn()) {
      this.userSession.loadUserData();
    }
    else if (this.userSession.isSignInPending()) {
      await this.userSession.handlePendingSignIn();
      // Remove query string to avoid authResponse from hanging around
      if(window.history) {
        window.history.replaceState({}, document.title, '/');
      }
    }
  }
  async login() {
    return this.userSession.redirectToSignIn();
  }
  async logout() {
    this.userSession.signUserOut();
  }
  async saveData(file, data) {
    await this.userSession.putFile(file, JSON.stringify(data));
  }
  isLoggedIn() {
    return this.userSession.isUserSignedIn();
  }
  async getData(file) {
    const fileContent = await this.userSession.getFile(file);
    return JSON.parse(fileContent);
  }

  async addEntry(entry) {
    const index = await this.getIndex();
    if(index.pages.length > 0) {
      const pageId = index.pages[index.pages.length-1];
      const page = (await this.getData(pageId)) || {version: 1, entries: []};
      if(page.entries.length < 10) {
        page.entries.push(entry);
        await this.saveData(pageId, page);
        return;
      }
    }

    // Create a new page
    const pageId = `${uuid()}.json`;
    await this.saveData(pageId, {version: 1, entries: [entry]});
    index.pages.push(pageId);
    await this.saveData('index.json', index);
  }
}

export default Session;
