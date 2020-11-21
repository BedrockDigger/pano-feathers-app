const assert = require('assert');
const app = require('../../src/app');

describe('\'artwork\' service', () => {
  it('registered the service', () => {
    const service = app.service('artwork');

    assert.ok(service, 'Registered the service');
  });
});
