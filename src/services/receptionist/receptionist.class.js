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
    this.customId = dayjs().format('YYYYMMDD');
    this.nowConfig = config[this.customId] ? config[this.customId] : config.default;
  }

  async find() {
    const response = await Promise.all([
      this.history.get(this.customId),
      this.wordcloud.get(this.customId),
      this.artwork.get(this.customId),
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
    return 'created';
  }

  async create() {
    await Promise.all([
      this.artwork.create({ artworkId: this.nowConfig.artworkId }),
      this.history.create({}),
      this.wordcloud.create({ topicKeyword: this.nowConfig.topic })
    ]);
    return await this.find();
  }
};
