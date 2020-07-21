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

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {

  
})

app.listen(process.env.PORT || 8080)
