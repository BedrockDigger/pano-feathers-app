// Initializes the `receptionist` service on path `/receptionist`
const { Receptionist } = require('./receptionist.class');
const hooks = require('./receptionist.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/receptionist', new Receptionist(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('receptionist');

  service.hooks(hooks);
};
