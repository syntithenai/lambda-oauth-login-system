function getGatewayUrl() {
	return 'http://localhost:5100'
}

module.exports = {
   sessionSalt:'this is a new session salt value',
   // md5 hash passwords before storing in database
   encryptedPasswords: false ,
   csrfCheck:  false ,
   // server routes only
   userFields : ['name','avatar','username'],
   allowedUsers:null,
    // jwt
    jwtIssuer: 'thedemo' ,
    jwtAccessTokenSecret: 'a random secret',
    jwtRefreshTokenSecret: 'another random secret',
    jwtAccessTokenExpirySeconds: 18000,
    jwtRefreshTokenExpirySeconds: 12096000,
  

   // ensure that your mongo database has a user with read/write access defined in the database that you want to use. DO NOT USE ROOT DB CREDENTIALS
   databaseConnection: '',
   allowedOrigins: 'https://localhost:5000,http://localhost:5100,http://localhost:3000,http://stever-gt62vr-6rd.local:3000',
   lambdaUrl:"/login",
   authServer: getGatewayUrl()+'/login/api',
   loginServer: getGatewayUrl()+'/login',

  // oauth login redirect
   loginSuccessRedirect: getGatewayUrl()+'/login#/success',
   loginFailRedirect: getGatewayUrl()+'/login',
   // LOGIN CLIENT KEYS AND SECRETS
   //googleClientId: process.env.googleClientId,
   //googleClientSecret: process.env.googleClientSecret,
   //twitterConsumerKey:process.env.twitterConsumerKey,
   //twitterConsumerSecret:process.env.twitterConsumerSecret,
   //facebookAppId: process.env.facebookAppId,
   //facebookAppSecret: process.env.facebookAppSecret,
   //githubClientId: process.env.githubClientId,
   //githubClientSecret: process.env.githubClientSecret,
   //amazonClientId: process.env.amazonClientId,
   //amazonClientSecret: process.env.amazonClientSecret,

   
   // local oauth server
   // todo allow for many clients - alexa, google, local... FORNOW create extra records
   clientId:'test',
   clientSecret:'testpass',
   clientName:'test client',
   clientWebsite:'http://localhost',
   clientPrivacyPage:'http://localhost',
   clientImage:'',
   
   googleClientId: 'aaa',
   googleClientSecret: 'aaa',
   twitterConsumerKey:'aaa',
   twitterConsumerSecret:'aaa',
   facebookAppId: 'aaa',
   facebookAppSecret: 'aaa',
   githubClientId: 'aaa',
   githubClientSecret: 'aaa',
   amazonClientId: 'aaa',
   amazonClientSecret: 'aaa',



   // EMAIL
    //mailFrom:process.env.mailFrom,
    //sendGridApiKey: process.env.sendGridApiKey,
    //mailRegisterTopic: process.env.mailRegisterTopic,
    //mailForgotPasswordSubject: process.env.mailForgotPasswordSubject,
    //recoveryEmailTemplate: process.env.recoveryEmailTemplate, 
    //signupEmailTemplate: process.env.signupEmailTemplate
}
