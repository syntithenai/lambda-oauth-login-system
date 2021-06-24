
describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})


////const request = require('request');
//const axiosLib = require('axios');
//const http = require('http');
////const fs = require('fs');
//const loginSystem = require('express-oauth-login-system-server')
//const express = require('express');
//const config = require('./test-config')
//const dbHandler = require('./db-handler');
//const User = require('../database/User')
//const OAuthClient = require('../database/OAuthClient')

//var app = null

//var server = null

//const ORIGIN = 'http://localhost:5100'
//const baseUrl = ORIGIN

//// TODO
//// cross domain login
//// fails - cors /auth
//// check create OAuthClient
//// cors headers
//// cookies set ?
//// CSRF
//// refresh by query token
//// /login endpoint = uses passport 
//// signup validation
//// forgot validation
//// token timeout on confirm/signup
//// /signinajax
//// err handler 404 501

//function getAxiosClient(token,cookies) {
	//var headers = {'Origin': ORIGIN}
	//if (token) {
		//headers['Authorization'] =  'Bearer '+token
	//}
	//if (cookies) {
		//headers['Cookie'] =  cookies.join("; ")
	//}
	 
	//var authClient = axiosLib.create({
		  //baseURL: baseUrl,
		  //timeout: 3000,
		  //headers: headers,
		  //withCredentials: true
		//});
	//return authClient
//}

//const axios = getAxiosClient()

///**
 //* Connect to a new in-memory database before running any tests.
 //*/
//beforeAll(async () => {
	//var uri = await dbHandler.connect()
	//const login = await loginSystem(Object.assign({},config, {databaseConnection:uri, authServer:ORIGIN, loginServer:ORIGIN+"/"}))
	//app = express();
	//app.use(login.router)
	//const port=5100
	//server =  http.createServer({
		////key: fs.readFileSync(process.env.sslKeyFile),
		////cert: fs.readFileSync(process.env.sslCertFile),
	//}, app).listen(port, () => {
	  ////console.log(`Login server listening  at http://localhost:`+port)
	//}) 
//});

///**
 //* Clear all test data after every test.
 //*/
//afterEach(async () => await dbHandler.clearDatabase());

//beforeEach(async () => {
	//var clients = await OAuthClient.deleteMany({})
	//var client = new OAuthClient({
			//clientId: config.clientId, 
			//clientSecret:config.clientSecret,
			//name:config.clientName,
			//website_url:config.clientWebsite,
			//privacy_url:config.clientPrivacyPage,
			//redirectUris:[],
			//image:''
		//})
	//await client.save()
//})

///**
 //* Remove and close the db and server.
 //*/
//afterAll(async () => {
	//await dbHandler.closeDatabase()
	//server.close()
//});

///**
 //* Test Helpers
 //*/
//async function signupAndConfirmUser(name) {
	//// post create new user
	//var cres = await axios.post('/signup',{name: name,username:name,avatar:name,password:'aaa',password2:'aaa'})
	//expect(cres.data.message).toBe('Check your email to confirm your sign up.')
	//// check user in db
	//var res = await User.findOne({name:name,username:name,avatar:name,password:'',tmp_password:'aaa'})
	//expect(res.signup_token).toBeTruthy()
	//expect(parseInt(res.signup_token_timestamp)).toBeGreaterThan(0)
	//// do confirmation
	//var rres = await axios.get('/doconfirm?code='+res.signup_token)
	//return rres
//}


///**
 //* TESTS
 //*/

//describe('login system routes', () => {
    //it('can get a token through user signup flow then load /me endpoint',async () => {
		//var rres = await signupAndConfirmUser('john')
		//var token=rres.data.user.token.access_token
		//// test me endpoint
		//var authClient = getAxiosClient(token)
		//var meres = await authClient.post('/me')
		//expect(meres.data.name).toEqual('john')
	//})
    
    //it('can change password through forgot password flow',async () => {
		//await signupAndConfirmUser('bill')
		//// start recover with new pw bbb
		//var meres = await axios.post('/recover',{name:'bill',email:'bill',password:'bbb',password2:'bbb'})
		//res = await User.findOne({name:'bill',username:'bill'})
		//expect(res.recover_password_token).toBeTruthy()
		//expect(parseInt(res.recover_password_token_timestamp)).toBeGreaterThan(0)
		
		//// do recover
		//var dores = await axios.get('/dorecover?code=' + res.recover_password_token)
		//var ares = await User.findOne({name:'bill',username:'bill'})
		//expect(ares.recover_password_token).not.toBeTruthy()
		//expect(ares.password).toBe('bbb')
	//})
	
	
	 //it('can save user changes',async () => {
		//var rres = await signupAndConfirmUser('bill')
		//var token=rres.data.user.token.access_token
		////// save changes
		//var authClient = getAxiosClient(token)
		//var cres = await authClient.post('/saveuser',{_id:rres.data.user._id, name: 'jill',username:'jill',avatar:'jill'})
		//expect(cres.data.message).toBe('Saved changes')
	//})
    
    
     //it('can load buttons',async () => {	
		//// post create new user
		//var cres = await axios.get('/buttons')
		////console.log(cres.data)
		//expect(cres.data.buttons).toEqual('google,twitter,facebook,github,amazon')	
	//})
	
	//it('can get a token using refresh token cookies',async () => {
		//var rres = await signupAndConfirmUser('jane')
		//var token=rres.data.user.token.access_token
		//var cookies = rres.headers["set-cookie"]
		////axios.defaults.headers.Cookie = cookie;
		//var authClient = getAxiosClient(null,cookies)
		//var rres = await authClient.get('/refresh_token')
		//expect(rres.data.access_token).toBeTruthy()
	//})
    
    
	//it('can logout',async () => {
		//var rres = await signupAndConfirmUser('jane')
		//var token=rres.data.user.token.access_token
		//var cookies = rres.headers["set-cookie"]
		////axios.defaults.headers.Cookie = cookie;
		//var cookieClient = getAxiosClient(null,cookies)
		//var cres = await cookieClient.get('/refresh_token')
		//expect(cres.data.access_token).toBeTruthy()
		//var authClient = getAxiosClient(token)
		//var logoutRes = await authClient.post('/logout')
		//// TODO update refresh cookie from ..
		//cres = await cookieClient.get('/refresh_token')
		//expect(cres.data.access_token).not.toBeTruthy()
	//})
//});
