const { Service } = require('feathers-nedb');
const ax = require('axios');

exports.History = class History extends Service {
  async create() {

    var historyObject = {};

    const date = new Date();
    const customId = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

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
    historyObject._id = customId;
    return super.create(historyObject);
  }
};
