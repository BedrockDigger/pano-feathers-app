const { Service } = require('feathers-nedb');
const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

exports.Artwork = class Artwork extends Service {
  async create(data) {
    console.log('ARTWORK CREATE STARTED');
    const raw = await axios.get(data.artworkUrl);
    const $ = cheerio.load(raw.data, { xmlMode: true });
    console.log(data);
    let artworkObj = {
      artist: $('.glLAxv').eq(2).text(),
      title: $('.gDTxCv').first().text(),
      medium: $('.glLAxv').eq(3).text(),
      dimensions: $('.glLAxv').eq(5).text(),
      collectingInstitution: $('.glLAxv').first().text(),
      imageSrc: $('.kSWfVg').find('noscript').children().attr('src'),
      href: data.artworkUrl,
      _id: dayjs().tz("Etc/GMT-12").format('YYYYMMDD')
    };
    console.log('ARTWORK CREATE FINISHED');
    return super.create(artworkObj);
  }
};
