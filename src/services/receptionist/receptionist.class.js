const fs = require('fs');
const path = require('path');

/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {
  constructor(options) {
    this.artwork = options.services.artwork;
    this.history = options.services.history;
    this.wordcloud = options.services.wordcloud;
  }

  async find() {
    const date = new Date();
    const customId = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
    const data = await Promise.all([
      this.artwork.get(customId),
      this.history.get(customId),
      this.wordcloud.get(customId)
    ]);
    return { data };
  }

  async create() {
    const config = fs.readFileSync(path.join(__dirname, '../../config/settings.json'), 'utf-8');
    const configJson = JSON.parse(config);
    const date = new Date();
    const customId = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
    const nowConfig = configJson[customId] ? configJson[customId] : configJson.default;
    const response = {};
    const now = new Date();
    await Promise.all([
      this.artwork.create({ artworkId: nowConfig.artworkId }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: nowConfig.topic })
    ]).then((values) => {
      values.push(nowConfig.artworkArtist, nowConfig.quoteContent, nowConfig.quoteSpeaker);
      response.data = values;
    });
    response.time = now;
    return response;
  }
};
