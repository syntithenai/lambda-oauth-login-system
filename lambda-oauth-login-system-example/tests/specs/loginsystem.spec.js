
/**
 * Generated by https://github.com/dsheiko/puppetry
 * on Wed Jun 23 2021 22:16:39 GMT+1000 (Australian Eastern Standard Time)
 * Suite: forgot password
 * 
 *
 */
// for logging
const path = require('path')
require('dotenv').config()

// Manually integrate server and mongoose
const config = require('../test-config')
const fse = require('fs-extra');

var startServices = require('../start-services')
var services = null

var nVer = process.version.match( /^v(\d+)/ );
if ( !nVer || nVer[ 1 ] < 9 ) {
  console.error( "WARNING: You have an outdated Node.js version " + process.version
    + ". You need at least v.9.x to run this test suite." );
}


const {
        bs, util, fetch, localStorage
      } = require( "../lib/bootstrap" )( "forgot--password" ),
      puppeteerOptions = require( "../puppeteer.config.json" ),
      devices = require( "puppeteer" ).devices;




jest.setTimeout( 50000 );

let consoleLog = [], // assetConsoleMessage
    dialogLog = []; // assertDialog;

bs.TARGETS = {};

// Environment variables
//let ENV = {
  //"BASE_URL": baseUrl,
//};

bs.TARGETS[ "BUTTON_CLASS_BTN_BTN_SUCCESS" ] = async () => await bs.query( "/html[1]/body[1]/div[1]/div[1]/nav[1]/div[1]/a[1]/button[1]", false, "BUTTON_CLASS_BTN_BTN_SUCCESS" );
bs.TARGETS[ "BUTTON_CLASS_BTN_BTN_LG_BTN_SUCCESS_BTN_BLOCK" ] = async () => await bs.query( "/html[1]/body[1]/div[1]/div[1]/div[2]/div[1]/div[1]/form[1]/button[1]", false, "BUTTON_CLASS_BTN_BTN_LG_BTN_SUCCESS_BTN_BLOCK" );
bs.TARGETS[ "BUTTON_ID_SEND_RECOVERY_BUTTON" ] = async () => await bs.query( "#send_recovery_button", true, "BUTTON_ID_SEND_RECOVERY_BUTTON" );


// FORGOT
bs.TARGETS[ "NAV_FORGOT_BUTTON" ] = async () => await bs.query( "#nav_forgot_button", true, "NAV_FORGOT_BUTTON" );
bs.TARGETS[ "SEND_FORGOT_BUTTON" ] = async () => await bs.query( "#send_recovery_button", true, "SEND_FORGOT_BUTTON" );

// REGISTER
bs.TARGETS[ "NAV_LOGIN_BUTTON" ] = async () => await bs.query( "#nav_login_button", true, "NAV_LOGIN_BUTTON" );
bs.TARGETS[ "NAV_REGISTER_BUTTON" ] = async () => await bs.query( "#nav_register_button", true, "NAV_REGISTER_BUTTON" );
bs.TARGETS[ "INPUT_ID_NAME" ] = async () => await bs.query( "#name", true, "INPUT_ID_NAME" );
bs.TARGETS[ "INPUT_ID_AVATAR" ] = async () => await bs.query( "#avatar", true, "INPUT_ID_AVATAR" );
bs.TARGETS[ "INPUT_ID_EMAIL" ] = async () => await bs.query( "#email", true, "INPUT_ID_EMAIL" );
bs.TARGETS[ "INPUT_ID_INPUTEMAIL" ] = async () => await bs.query( "#email", true, "INPUT_ID_INPUTEMAIL" );
bs.TARGETS[ "INPUT_ID_PASSWORD" ] = async () => await bs.query( "#password", true, "INPUT_ID_PASSWORD" );
bs.TARGETS[ "INPUT_ID_PASSWORD2" ] = async () => await bs.query( "#password2", true, "INPUT_ID_PASSWORD2" );
bs.TARGETS[ "REGISTER_BUTTON" ] = async () => await bs.query( "#register_button", true, "REGISTER_BUTTON" );
bs.TARGETS[ "REGISTRATION_CONFIRMATION" ] = async () => await bs.query( "#registrationform .registrationconfirmation", true, "REGISTRATION_CONFIRMATION" );

