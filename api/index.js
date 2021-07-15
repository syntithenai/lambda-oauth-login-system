const express = require('express')
const https = require('https')
const fs = require('fs')
//const cors = require('cors')
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
	//, cors()
	app.use('/dev/login/api/',loginRouter)
	app.use('/dev/login',function (req,res) {
		if (!template.trim()) {
			// serve compressed build file that uses LoginSystemContext
			template = String(fs.readFileSync(path.join(__dirname,'./build', 'index.html')))
			//console.log(config)
			template = template.replace(/###MARKER_loginServer###/g,config.loginServer).replace(/###MARKER_allowedOrigins###/g,config.allowedOrigins)
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
