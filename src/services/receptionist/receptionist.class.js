const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

/* eslint-disable no-unused-vars */
exports.Receptionist = class Receptionist {
  constructor(options) {
    this.artwork = options.services.artwork;
    this.history = options.services.history;
    this.wordcloud = options.services.wordcloud;
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/settings.json'), 'utf-8'));
    this.customId = dayjs().format('d');
    this.nowConfig = config[this.customId];
  }

  async find() {
    const today = dayjs().format('YYYYMMDD');
    const response = await Promise.all([
      this.history.get(today),
      this.wordcloud.get(today),
      this.artwork.get(today),
    ]).then(([h, w, a]) => ({
      todayInHistory: h,
      wordCloud: w,
      artwork: {
        data: a,
      },
      quote: {
        content: this.nowConfig.quoteContent,
        speaker: this.nowConfig.quoteSpeaker
      }
    }));
    return response;
  }

  async create() {
    await Promise.all([
      this.artwork.create({ artworkId: this.nowConfig.artworkId }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: this.nowConfig.topic })
    ]);
    return { message: 'Created.' };
  }
};
