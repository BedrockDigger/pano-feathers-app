// Initializes the `feeder` service on path `/feeder`
const { Feeder } = require('./feeder.class');
const hooks = require('./feeder.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/feeder', new Feeder(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('feeder');

  service.hooks(hooks);
};
