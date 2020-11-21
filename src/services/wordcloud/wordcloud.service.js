// Initializes the `wordcloud` service on path `/wordcloud`
const { Wordcloud } = require('./wordcloud.class');
const createModel = require('../../models/wordcloud.model');
const hooks = require('./wordcloud.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wordcloud', new Wordcloud(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wordcloud');

  service.hooks(hooks);
};
