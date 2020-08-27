const { expect } = require('chai');
const sinon = require('sinon');
const { dialogflowFirebaseFulfillment } = require('../src/index');
const { getBodyData } = require('../src/api/getBodyData');

const request = (bodyName, newBodyName, intentType) => ({
  body: {
    queryResult: {
      parameters: {
        'body-name': bodyName,
        'new-body-name': newBodyName,
      },
      intent: {
        displayName: intentType,
      },
      outputContexts: [
        {
          parameters: {
            'body-name': bodyName,
          },
        },
      ],
    },
  },
});

describe('getBodyType', () => {
  it('If the request is empty or wrong, send the message error', () => {
    const req = request('', '', 'body-name');
    const res = {
      json: (resBody) => {
        expect(resBody.fulfillmentText).to.equal('I don\'t know this body, sorry... Can you say it again please ?');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
  it('The response and request have correct type (string, object...)', () => {
    const req = request('earth', '', 'get-is-planet');
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
});

describe('setOutput', () => {
  it('The response is exact if the body is not a planet', () => {
    const req = request('moon', '', 'get-is-planet');
    expect(req.body.queryResult.parameters['body-name']).to.be.a('string');
    expect(req.body.queryResult.intent.displayName).to.be.a('string');
    const res = {
      json: (resBody) => {
        expect(resBody).to.be.a('object');
        expect(resBody.fulfillmentText).to.equal('Moon is not a planet... Maybe a star or satellite !');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });

  it('The response is not empty', () => {
    const req = request('moon', 'mars', 'get-body-global-info');
    const res = {
      json: (resBody) => {
        const notEmpty = resBody.fulfillmentText !== '';
        expect(notEmpty).to.equal(true);
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
  it('If the intent type is wrong, send the message error', () => {
    const req = request('moon', 'mars', 'get');
    const res = {
      json: (resBody) => {
        expect(resBody.fulfillmentText).to.equal('I don\'t know this body, sorry... Can you say it again please ?');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
});

describe('compareBody', () => {
  it('If firstBody is smaller than the second body, the message must be "Moon is smaller than Mars and has a lower gravity !"', () => {
    const req = request('moon', 'mars', 'compare-body');
    const res = {
      json: (resBody) => {
        expect(resBody.fulfillmentText).to.be.a('string');
        expect(resBody.fulfillmentText).to.equal('Moon is smaller than Mars and has a lower gravity !');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
  it('If firstBody is bigger than the second body, the message must be "Saturn is bigger than Earth and has a lower gravity !"', () => {
    const req = request('earth', 'saturn', 'compare-body');
    const res = {
      json: (resBody) => {
        expect(resBody.fulfillmentText).to.be.a('string');
        expect(resBody.fulfillmentText).to.equal('Saturn is bigger than Earth and has a higher gravity !');
      },
    };
    dialogflowFirebaseFulfillment(req, res);
  });
});
