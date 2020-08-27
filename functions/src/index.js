// @flow
const functions: any = require('firebase-functions');
const getBodyData = require('./api/getBodyData');

/**
* @function - Retrieve data from Dialogflow and send the response through getBodyData and res.json
* @param {object} req - The request of Dialogflow
* @param {object} res - The response send to dialogflow
* @return {object}
*/
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // retrieve data bodyname and display send by the dialogflow bot
  const bodyName: string = req.body.queryResult.outputContexts[0].parameters['body-name'];
  const newBodyName: string = req.body.queryResult.parameters['new-body-name'] || 'S/2017 J 8';
  const intentType: string = req.body.queryResult.intent.displayName;
  getBodyData(bodyName, newBodyName, intentType)
    .then((output: string) => {
      res.json({ fulfillmentText: output });
    })
    .catch(() => {
      res.json({ fulfillmentText: 'I don\'t know this body, sorry... Can you say it again please ?' });
    });
});
