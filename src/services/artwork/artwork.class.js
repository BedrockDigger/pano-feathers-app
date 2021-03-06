const { Service } = require('feathers-nedb');
const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

exports.Artwork = class Artwork extends Service {
  async create(data) {
    const raw = await axios.get(data.artworkUrl);
    var $ = cheerio.load(raw.data);
    let artworkObj = {
      artist: $('.hiudGQ').first().text(),
      title: $('.cEzhuq').eq(1).text(),
      medium: $('.cEzhuq').eq(2).text(),
      dimensions: $('.cEzhuq').eq(4).text(),
      collectingInstitution: $('.blgKsD').first().text(),
      imageSrc: $('.dAJLTk').attr('src'),
      href: data.artworkUrl,
      _id: dayjs().format('YYYYMMDD')
    };
    return super.create(artworkObj);
  }
};
