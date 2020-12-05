const { Service } = require('feathers-nedb');
const ax = require('axios');
const dayjs = require('dayjs');

exports.History = class History extends Service {
  async create() {

    var historyObject = {};

    const historyEndpoint = 'http://history.muffinlabs.com/date';
    await ax.get(
      historyEndpoint
    ).then(
      res => {
        res.data.data.Events.splice(1);
        res.data.data.Births.splice(1);
        res.data.data.Deaths.splice(1);
        historyObject.data = res.data;
      }
    );
    historyObject._id = dayjs().format('YYYYMMDD');
    console.log(historyObject)
    return super.create(historyObject);
  }
};
