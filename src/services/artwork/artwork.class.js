const { Service } = require('feathers-nedb');
const ax = require('axios');
const varConfig = require('../../../var-config.json');

exports.Artwork = class Artwork extends Service {
  async create(data) {
    var artworkObject = {};
    const tokenEndpoint = 'https://api.artsy.net/api/tokens/xapp_token';
    const artworkEndpoint = 'https://api.artsy.net/api/artworks';
    var token = null;
    var { artworkId } = data;
    const date = new Date();
    const customId = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

    await ax.post(
      tokenEndpoint,
      {},
      {
        params: {
          'client_id': varConfig.artsyClientId,
          'client_secret': varConfig.artsyClientSecret
        }
      }
    ).then(
      res => {
        token = res.data.token;
      }
    );
    await ax.get(
      artworkEndpoint + '/' + artworkId,
      {
        headers: {
          'X-XAPP-Token': token
        }
      }
    ).then(
      res => {
        artworkObject.data = res.data;
      }
    );
    artworkObject._id = customId;
    return super.create(artworkObject);
  }
};
