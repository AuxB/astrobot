// @flow

// const { WebhookClient } = require('dialogflow-fulfillment')
const http: any = require('https');
const functions: any = require('firebase-functions');

function getGlobalInfo(bodyName: string): any {
  return new Promise((resolve, reject) => {
    const path = `https://api.le-systeme-solaire.net/rest/bodies/?filter[]=englishName,eq,${bodyName}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue`;

    http.get(path, (res) => {
      let data: string = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response: any = JSON.parse(data);
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

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // const agent = new WebhookClient({ request: req, response: res })

  const bodyName: string = req.body.queryResult.parameters['body-name'];
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

// module.exports = getGlobalInfo
