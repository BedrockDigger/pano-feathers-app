const { Service } = require('feathers-nedb');
const ax = require('axios');
const md5 = require('md5');
const Bottleneck = require('bottleneck');
const varConfig = require('../../config/apikey.json');
const dayjs = require('dayjs');

exports.Wordcloud = class Wordcloud extends Service {
  async create(data) {
    var { topicKeyword } = data;
    var wordcloudObject = {};
    const langList = [
      'zh', 'yue', 'wyw', 'jp', 'kor',
      'fra', 'spa', 'th', 'ara', 'ru',
      'pt', 'de', 'it', 'el', 'nl',
      'pl', 'bul', 'est', 'dan', 'fin',
      'cs', 'rom', 'slo', 'swe', 'hu',
      'cht', 'vie'
    ];
    const wordsColl = [];
    const appid = varConfig.baiduTranslateAppId;
    const limiter = new Bottleneck({
      minTime: 101,
      maxConcurrent: 1
    });

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    await Promise.all(langList.map((lang) => {
      const randNum = getRandomInt(1, 99999);
      const sign = md5(appid + topicKeyword + randNum + varConfig.baiduTranslateKey); // according to http://api.fanyi.baidu.com/api/trans/product/apidoc#joinFile
      return limiter.schedule(() =>
        ax.get(
          'https://fanyi-api.baidu.com/api/trans/vip/translate',
          {
            params: {
              q: topicKeyword,
              from: 'en',
              to: lang,
              appid: appid,
              salt: randNum,
              sign: sign
            }
          }
        )
      ).then(
        async (res) => {
          const translatedWord = res.data.trans_result[0].dst;
          const wordObj = {
            text: translatedWord,
            value: getRandomInt(20, 51)
          };
          wordsColl.push(wordObj);
        }
      );
    }));
    wordcloudObject.data = wordsColl;
    wordcloudObject._id = dayjs().tz("Etc/GMT-12").format('YYYYMMDD');
    return super.create(wordcloudObject);
  }
};
