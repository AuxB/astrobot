// @flow

const http: any = require('https');
const functions: any = require('firebase-functions');

/* function who return a string after conditions
who compare parameters of two bodies */
function compareBody(firstBody: Object, scndBody: Object): string {
  let messageCompare: string = '';
  if (firstBody.radius > scndBody.radius) {
    messageCompare += `${firstBody.name} is bigger than ${scndBody.name} `;
  } else {
    messageCompare += `${firstBody.name} is smaller than ${scndBody.name} `;
  }
  if (firstBody.gravity > scndBody.gravity) {
    messageCompare += 'and has a higher gravity  !';
  } else {
    messageCompare += 'and has a lower gravity !';
  }
  return messageCompare;
}

/* function who return the final string after
a switch case who compare according to the intentType */
function setOutput(firstBody: Object, scndBody: Object, intentType: string): string {
  let message: string = '';
  switch (intentType) {
    case 'get-body-global-info':
      message = `${firstBody.name} have a mass of ${firstBody.mass}*10^26kg
      with a radius of ${firstBody.radius}km and his gravity is ${firstBody.gravity}m/s² !`;
      break;
    case 'get-is-planet':
      if (firstBody.isPlanet) {
        message = `Yes, ${firstBody.name} is a beautiful planet !`;
      } else {
        message = `${firstBody.name} is not a planet... Maybe a star or satellite !`;
      }
      break;
    case 'compare-body':
      message = compareBody(firstBody, scndBody);
      break;
    default:
      Error('Error in the intent type');
      break;
  }
  return message;
}

/* function take two parameters : bodyName for the name of astral body and intentType
to determine what response what response we send after the call API  */
function getGlobalInfo(bodyName: string, newBody: string, intentType: string): any {
  return new Promise((resolve, reject) => {
    const path: string = `https://api.le-systeme-solaire.net/rest/bodies/?satisfy=any&filter[]=englishName,eq,${bodyName}&filter[]=englishName,eq,${newBody}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue,isPlanet`;

    http.get(path, (res) => {
      let data: string = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response: any = JSON.parse(data);
        if (response.bodies.length <= 0 || intentType === '' || bodyName === '') {
          return reject(new Error('Error calling the astral API'));
        }
        const firstBody: {
          name: string,
          mass: string,
          radius: string,
          radius: string,
          gravity: string,
          isPlanet: boolean,
        } = {
          name: response.bodies[0].englishName,
          mass: response.bodies[0].mass.massValue,
          radius: response.bodies[0].meanRadius,
          gravity: response.bodies[0].gravity,
          isPlanet: response.bodies[0].isPlanet,
        };

        const scndBody: {
          name: string,
          mass: string,
          radius: string,
          radius: string,
          gravity: string,
          isPlanet: boolean,
        } = {
          name: response.bodies[1].englishName,
          mass: response.bodies[1].mass.massValue,
          radius: response.bodies[1].meanRadius,
          gravity: response.bodies[1],
          isPlanet: response.bodies[1],
        };
        // Create response
        const output: string = setOutput(firstBody, scndBody, intentType);

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
  const bodyName: string = req.body.queryResult.outputContexts.parameters['body-name'];
  const newBodyName: string = req.body.queryResult.parameters['new-body-name'] || 'S/2017 J 8';
  const intentType: string = req.body.queryResult.intent.displayName;
  getGlobalInfo(bodyName, newBodyName, intentType)
    .then((output) => {
      res.json({ fulfillmentText: output });
    })
    .catch(() => {
      res.json({ fulfillmentText: 'I don\'t know this body, sorry... Can you say it again please ?' });
    });
});
