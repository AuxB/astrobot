// @flow
import type { SolarSystemBody } from '../SolarSystemBody';

const axios = require('axios');
const setOutput = require('../setOutput');
/**
* @function - Make call api with the parameters and create object to store the data
* @param {object} bodyName - The current body
* @param {object} newBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/
module.exports = function getBodyData(bodyName: string,
  newBody: string, intentType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const path: string = `https://api.le-systeme-solaire.net/rest/bodies/?satisfy=any&filter[]=englishName,eq,${bodyName}&filter[]=englishName,eq,${newBody}&data=englishName,inclinaison,meanRadius,gravity,mass,massValue,isPlanet`;

    axios.get(path)
      .then((res) => res.data)
      .then((data) => {
        const firstBody: SolarSystemBody = {
          name: data.bodies[0].englishName,
          mass: data.bodies[0].mass.massValue,
          radius: data.bodies[0].meanRadius,
          gravity: data.bodies[0].gravity,
          isPlanet: data.bodies[0].isPlanet,
        };
        const scndBody: SolarSystemBody = {
          name: data.bodies[1].englishName,
          mass: data.bodies[1].mass.massValue,
          radius: data.bodies[1].meanRadius,
          gravity: data.bodies[1].gravity,
          isPlanet: data.bodies[1].isPlanet,
        };

        // Create response
        const output: string = setOutput(firstBody, scndBody, intentType);

        // Resolve the promise with the output text
        return resolve(output);
      })
      .catch((error) => reject(new Error(`Error calling the astral API: ${error}`)));
  });
};
