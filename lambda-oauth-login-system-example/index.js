const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('dotenv').config()
const cors = require('cors')
//console.log(JSON.stringify(process.env))

const devapp = require('./app')

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(methodOverride())
app.use('/dev',cors(), devapp)

const port=5001
//app.listen(5001)
https.createServer({
	key: fs.readFileSync(process.env.sslKeyFile),
	cert: fs.readFileSync(process.env.sslCertFile),
}, app).listen(port, () => {
  console.log(`Listening securely at https://localhost:`+port)
})  
