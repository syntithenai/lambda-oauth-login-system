/**
 * This module integrates environment variables, derived values and sensible defaults 
 * into a configuration structure for the login system
 */

require('dotenv').config()
const fs = require('fs')

// disable ssl checks for localhost
if (process.env.IS_OFFLINE === 'true') {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}
//console.log(process.env)
function getGatewayUrl() {
	if (process.env.IS_OFFLINE !== 'true') {
		return process.env.LAMBDA_REST_GATEWAY 
	// offline mode
	} else {
		return process.env.LAMBDA_REST_GATEWAY_OFFLINE
	}
}


// map environment variables into configuration for login system
module.exports = {
   sessionSalt: process.env.sessionSalt && process.env.sessionSalt.trim() ? process.env.sessionSalt : 'this is a new session salt value',
   // md5 hash passwords before storing in database
   encryptedPasswords: process.env.encryptedPasswords && process.env.encryptedPasswords.toUpperCase() === "TRUE" ? true : false ,
   csrfCheck: process.env.csrfCheck && process.env.csrfCheck.toUpperCase() === "TRUE" ? true : false ,
   // server routes only
   userFields:process.env.userFields ? process.env.userFields : ['name','username','avatar'],
    // jwt
    jwtIssuer: process.env.jwtIssuer ,
    jwtAccessTokenSecret: process.env.jwtAccessTokenSecret ,
    jwtRefreshTokenSecret: process.env.jwtRefreshTokenSecret,
    jwtAccessTokenExpirySeconds: process.env.jwtAccessTokenExpirySeconds,
    jwtRefreshTokenExpirySeconds: process.env.jwtRefreshTokenExpirySeconds,
    
   // ensure that your mongo database has a user with read/write access defined in the database that you want to use. DO NOT USE ROOT DB CREDENTIALS
   databaseConnection: process.env.IS_OFFLINE ? process.env.databaseConnection_OFFLINE : process.env.databaseConnection,
   allowedOrigins: process.env.allowedOrigins && process.env.allowedOrigins.trim() ? process.env.allowedOrigins : '',
   lambdaUrl:"/login",
   authServer: getGatewayUrl()+'/login/api',
   loginServer: getGatewayUrl()+'/login',

  // oauth login redirect
   loginSuccessRedirect: getGatewayUrl()+'/login#/success',
   loginFailRedirect: getGatewayUrl()+'/login',
   // LOGIN CLIENT KEYS AND SECRETS
   googleClientId: process.env.googleClientId,
   googleClientSecret: process.env.googleClientSecret,
   twitterConsumerKey:process.env.twitterConsumerKey,
   twitterConsumerSecret:process.env.twitterConsumerSecret,
   facebookAppId: process.env.facebookAppId,
   facebookAppSecret: process.env.facebookAppSecret,
   githubClientId: process.env.githubClientId,
   githubClientSecret: process.env.githubClientSecret,
   amazonClientId: process.env.amazonClientId,
   amazonClientSecret: process.env.amazonClientSecret,

   
   // local oauth server
   // todo allow for many clients - alexa, google, local... FORNOW create extra records
   clientId:process.env.clientId,
   clientSecret:process.env.clientSecret,
   clientName:process.env.clientName,
   clientWebsite:process.env.clientWebsite,
   clientPrivacyPage:process.env.clientPrivacyPage,
   clientImage:process.env.clientImage,
   
   // EMAIL
    mailFrom:process.env.mailFrom,
    sendGridApiKey: process.env.sendGridApiKey,
    mailRegisterTopic: process.env.mailRegisterTopic,
    mailForgotPasswordSubject: process.env.mailForgotPasswordSubject,
    recoveryEmailTemplate: process.env.recoveryEmailTemplate, 
    signupEmailTemplate: process.env.signupEmailTemplate
}

