const artwork = require('./artwork/artwork.service.js');
const history = require('./history/history.service.js');
const wordcloud = require('./wordcloud/wordcloud.service.js');
const receptionist = require('./receptionist/receptionist.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(artwork);
  app.configure(history);
  app.configure(wordcloud);
  app.configure(receptionist);
};
