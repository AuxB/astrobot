/**
* @function - Compare multiple value to determine the sentences to send
* @param {object} firstBody - The current body
* @param {object} scndBody - The second body to compare
* @return {string}
*/
module.exports = function compareBody(firstBody, scndBody) {
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
};