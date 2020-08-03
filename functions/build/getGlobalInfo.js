const http = require('https');

const setOutput = require('./setOutput');
/**
* @global - Object type use for fullfiled data bodies
*/


const bodySys = {};
/**
* @function - Make call api with the parameters and create object to store the data
* @param {object} bodyName - The current body
* @param {object} newBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/

module.exports = function getInfos(bodyName, newBody, intentType) {
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
};