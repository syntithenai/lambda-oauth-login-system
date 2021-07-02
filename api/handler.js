
const serverless = require('serverless-http');
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const fs = require('fs')
const loginSystem = require('express-oauth-login-system-server')
const path = require('path')
let config = require('./authconfig');
const app = express()
app.use(bodyParser.json())
app.use(methodOverride())

var template = ''

 
module.exports.login =  async (event, context) => {
	const login = await loginSystem(config)
	const loginRouter = login.router
	const authenticate = login.authenticate
	app.use(config.lambdaUrl + '/api/',loginRouter)
	app.use(config.lambdaUrl + '/',function (req,res) {
		if (!template.trim()) {
			// serve compressed build file that uses LoginSystemContext
			template = String(fs.readFileSync(path.join(__dirname,'./build', 'index.html')))
			template = template.replace(/###MARKER_loginServer###/g,config.loginServer).replace(/###MARKER_allowedOrigins###/g,config.allowedOrigins)
			//.replace(/###MARKER_allowedOrigins###/g,config.allowedOrigins)	
		}
		res.send( template);
    });

	const loginApp = serverless(app);

	return await loginApp(event,context)
}
