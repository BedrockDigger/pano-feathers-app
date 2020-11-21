const assert = require('assert');
const app = require('../../src/app');

describe('\'wordcloud\' service', () => {
  it('registered the service', () => {
    const service = app.service('wordcloud');

    assert.ok(service, 'Registered the service');
  });
});
