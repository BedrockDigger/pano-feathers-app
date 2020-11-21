// Initializes the `history` service on path `/history`
const { History } = require('./history.class');
const createModel = require('../../models/history.model');
const hooks = require('./history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/history', new History(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('history');

  service.hooks(hooks);
};
