const artwork = require('./artwork/artwork.service.js');
const history = require('./history/history.service.js');
const wordcloud = require('./wordcloud/wordcloud.service.js');
const cronguy = require('./cronguy/cronguy.service.js');
const receptionist = require('./receptionist/receptionist.service.js');
const feeder = require('./feeder/feeder.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(artwork);
  app.configure(history);
  app.configure(wordcloud);
  app.configure(cronguy);
  app.configure(receptionist);
  app.configure(feeder);
};
