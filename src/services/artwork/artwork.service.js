// Initializes the `artwork` service on path `/artwork`
const { Artwork } = require('./artwork.class');
const createModel = require('../../models/artwork.model');
const hooks = require('./artwork.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/artwork', new Artwork(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('artwork');

  service.hooks(hooks);
};
