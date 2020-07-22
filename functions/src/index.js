// @flow

const express = require('express');
// const { WebhookClient } = require('dialogflow-fulfillment')
const app = express();
const http = require('https');
const functions = require('firebase-functions');

function getGlobalInfo(bodyName) {
  return new Promise((resolve, reject) => {
    const path = `https://api.le-systeme-solaire.net/rest/bodies/?filter[]=englishName,eq,${bodyName}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue`;

    http.get(path, (res) => {
      let data = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response: any = JSON.parse(data);
        console.log(response);
        const name: string = response.bodies[0].englishName;
        const mass: string = response.bodies[0].mass.massValue || 'unknown';
        const radius: string = response.bodies[0].meanRadius;
        const { gravity } = response.bodies[0];

        // Create response
        const output: string = `
      ${name} have a mass of ${mass}*10^26kg
      with a radius of ${radius}km and his gravity is ${gravity}m/s² !
      `;
        // Resolve the promise with the output text

        resolve(output);
      });
      res.on('error', (error) => {
        reject(new Error(`Error calling the astral API: ${error}`));
      });
    });
  });
}

app.get('/', (req, res) => res.send('online'));
// app.post('/dialogflow', express.json(), (req, res) => {
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // const agent = new WebhookClient({ request: req, response: res })

  const bodyName = req.body.queryResult.parameters['body-name'];

  getGlobalInfo(bodyName)
    .then((output) => {
      res.json({ fulfillmentText: output });
    })
    .catch(() => {
      res.json({ fulfillmentText: 'I don\'t know this body, do it exist ?!' });
    });

  // const intentMap = new Map()
  // intentMap.set('get-body-global-info', getGlobalInfo(bodyName))
  // agent.handleRequest(intentMap)
});

// app.listen(process.env.PORT || 8080)

// module.exports = getGlobalInfo
