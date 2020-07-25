const http = require('https');

const functions = require('firebase-functions');
/**
* @global - Object type use for fullfiled data bodies
*/


const bodySys = {};
/**
* @function - Compare multiple value to determine the sentences to send
* @param {object} firstBody - The current body
* @param {object} scndBody - The second body to compare
* @return {string}
*/

function compareBody(firstBody, scndBody) {
  let messageCompare = '';

  if (firstBody.radius > scndBody.radius) {
    messageCompare += `${firstBody.name} is bigger than ${scndBody.name} `;
  } else {
    messageCompare += `${firstBody.name} is smaller than ${scndBody.name} `;
  }

  if (firstBody.gravity > scndBody.gravity) {
    messageCompare += 'and has a higher gravity !';
  } else {
    messageCompare += 'and has a lower gravity !';
  }

  return messageCompare;
}
/**
* @function - Switch case who compare according to the intentType
* @param {object} firstBody - The current body
* @param {object} scndBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/


function setOutput(firstBody, scndBody, intentType) {
  let message = '';

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
/**
* @function - Make call api with the parameters and create object to store the data
* @param {object} bodyName - The current body
* @param {object} newBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/


function getGlobalInfo(bodyName, newBody, intentType) {
  return new Promise((resolve, reject) => {
    const path = `https://api.le-systeme-solaire.net/rest/bodies/?satisfy=any&filter[]=englishName,eq,${bodyName}&filter[]=englishName,eq,${newBody}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue,isPlanet`;
    http.get(path, res => {
      let data = '';
      res.on('data', d => {
        data += d;
      });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response = JSON.parse(data);

        if (response.bodies.length <= 0 || intentType === '' || bodyName === '') {
          return reject(new Error('Error calling the astral API'));
        }

        const firstBody = Object.create(bodySys);
        firstBody.name = response.bodies[0].englishName;
        firstBody.mass = response.bodies[0].mass.massValue;
        firstBody.radius = response.bodies[0].meanRadius;
        firstBody.gravity = response.bodies[0].gravity;
        firstBody.isPlanet = response.bodies[0].isPlanet;
        const scndBody = Object.create(bodySys);
        scndBody.name = response.bodies[1].englishName;
        scndBody.mass = response.bodies[1].mass.massValue;
        scndBody.radius = response.bodies[1].meanRadius;
        scndBody.gravity = response.bodies[1].gravity;
        scndBody.isPlanet = response.bodies[1].isPlanet; // Create response

        const output = setOutput(firstBody, scndBody, intentType); // Resolve the promise with the output text

        return resolve(output);
      });
      res.on('error', error => {
        reject(new Error(`Error calling the astral API: ${error}`));
      });
    });
  });
}
/**
* @function - Retrieve data from Dialogflow and send the response through getGlobalInfo and res.json
* @param {object} req - The request of Dialogflow
* @param {object} res - The response send to dialogflow
* @return {object}
*/


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // retrieve data bodyname and display send by the dialogflow bot
  const bodyName = req.body.queryResult.outputContexts[0].parameters['body-name'];
  const newBodyName = req.body.queryResult.parameters['new-body-name'] || 'S/2017 J 8';
  const intentType = req.body.queryResult.intent.displayName;
  getGlobalInfo(bodyName, newBodyName, intentType).then(output => {
    res.json({
      fulfillmentText: output
    });
  }).catch(() => {
    res.json({
      fulfillmentText: 'I don\'t know this body, sorry... Can you say it again please ?'
    });
  });
});