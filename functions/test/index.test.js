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
    }
}

describe('dialogflowFirebaseFulfillment', () => {
    it('The response is type of object and his text is a string', () => {
        const req = request('moon', 'get-is-planet')
        assert.typeOf(req.body.queryResult.parameters['body-name'], 'string')
        const res = {
            json: (resBody) => {
                assert.typeOf(resBody, 'object')
                assert.typeOf(resBody.fulfillmentText, 'string')
                console.log(resBody)
            }
        }
        dialogflowFirebaseFulfillment(req, res)
    });
});
