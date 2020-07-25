// @flow

const http: any = require('https');
const functions: any = require('firebase-functions');

/* function take two parameters : bodyName for the name of astral body and intentType
to determine what response what response we send after the call API  */
function getGlobalInfo(bodyName: string, intentType: string): any {
  return new Promise((resolve, reject) => {
    const path: string = `https://api.le-systeme-solaire.net/rest/bodies/?filter[]=englishName,eq,${bodyName}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue,isPlanet`;

    http.get(path, (res) => {
      let data: string = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response: any = JSON.parse(data);
        if (response.bodies.length <= 0 || intentType === '' || bodyName === '') {
          return reject(new Error('Error calling the astral API'));
        }
        const name: string = response.bodies[0].englishName;
        const mass: string = response.bodies[0].mass.massValue;
        const radius: string = response.bodies[0].meanRadius;
        const { gravity } = response.bodies[0];
        const { isPlanet } = response.bodies[0];
        // Create response
        let output: string = '';
        if (intentType === 'get-body-global-info') {
          output = `${name} have a mass of ${mass}*10^26kg
          with a radius of ${radius}km and his gravity is ${gravity}m/s² !`;
        } else if (intentType === 'get-is-planet') {
          if (isPlanet) {
            output = `Yes, ${name} is a beautiful planet !`;
          } else {
            output = `${name} is not a planet... Maybe a star or satellite !`;
          }
        }
        // Resolve the promise with the output text
        return resolve(output);
      });
      res.on('error', (error) => {
        reject(new Error(`Error calling the astral API: ${error}`));
      });
    });
  });
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // retrieve data bodyname and displa send by the dialogflow bot
  const bodyName: string = req.body.queryResult.parameters['body-name'];
  const intentType: string = req.body.queryResult.intent.displayName;
  getGlobalInfo(bodyName, intentType)
    .then((output) => {
      res.json({ fulfillmentText: output });
    })
    .catch(() => {
      res.json({ fulfillmentText: 'I don\'t know this body, sorry... Can you say it again please ?' });
    });
});
