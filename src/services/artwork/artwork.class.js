const { Service } = require('feathers-nedb');
const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

exports.Artwork = class Artwork extends Service {
  async create(data) {
    const raw = await axios.get(data.artworkUrl);
    const $ = cheerio.load(raw.data);
    console.log(data);
    let artworkObj = {
      artist: $('.iDZoNX').first().text(),
      title: $('.kPqROo').eq(1).text(),
      medium: $('.kPqROo').eq(2).text(),
      dimensions: $('.kPqROo').eq(4).text(),
      collectingInstitution: $('.gxmZXl').first().text(),
      imageSrc: $('.dAJLTk').attr('src'),
      href: data.artworkUrl,
      _id: dayjs().format('YYYYMMDD')
    };
    return super.create(artworkObj);
  }
};
