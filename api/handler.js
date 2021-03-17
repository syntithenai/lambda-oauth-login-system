
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
	const login = loginSystem(config)
	const loginRouter = login.router
	const authenticate = login.authenticate
	app.use(config.lambdaUrl + '/api/',loginRouter)
	app.use(config.lambdaUrl + '/',function (req,res) {
		if (!template.trim()) {
			template = String(fs.readFileSync(path.join(__dirname,'./build', 'index.html')))
			var pre = template.slice(0,400).replace('###MARKER_loginServer###',config.loginServer).replace('###MARKER_allowedOrigins###',config.allowedOrigins)
			template = pre + template.slice(400)		
		}
		res.send( template);
    });

	const loginApp = serverless(app);

	return await loginApp(event,context)
}
