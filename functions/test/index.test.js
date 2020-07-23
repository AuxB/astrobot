const { dialogflowFirebaseFulfillment } = require('../src/index')
const { assert } = require('chai')

const request = (bodyName, intentType) => {
    return {
        body: {
            queryResult: {
                parameters: {
                    'body-name': bodyName
                },
                intent: {
                    'displayName': intentType
                }
            }
        }
    };
};

describe('dialogflowFirebaseFulfillment', () => {
    it('The response and request have correct type (string, object...)', () => {
        const req = request('earth', 'get-is-planet');
        assert.typeOf(req.body.queryResult.parameters['body-name'], 'string');
        assert.typeOf(req.body.queryResult.intent.displayName, 'string');
        const res = {
            json: (resBody) => {
                assert.typeOf(resBody, 'object');
                assert.typeOf(resBody.fulfillmentText, 'string');
                console.log(resBody);
            }
        }
        dialogflowFirebaseFulfillment(req, res);
    });
    it('The response is correct if the request is undefined or wrong', () => {
        const req = request('Coruscant', '');
        const res = {
            json: (resBody) => {
                assert.equal(resBody.fulfillmentText, 'I don\'t know this body, does it exist ?!')
                console.log(resBody);
            }
        }
        dialogflowFirebaseFulfillment(req, res);
    });
    it('The response is not empty', () => {
        const req = request('moon', 'get-body-global-info');
        const res = {
            json: (resBody) => {
                const notEmpty = resBody.fulfillmentText !== ''
                assert.equal(notEmpty, true);
            }
        }
        dialogflowFirebaseFulfillment(req, res);
    });
});
