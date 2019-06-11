import Session from './blockstack';

const VERSION = 1;

const EMPTY_INDEX = {
  version: VERSION,
  pages: [],
};

const EMPTY_PAGE = {
  version: VERSION,
  entries: [],
};

const ENTRIES_PER_PAGE = 10;

class JsonStore {
  static instance = null;

  session = null;

  index = null;

  cache = {};

  static async getInstance() {
    if(this.instance === null) {
      this.instance = new JsonStore();
      await this.instance.init();
    }
    return this.instance;
  }

  async init() {
    this.session = await Session.getInstance();

    this.index = (await this.session.getData('index.json')) || EMPTY_INDEX;

    if(this.index.pages.length > 0) {
      const lastPageId = this.index.pages[this.index.pages.length-1];
      const lastPage = await this.getPage(lastPageId);
      if(lastPage.entries.length < ENTRIES_PER_PAGE && this.index.pages.length > 1) {
        const nextPage = this.index.pages[this.index.pages.length-2];
        await this.getPage(nextPage);
      }
    }
  }

  async addEntry() {
    // TODO :)
  }

  async getPage(page, updateCache) {
    if(!this.cache[page] || updateCache === true) {
      this.cache[page] = await this.session.getData(page);
    }
    return this.cache[page];
  }

  async countEntries(updateCache) {
    if(this.index.pages.length === 0) {
      return 0;
    }
    const completePages = this.index.pages.length-1;
    const lastPageId = this.index.pages[this.index.pages.length-1];
    const lastPage = await this.getPage(lastPageId, updateCache);
    return completePages*ENTRIES_PER_PAGE + lastPage.entries.length;
  }

  async getEntries(start, count) {
    if(this.index.pages.length < 1) {
      return null;
    }

    if(count > ENTRIES_PER_PAGE) {
      return null;
    }

    const nPage = Math.ceil(this.index.pages.length-1-start/ENTRIES_PER_PAGE);
    const page = await this.getPage(this.index.pages[nPage]);
    const entries = page ? page.entries.slice().reverse().slice(start-(nPage-1)*ENTRIES_PER_PAGE, count) : [];
    if(entries.length < count && nPage > 0) {
      const previousPage = await this.getPage(this.index.pages[nPage-1]);
      if(previousPage) {
        entries.push(...previousPage.entries.slice().reverse().slice(0, count-entries.length));
      }
    }
    return entries;
  }
}

export default JsonStore;
