// 'use strict'

// const http = require('http')
// const functions = require('firebase-functions')
// const { WebhookClient } = require('dialogflow-fulfillment')

// // admin.initializeApp(functions.config().firebase);
// // const db = admin.firestore()

// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
//   // const agent = new WebhookClient({ req, res })
//   functions.logger.info('Hello logs!', { structuredData: true })
//   // const bodyName = req.body.queryResult.parameters['body-name']
//   res.send('bichon')
// })

const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const http = require('https')

function getGlobalInfo(bodyName) {
  return new Promise((resolve, reject) => {
    const path = `https://api.le-systeme-solaire.net/rest/bodies/?filter[]=englishName,eq,${bodyName}&data=englishName,inclinaison,density,gravity,mass,massValue`

    http.get(path, (res) => {
      let data = ''
      res.on('data', (d) => { data += d })
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response = JSON.parse(data)
        const name = response.bodies[0].englishName
        const mass = response.bodies[0].mass.massValue || 'unknown'
        const density = response.bodies[0].density
        const gravity = response.bodies[0].gravity

        // Create response
        const output = `
      ${name} have a mass of ${mass}
      with density of ${density} and his gravity is ${gravity}
      `

        // Resolve the promise with the output text
        console.log(output)
        resolve(output)
      })
      res.on('error', (error) => {
        console.log(`Error calling the astral API: ${error}`)
        reject()
      })
    })
  })
}

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {

  const bodyName = req.body.queryResult.parameters['body-name']

  getGlobalInfo(bodyName).then((output) => res.json({ 'fulfillmentText': output })) // Return the results of the API to Dialogflow
    .catch(() => {
      res.json({ 'fulfillmentText': 'I don\'t know this body, do it exist ?!' })
    })
  console.log(bodyName)
  getGlobalInfo(bodyName)

})

app.listen(process.env.PORT || 8080)

module.exports = getGlobalInfo
