
const serverless = require('serverless-http');
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const fs = require('fs')
//const mongoose = require('mongoose')
//const restify = require('express-restify-mongoose')
//const jwt = require('jsonwebtoken');
const loginSystem = require('express-oauth-login-system-server')
const path = require('path')
let config = require('./authconfig');
//console.log(config)
const app = express()
app.use(bodyParser.json())
app.use(methodOverride())




//mongoose.connect('mongodb://mnemo:mnemo@localhost:27017/mnemo')


var router = express.Router();
//restify.serve(router, mongoose.model('User', new mongoose.Schema({
  //name: { type: String, required: true },
  //avatar: { type: String }
//})))
//app.use(config.lambdaUrl+ '/restify',router)  // /dev/login/restify/api/v1/User

//app.use('/login/www', function (req, res) {
   //res.sendFile( path.join(__dirname,'./build', 'index.html'));
//});
//app.use(config.lambdaUrl + '/www', express.static(path.join(__dirname, 'build')))
//app.use('/*',express.static( path.join(__dirname,'./build')));



//// AUTHENTICATION

//loginApp.use(async function(req,res,next) {
	//console.log('PRE')
	////console.log(process.env)
	//res.send('OKYDOKE')
	//// extract email address from auth header and set req.user.email
	//let token = req.headers.authorization ? req.headers.authorization : ((req.query && req.query.id_token) ? req.query.id_token : null)
	//console.log(token);
	//if (token) { 
		//console.log('auth')
		//var emailDirect = '';
		//try {
			//const unverifiedDecodedAuthorizationCodeIdToken = jwt.decode(token, { complete: true });
			//emailDirect = unverifiedDecodedAuthorizationCodeIdToken && unverifiedDecodedAuthorizationCodeIdToken.payload ? unverifiedDecodedAuthorizationCodeIdToken.payload.email : '';
			//req.user={email:emailDirect}
			//console.log(['set user from token',emailDirect])
		//} catch (e) {
			//console.log(e)
		//}
	//}		
//})
	 
module.exports.login =  async (event, context) => {
	// todo write to /tmp
	var template = String(fs.readFileSync(path.join(__dirname,'./build', 'index.html')))
	var pre = template.slice(0,400).replace('###MARKER_authServer###',config.authServer).replace('###MARKER_allowedOrigins###',config.allowedOrigins)
	template = pre + template.slice(400)
	const login = loginSystem(config)
	const loginRouter = login.router
	const authenticate = login.authenticate
	app.use(config.lambdaUrl + '/api/',loginRouter)
	app.use(config.lambdaUrl + '/',function (req,res) {
		res.send( template);
    });

	const loginApp = serverless(app);

	return await loginApp(event,context)
}

