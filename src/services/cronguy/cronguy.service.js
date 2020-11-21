// Initializes the `cronguy` service on path `/cronguy`
const { Cronguy } = require('./cronguy.class');
const hooks = require('./cronguy.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    services: {
      artwork: app.service('artwork'),
      history: app.service('history'),
      wordcloud: app.service('wordcloud')
    }
  };

  // Initialize our service with any options it requires
  app.use('/cronguy', new Cronguy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cronguy');

  service.hooks(hooks);
};
