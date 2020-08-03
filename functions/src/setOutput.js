// @flow
const compareBody = require('./compareBody');

/**
* @function - Switch case who compare according to the intentType
* @param {object} firstBody - The current body
* @param {object} scndBody - The second body to compare
* @param {object} intentType - The type of the intent
* @return {string}
*/
module.exports = function setOut(firstBody: Object, scndBody: Object, intentType: string): string {
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
};
