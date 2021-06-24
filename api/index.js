const express = require('express')
const https = require('https')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const loginSystem = require('express-oauth-login-system-server')
const path = require('path')

require('dotenv').config()
let config = require('./authconfig');

const app = express()
app.use(bodyParser.json())
app.use(methodOverride())

var template = ''

 
//console.log(JSON.stringify(process.env))
loginSystem(config).then(function(login) {
	const loginRouter = login.router
	const authenticate = login.authenticate
	app.use('/dev/login/api/',	cors(), loginRouter)
	app.use('/dev/login/',cors(), function (req,res) {
		if (!template.trim()) {
			template = String(fs.readFileSync(path.join(__dirname,'./build', 'index.html')))
			var pre = template.slice(0,400).replace('###MARKER_loginServer###',config.loginServer).replace('###MARKER_allowedOrigins###',config.allowedOrigins)
			template = pre + template.slice(400)		
		}
		res.send( template);
	});
  
	const port=5000
	https.createServer({
		key: fs.readFileSync(process.env.sslKeyFile),
		cert: fs.readFileSync(process.env.sslCertFile),
	}, app).listen(port, () => {
	  console.log(`Login server listening securely at https://localhost:`+port)
	})  
})
//module.exports = app
