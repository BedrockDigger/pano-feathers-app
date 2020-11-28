const assert = require('assert');
const app = require('../../src/app');

describe('\'receptionist\' service', () => {
  it('registered the service', () => {
    const service = app.service('Receptionist');

    assert.ok(service, 'Registered the service');
  });
});