// LOGIN
bs.TARGETS[ "INPUT_LOGIN_INPUTEMAIL" ] = async () => await bs.query( "#inputEmail", true, "INPUT_LOGIN_INPUTEMAIL" );
bs.TARGETS[ "INPUT_LOGIN_INPUTPASSWORD" ] = async () => await bs.query( "#inputPassword", true, "INPUT_LOGIN_INPUTPASSWORD" );
bs.TARGETS[ "SIGNIN_BUTTON" ] = async () => await bs.query( "#register_button", true, "SIGNIN_BUTTON" );
bs.TARGETS[ "LOGOUT_BUTTON" ] = async () => await bs.query( "#nav_logout_button", true, "LOGOUT_BUTTON" );

function createClients(config, database) {
	//console.log(['CREATE AUTH CLIENTS',config.oauthClients])
	return new Promise(function(resolve,reject) {
		database.OAuthClient.deleteMany().then(function() {
			var promises = []
			if (Array.isArray(config.oauthClients)) {
				config.oauthClients.forEach(function(clientConfig) {
					//console.log(['CREATE AUTH CLIENT',clientConfig.clientId])
					database.OAuthClient.findOne({clientId: clientConfig.clientId}).then(function(result) {
						let clientFields = 	{
							clientId: clientConfig.clientId, 
							clientSecret:clientConfig.clientSecret,
							clientName:clientConfig.clientName,
							clientBy:clientConfig.clientBy,
							website_url:clientConfig.clientWebsite,
							redirectUris:clientConfig.redirectUris,
							clientImage:clientConfig.clientImage
						};
						//console.log(clientFields)
						if (result!= null) {
							// OK
							console.log('CREATE push update');
							promises.push(database.OAuthClient.update({clientId:clientConfig.clientId},clientFields))
						} else {
							console.log('CREATE push save');
							let client = new database.OAuthClient(clientFields);
							promises.push(client.save())
						}
						Promise.all(promises).then(function(res) {
							//console.log(['CREATED AUTH CLIENTS',res])
							database.OAuthClient.find({}).then(function(foundClients) {
								console.log(['CREATED AUTH CLIENTS found',foundClients])
								resolve()
							})
						})
					}).catch(function(e) {
						//console.log('CREATE AUTH ERR');
						console.log(e);
						resolve()
					}) 
				})
			}
		})
	})
}


