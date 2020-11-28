const fs = require('fs');
const path = require('path');

/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {
  constructor(options) {
    this.artwork = options.services.artwork;
    this.history = options.services.history;
    this.wordcloud = options.services.wordcloud;
    const config = fs.readFileSync(path.join(__dirname, '../../config/settings.json'), 'utf-8');
    const configJson = JSON.parse(config);
    const date = new Date();
    this.customId = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
    this.nowConfig = configJson[this.customId] ? configJson[this.customId] : configJson.default;
  }

  async find() {
    const response = await Promise.all([
      this.artwork.get(this.customId),
      this.history.get(this.customId),
      this.wordcloud.get(this.customId)
    ]);
    response.push(this.nowConfig.artworkArtist, this.nowConfig.quoteContent, this.nowConfig.quoteSpeaker);
    return response;
  }

  async create() {
    const response = await Promise.all([
      this.artwork.create({ artworkId: this.nowConfig.artworkId }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: this.nowConfig.topic })
    ]);
    response.time = this.date;
    return response;
  }
};
