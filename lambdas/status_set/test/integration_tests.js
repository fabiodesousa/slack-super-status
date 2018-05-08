const expect = require('chai').expect;
const index = require('../index');

describe('integration test', () => {
  describe('successful status change', () => {
    it('changes the slack status successfully', async () => {
      const event = {
        pathParameters: {
          token: process.env.SLACK_TOKEN,
          status: 'remote',
        }
      }
      const result = await index.handler(event);
      expect(result.statusCode).to.equal(200);
    })
  })
});
