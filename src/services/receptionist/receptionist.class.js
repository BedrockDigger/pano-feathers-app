/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {
  constructor(options) {
    this.cronguy = options.services.cronguy;
    this.artwork = options.services.artwork;
    this.history = options.services.history;
    this.wordcloud = options.services.wordcloud;
    this.bundleObject = {};
  }

  async find(data, params) {
    if (Object.keys(this.bundleObject) == 0) {
      await this.cronguy.create(data, params).then(
        (res) => {
          this.bundleObject = res;
        }
      );
      return this.bundleObject;
    }
    else {
      const now = new Date();
      const elipsed = Math.floor((now - this.bundleObject.createdAt) / 1000);
      console.log(elipsed);
      if (elipsed >= 43900) {
        await this.cronguy.create(data, params).then(
          (res) => {
            this.bundleObject = res;
          }
        );
        return this.bundleObject;
      }
      return this.bundleObject;
    }
  }
};
