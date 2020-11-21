const assert = require('assert');
const app = require('../../src/app');

describe('\'feeder\' service', () => {
  it('registered the service', () => {
    const service = app.service('feeder');

    assert.ok(service, 'Registered the service');
  });
});
