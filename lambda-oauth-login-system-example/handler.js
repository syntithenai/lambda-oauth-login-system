
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
//let config = require('./authconfig');
//console.log(config)
const app = express()
app.use(bodyParser.json())
app.use(methodOverride())
console.log(process.env)
// disable ssl checks for localhost
if (process.env.IS_OFFLINE === 'true') {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

function getGatewayUrl() {
	if (process.env.IS_OFFLINE !== 'true') {
		return process.env.LAMBDA_REST_GATEWAY 
	// offline mode
	} else {
		return process.env.LAMBDA_REST_GATEWAY_OFFLINE
	}
}

function getLoginGatewayUrl() {
	if (process.env.IS_OFFLINE !== 'true') {
		return process.env.LOGIN_LAMBDA_REST_GATEWAY 
	// offline mode
	} else {
		return process.env.LOGIN_LAMBDA_REST_GATEWAY_OFFLINE
	}
}

//var config={lambdaUrl: getGatewayUrl() + "/handler"}

//console.log(config)

//console.log(process.env)


//mongoose.connect('mongodb://mnemo:mnemo@localhost:27017/mnemo')


//var router = express.Router();
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
	 
module.exports.handler =  async (event, context) => {
	
	
	app.use('/handler/api/',function(req,res) {res.json({API:""})} )
	
	// todo write to /tmp
	var template = ''
	// use prebuilt template if available otherwise proxy to create-react-app dev server
	if ( fs.existsSync(path.join(__dirname,'./react-login-example/build', 'index.html'))) {
		template = String(fs.readFileSync(path.join(__dirname,'./react-login-example/build', 'index.html')))
	} else {
		
	}
	var loginLambdaUrl = getLoginGatewayUrl() + "/login"
	var lambdaUrl = getGatewayUrl() + "/handler"
	// run example with npm start for live updates on save
	
	
	console.log([loginLambdaUrl,lambdaUrl])
	var pre = template.slice(0,400).replace('###MARKER_apiServer###',lambdaUrl).replace('###MARKER_loginServer###',loginLambdaUrl)
	template = pre + template.slice(400)
	//const login = loginSystem(config)
	//const loginRouter = login.router
	//const authenticate = login.authenticate
	app.use('/handler/',function (req,res) {
		res.send( template);
    });

	const slsApp = serverless(app);

	return await slsApp(event,context)
}

