// @flow
const http: any = require('https');
const setOutput = require('./setOutput');
/**
* @global - Type use for fullfiled data bodies
*/
type SolarSystemBody = {
  name: string,
  mass: string,
  radius: string,
  gravity: string,
  isPlanet: boolean,
};
/**
* @function - Make call api with the parameters and create object to store the data
* @param {object} bodyName - The current body
* @param {object} newBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/
module.exports = function getInfos(bodyName: string,
  newBody: string, intentType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const path: string = `https://api.le-systeme-solaire.net/rest/bodies/?satisfy=any&filter[]=englishName,eq,${bodyName}&filter[]=englishName,eq,${newBody}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue,isPlanet`;

    http.get(path, (res) => {
      let data: string = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response: Object = JSON.parse(data);
        if (response.bodies.length <= 0 || intentType === '' || bodyName === '') {
          return reject(new Error('Error calling the astral API'));
        }

        const firstBody: SolarSystemBody = {
          name: response.bodies[0].englishName,
          mass: response.bodies[0].mass.massValue,
          radius: response.bodies[0].meanRadius,
          gravity: response.bodies[0].gravity,
          isPlanet: response.bodies[0].isPlanet,
        };
        const scndBody: SolarSystemBody = {
          name: response.bodies[1].englishName,
          mass: response.bodies[1].mass.massValue,
          radius: response.bodies[1].meanRadius,
          gravity: response.bodies[1].gravity,
          isPlanet: response.bodies[1].isPlanet,
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
};