describe( "forgot password", () => {

	beforeAll(async () => {
		services = await startServices()	


		// puppeteer
		await bs.setup( puppeteerOptions, {"allure":false});
		await util.once(async () => {
		  bs.browser && console.log( "BROWSER: ", await bs.browser.version() );
		  await util.savePuppetterInfo( bs );
		});

		bs.page.on( "console", ( message ) => consoleLog.push( message ) );
		bs.page.on( "dialog", ( dialog ) => dialogLog.push( dialog ) );

	});

	afterAll(async () => {
		await services.teardown()
		await bs.teardown();
	});

//	afterEach(async () => services ? await services.dbHandler.clearDatabase() : null);

	beforeEach(async () => {
		await services.dbHandler.clearDatabase()
		await createClients(config,services.database)
		var clients =await services.database.OAuthClient.find({})
		console.log(['CLIENTs',clients])
		//console.log(['CREATE CLIENT',config.oauthClients[0]])
		//var clients = await services.database.OAuthClient.deleteMany({})
		//var clientConfig = config.oauthClients[0]
		//var client = new services.database.OAuthClient({
			//clientId: clientConfig.clientId, 
			//clientSecret:clientConfig.clientSecret,
			//name:clientConfig.name,
			//clientName:clientConfig.name,
			//by:clientConfig.by,
			//website_url:clientConfig.clientWebsite,
			//privacy_url:clientConfig.clientPrivacyPage,
			//redirectUris:Array.isArray(clientConfig.redirectUris) ? clientConfig.redirectUris : [],
			//image:''
		//})
		//await client.save()
	})
	
	async function signupAndConfirmUser(bs,services,name,email,password) {
		await bs.page.goto( services.exampleBaseUrl, {"timeout":30000,"waitUntil":"domcontentloaded"} );
		await bs.page.waitForSelector( "#nav_login_button" );
		await ( await bs.getTarget( "NAV_LOGIN_BUTTON" ) ).click( {"button":"left"} );
		await ( await bs.getTarget( "NAV_REGISTER_BUTTON" ) ).click( {"button":"left","clickCount":1,"delay":0} );
		await bs.page.waitForSelector( "#name" );
		await ( await bs.getTarget( "INPUT_ID_NAME" ) ).type( name );
		await bs.page.waitForSelector( "#email" );
		await ( await bs.getTarget( "INPUT_ID_EMAIL" ) ).type( email );
		await bs.page.waitForSelector( "#password" );
		await ( await bs.getTarget( "INPUT_ID_PASSWORD" ) ).type( password );
		await bs.page.waitForSelector( "#password2" );
		await ( await bs.getTarget( "INPUT_ID_PASSWORD2" ) ).type( password);
		await bs.page.waitForSelector( "#register_button" );
		await bs.page.$eval('#register_button', elem => elem.click());
		await bs.page.waitForSelector( "#registrationform .registrationconfirmation" );
		// check user in db
		var res = await services.database.User.findOne({username: email})
		expect(res.signup_token).toBeTruthy()
		expect(parseInt(res.signup_token_timestamp)).toBeGreaterThan(0)
		// do confirmation
		//await bs.page.goto( 'https://localhost:5100/dev/login/#doconfirm?code='+res.signup_token, {"timeout":30000,"waitUntil":"domcontentloaded"} );
		//await bs.page.screenshot({
			//path: "./confirm.jpg",
			//type: "jpeg",
			//fullPage: true
		  //});
		//console.log('https://localhost:5100/dev/login/api/doconfirm?code='+res.signup_token)
		//await bs.page.waitForSelector( "#NEVER")
		const axios = services.getAxiosClient('https://localhost:5101','https://localhost:5101')
		var rres = await axios.get('https://localhost:5100/dev/login/api/doconfirm?code='+res.signup_token)
		//console.log(rres)
		expect(rres.data.user.token.access_token).toBeTruthy()
		return rres.data
		//await bs.page.goto( services.exampleBaseUrl+'#doconfirm?code=' + res.signup_token, {"timeout":30000,"waitUntil":"domcontentloaded"} );

		 //await bs.page.waitForSelector( "#nav_logout_button" );
		//return null
	}
	
	async function logoutUser(bs,services) {
		await bs.page.goto( services.exampleBaseUrl, {"timeout":30000,"waitUntil":"domcontentloaded"} );
		await bs.page.waitForSelector( "#nav_login_button" );
		await ( await bs.getTarget( "NAV_LOGOUT_BUTTON" ) ).click( {"button":"left"} );
		
	}
	
	async function loginUser(bs,services,email,password) {
		await bs.page.goto( services.exampleBaseUrl, {"timeout":30000,"waitUntil":"domcontentloaded"} );
		await bs.page.waitForSelector( "#nav_login_button" );
		await ( await bs.getTarget( "NAV_LOGIN_BUTTON" ) ).click( {"button":"left"} );
		await bs.page.waitForSelector( "#inputEmail" );
		await ( await bs.getTarget( "INPUT_LOGIN_INPUTEMAIL" ) ).type( email );
		await bs.page.waitForSelector( "#inputPassword" );
		await ( await bs.getTarget( "INPUT_LOGIN_INPUTPASSWORD" ) ).type( password );
		
		await bs.page.waitForSelector( "#signin_button" );
		await bs.page.$eval('#signin_button', elem => elem.click());
		await bs.page.waitForSelector( "#nav_profile_button" );
		
	}
	
	async function forgotPassword(bs,services,email,newPassword) {
		await bs.page.goto( services.exampleBaseUrl, {"timeout":30000,"waitUntil":"domcontentloaded"} );
		await bs.page.waitForSelector( "#nav_login_button" );
		await ( await bs.getTarget( "NAV_LOGIN_BUTTON" ) ).click( {"button":"left"} );
		await ( await bs.getTarget( "NAV_FORGOT_BUTTON" ) ).click( {"button":"left","clickCount":1,"delay":0} );
		await bs.page.waitForSelector( "#email" );
		await ( await bs.getTarget( "INPUT_ID_EMAIL" ) ).type( email );
		await bs.page.waitForSelector( "#password" );
		await ( await bs.getTarget( "INPUT_ID_PASSWORD" ) ).type( newPassword );
		await bs.page.waitForSelector( "#password2" );
		await ( await bs.getTarget( "INPUT_ID_PASSWORD2" ) ).type( newPassword);
		await bs.page.waitForSelector( "#send_recovery_button" );
		await bs.page.$eval('#send_recovery_button', elem => elem.click());
		await bs.page.waitForSelector( "#resend_recovery_button" );
		// check user in db
		var res = await services.database.User.findOne({username: email})
		expect(res.recover_password_token).toBeTruthy()
		expect(parseInt(res.recover_password_token_timestamp)).toBeGreaterThan(0)
		// do confirmation
		const axios = services.getAxiosClient('https://localhost:5101','https://localhost:5101')
		var rres = await axios.get('https://localhost:5100/dev/login/api/dorecover?code=' + res.recover_password_token)
		var fres = await services.database.User.findOne({username: email})
		expect(fres.password).toBe(newPassword)
		return fres.data
	}
 
	describe( "login system e2e tests", () => {
		test( "can signup, login, forgot, login(updated pw), logout", async () => {
			bs.performance.reset();
			var data = await signupAndConfirmUser(bs,services,'Bill Micks','billym@syntithenai.com','aaa')
			//console.log(data)
			await loginUser(bs,services,'billym@syntithenai.com','aaa')
			await forgotPassword(bs,services,'billym@syntithenai.com','bbb')
			await loginUser(bs,services,'billym@syntithenai.com','bbb')
			await bs.page.waitForSelector( "#nav_logout_button" );
			await bs.page.$eval('#nav_logout_button', elem => elem.click());
			const exists = await bs.page.$eval('#nav_profile_button', () => true).catch(() => false)
			expect(exists).toBe(false)
		});

		test("can authorize an oauth client", async () => {
			bs.performance.reset();
			const userName = 'Fred '
			const userEmail = 'fred@syntithenai.com'
			const userPassword = 'aaa'
			var user = await signupAndConfirmUser(bs,services,userName,userEmail,userPassword)
			// logout
			//logoutUser(bs,services)
			// start authorize flow
			await bs.page.goto( services.exampleBaseUrl + "/#/login/authorize?state=jjj&redirect=https://localhost:5100/dev/login", {"timeout":30000,"waitUntil":"domcontentloaded"} );
			await bs.page.setViewport({ width: 1024, height: 800 });
			// login
			await bs.page.waitForSelector( "#inputEmail" );
			await ( await bs.getTarget( "INPUT_LOGIN_INPUTEMAIL" ) ).type( userEmail );
			await bs.page.waitForSelector( "#inputPassword" );
			await ( await bs.getTarget( "INPUT_LOGIN_INPUTPASSWORD" ) ).type( userPassword );
			await bs.page.waitForSelector( "#signin_button" );
			await bs.page.$eval('#signin_button', elem => elem.click());
			// accept sharing details
			await bs.page.waitForSelector( "#accept_oauth_button" );
			await bs.page.$eval("#accept_oauth_button", elem => elem.click());
			var url = await bs.page.url()
			var urlParts = url.split("?")
			var searchString = urlParts.length > 1 ? urlParts[1] : ''
			var searchParts = searchString.split("&")
		    let paramsObject = {};
			searchParts.map(function(keyAndData) {
				let parts = keyAndData.split("=");
				if (parts.length === 2) {
					paramsObject[parts[0]] = parts[1]
				}
				return null;
			})
			// expect code and state in URL
			expect(paramsObject['code']).toBeTruthy()
			expect(paramsObject['state'].slice(0,3)).toBe('jjj')
			
			// now ask for token
			 var tokenParams = {
				grant_type: 'authorization_code',
				code: paramsObject['code'],
				redirect_uri: 'https://localhost:5100/dev/login',
				client_id: 'test',
				client_secret: 'testpass',
			}
			const params = new URLSearchParams();
			Object.keys(tokenParams).forEach(function(key) {
				params.append(key, tokenParams[key]);
			})
			const axios = services.getAxiosClient('https://localhost:5101',null,null,null,'application/x-www-form-urlencoded;charset=UTF-8')
			var rres = await axios.post('https://localhost:5100/dev/login/api/token',params)
			expect(rres.data.access_token).toBeTruthy()
			
			//var data = await signupAndConfirmUser(bs,services,'Bill Micks','billym@syntithenai.com','aaa')
			////console.log(data)
			//await loginUser(bs,services,'billym@syntithenai.com','aaa')
			//await forgotPassword(bs,services,'billym@syntithenai.com','bbb')
			//await loginUser(bs,services,'billym@syntithenai.com','bbb')
			//await bs.page.waitForSelector( "#nav_logout_button" );
			//await bs.page.$eval('#nav_logout_button', elem => elem.click());
			//const exists = await bs.page.$eval('#nav_profile_button', () => true).catch(() => false)
			//expect(exists).toBe(false)
			//const ls = await bs.page.evaluate(() =>  Object.assign({}, window.localStorage));
			//await bs.page.goto( 'https://localhost:5100/dev/login', {"timeout":30000,"waitUntil":"domcontentloaded"} );
			//var urlN = await bs.page.url()
			//console.log(urlN)
			
			//var authRequest = await bs.page.evaluate(() => window.localStorage.getItem("pending_auth_request"));
			//var authRequestOld = await bs.page.evaluate(() => localStorage.getItem("auth_request"));
			//console.log(ls)
			//console.log(authRequest)
			// console.log(authRequestOld)
		});

	  });
});
