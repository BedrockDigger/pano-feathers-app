const assert = require('assert');
const app = require('../../src/app');

describe('\'cronguy\' service', () => {
  it('registered the service', () => {
    const service = app.service('cronguy');

    assert.ok(service, 'Registered the service');
  });
});
