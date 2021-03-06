const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {

  setup(app) {
    const configPath = path.join(__dirname, '../../config/contents.json');
    const allConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const customId = dayjs().format('d');
    this.artwork = app.service('artwork');
    this.history = app.service('history');
    this.wordcloud = app.service('wordcloud');
    this.config = allConfig[customId];
  }

  async get(id) {
    const response = await Promise.all([
      this.history.get(id),
      this.wordcloud.get(id),
      this.artwork.get(id),
    ]).then(([h, w, a]) => ({
      todayInHistory: h,
      wordCloud: w,
      artwork: {
        data: a,
      },
      quote: {
        content: this.config.quoteContent,
        speaker: this.config.quoteSpeaker
      }
    }));
    return response;
  }

  async create() {
    await Promise.all([
      this.artwork.create({ artworkUrl: this.config.artworkUrl }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: this.config.topic })
    ]);
    console.log('data object successfully created.');
    return { message: 'Created.' };
  }
};
