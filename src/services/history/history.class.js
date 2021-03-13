const { Service } = require('feathers-nedb');
const ax = require('axios');
const dayjs = require('dayjs');

exports.History = class History extends Service {
  async create() {
    console.log('HISTORY CREATE STARTED');
    let historyObject = {};

    const historyEndpoint = 'http://history.muffinlabs.com/date/';
    const month = dayjs().format('M');
    const day = dayjs().format('D');
    await ax.get(
      historyEndpoint + month + '/' + day
    ).then(
      res => {
        res.data.data.Events?.splice(1);
        res.data.data.Births?.splice(1);
        res.data.data.Deaths?.splice(1);
        historyObject.data = res.data;
      }
    );
    historyObject._id = dayjs().tz("Etc/GMT-12").format('YYYYMMDD');
    console.log('HISTORY CREATE FINISHED');
    return super.create(historyObject);
  }
};
