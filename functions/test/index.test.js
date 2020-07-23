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
    it('The response is type of object and his text is a string', () => {
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
        const req = request('Coruscant', 'get-is-planet');
        const res = {
            json: (resBody) => {
                assert.equal(resBody.fulfillmentText, 'I don\'t know this body, does it exist ?!')
            }
        }
        dialogflowFirebaseFulfillment(req, res);
    });
    
});
