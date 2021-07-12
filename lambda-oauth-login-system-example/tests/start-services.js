const path = require('path')
const cors = require('cors')
const axiosLib = require('axios');
const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const loginSystem = require('express-oauth-login-system-server')
const express = require('express');
const config = require('./test-config')
const dbHandler = require('./db-handler');

async function startServices() {

	var User = null 
	var OAuthClient = null 
	var loginTemplate = ''
	var exampleTemplate = ''
	var loginPort = 5100
	var examplePort = 5101
	const loginOrigin = 'https://localhost:' + loginPort
	const loginBaseUrl = loginOrigin + "/dev/login"
	const exampleOrigin = 'https://localhost:' + examplePort
	const exampleBaseUrl = exampleOrigin + "/dev/handler"
	const loginApp = express();
	const exampleApp = express();
	var loginServer = null
	var exampleServer = null
		
   // database server
	var uri = await dbHandler.connect()
	console.log(uri)
	//console.log(config)
	// login server
	const login = await loginSystem(Object.assign({},config, {loginFailRedirect:loginBaseUrl, loginSuccessRedirect: loginBaseUrl + '/#success', databaseConnection:uri, authServer:loginOrigin+"/dev/login/api", loginServer:loginBaseUrl, allowedOrigins:loginOrigin +  ',' + exampleOrigin}))
	// extract models
	User = login.database.User
	OAuthClient = login.database.OAuthClient
	loginApp.use('/dev/login/api/',	cors(), login.router)
	loginApp.use('/dev/login/',cors(), function (req,res) {
		loginTemplate = String(fs.readFileSync(path.join(__dirname,'../../api/build', 'index.html')))
		loginTemplate = loginTemplate.replace(/###MARKER_loginServer###/g,loginOrigin+"/dev/login").replace(/###MARKER_allowedOrigins###/g,'https://localhost:'+loginPort+ ',https://localhost:'+ examplePort)
		res.send( loginTemplate);
		
	});
	loginServer =  https.createServer({
		key: fs.readFileSync(path.join(__dirname,'../../api/certs/key.pem')),
		cert: fs.readFileSync(path.join(__dirname,'../../api/certs/cert.pem')),
	}, loginApp).listen(loginPort, () => {
	//  console.log(`Login server listening  at https://localhost:` + loginPort)
	}) 
	
	// example app using login system on different port
	exampleApp.use('/dev/handler/', function (req,res) {
		exampleTemplate = String(fs.readFileSync(path.join(__dirname,'../../lambda-oauth-login-system-example/react-login-example/buildfinal', 'index.html')))
		exampleTemplate = exampleTemplate.replace(/###MARKER_loginServer###/g,loginOrigin + "/dev/login")
		res.send( exampleTemplate);
	});
	exampleServer =  https.createServer({
		key: fs.readFileSync(path.join(__dirname,'../../api/certs/key.pem')),
		cert: fs.readFileSync(path.join(__dirname,'../../api/certs/cert.pem')),
	}, exampleApp).listen(examplePort, () => {
	 // console.log(`Example server listening  at https://localhost:` + examplePort)
	}) 

	function getAxiosClient(loginOrigin, loginBaseUrl, token,cookies, contentType) {
		var headers = {'Origin': loginOrigin}
		if (token) {
			headers['Authorization'] =  'Bearer '+token
		}
		if (cookies) {
			headers['Cookie'] =  cookies.join("; ")
		}
		if (contentType) {
		 headers['Content-Type'] = contentType
		}
		var authClient = axiosLib.create({
			  //baseURL: loginBaseUrl,
			  httpsAgent: new https.Agent({  
				rejectUnauthorized: false
			  }),
			  timeout: 3000,
			  headers: headers,
			  withCredentials: true
			});
		return authClient
	}
	
	var teardown = async function() {
		await dbHandler.closeDatabase()
		await loginServer.close()
		await exampleServer.close()
	}

	
	return {teardown, dbUri: uri, dbHandler, database: login.database, getAxiosClient, examplePort, exampleOrigin, exampleBaseUrl, exampleApp, exampleServer, loginPort, loginOrigin, loginBaseUrl, loginApp, loginServer}
		
}


module.exports = startServices
