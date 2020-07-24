const { expect } = require('chai');
const { dialogflowFirebaseFulfillment } = require('../src/index');

const request = (bodyName, intentType) => ({
  body: {
    queryResult: {
      parameters: {
        'body-name': bodyName,
      },
      intent: {
        displayName: intentType,
      },
    },
  },
});

describe('dialogflowFirebaseFulfillment', () => {
  it('The response and request have correct type (string, object...)', () => {
    const req = request('earth', 'get-is-planet');
    expect(req.body.queryResult.parameters['body-name']).to.be.a('string');
    expect(req.body.queryResult.intent.displayName).to.be.a('string');
    const res = {
      json: (resBody) => {
        expect(resBody).to.be.a('object');
        expect(resBody.fulfillmentText).to.be.a('string');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
  it('The response is correct if the request is empty or wrong', () => {
    const req = request('', 'body-name');
    const res = {
      json: (resBody) => {
        expect(resBody.fulfillmentText).to.equal('I don\'t know this body, does it exist ?!');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
  it('The response is not empty', () => {
    const req = request('moon', 'get-body-global-info');
    const res = {
      json: (resBody) => {
        const notEmpty = resBody.fulfillmentText !== '';
        expect(notEmpty).to.equal(true);
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
});
