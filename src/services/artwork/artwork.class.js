const { Service } = require('feathers-nedb');
const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

exports.Artwork = class Artwork extends Service {
  async create(data) {
    const raw = await axios.get(data.artworkId);
    const $ = cheerio.load(raw.data);
    let artworkObj = {};
    artworkObj.artist = $('.hiudGQ').first().text();
    artworkObj.title = $('.cEzhuq').eq(1).text();
    artworkObj.medium = $('.cEzhuq').eq(2).text();
    artworkObj.dimensions = $('.cEzhuq').eq(4).text();
    artworkObj.collectingInstitution = $('.blgKsD').first().text();
    artworkObj.imageSrc = $('.dAJLTk').attr('src');
    artworkObj.href = data.artworkId;
    artworkObj._id = dayjs().format('YYYYMMDD');
    return super.create(artworkObj);
  }
};
