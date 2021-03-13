const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {

  setup(app) {
    const configPath = path.join(__dirname, '../../config/contents.json');
    this.allConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    this.artwork = app.service('artwork');
    this.history = app.service('history');
    this.wordcloud = app.service('wordcloud');
  }

  async get(id) {
    const customId = dayjs().format('d');
    const config = this.allConfig[customId];
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
        content: config.quoteContent,
        speaker: config.quoteSpeaker
      }
    }));
    return response;
  }

  async create() {
    const customId = dayjs().format('d');
    const config = this.allConfig[customId];
    const data = await Promise.all([
      this.artwork.create({ artworkUrl: config.artworkUrl }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: config.topic })
    ]);
    const gmt12Time = dayjs().tz("Etc/GMT-12").format();
    const deTime = dayjs().format();
    console.log('Full data object created on\n');
    console.log('GMT-12 time: ' + gmt12Time + '\n');
    console.log('German time: ' + deTime + '\n');
    return {
      message: 'Created.',
      gmt12Time: gmt12Time,
      deTime: deTime,
      data: data
    };
  }
};
