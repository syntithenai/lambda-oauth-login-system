# Lambda Open Auth Login System

This repository provides a web based login system that can be deployed to AWS Lambda.

The login system provides a complete Open Auth implementation supporting social login.

The system relies on a mongo database to persist user and token data.

The system delivers JWT tokens for authentication without a call back to the central service.

Included are
- react package with components for using the login system.
- client folder which is the web UI
- api folder containing serverless deployment artifacts and api routes for login and open auth.
- example independant serverless app/service integrating login system on a different domain (cross window messaging)



## Quickstart Localhost

### Preparation

#### Sendgrid

Head over to sendgrid.com and sign up for a free account.
Create a validated user and an api key.


####  Start Mongo
To start a mongo database using docker
```
cd mongo
docker-compose up
```
The docker-compose suite includes an init script to create a loginsystem user.
If you are using another approach to starting mongo you will need to create the user
```
db.createUser({
  user: 'loginsystem',
  pwd: 'loginsystem',
  roles: [
    {
      role: 'readWrite',
      db: 'loginsystem'
    },
    {
      role: 'dbAdmin',
      db: 'loginsystem'
    },
  ]
})

```



### Update required configuration

Copy .env.sample to .env

Edit .env to update configuration. databaseConnection string and sendgrid api key are required.

If you are using client apps served from a different domain, you will need to provide allowedOrigins.

- CORS headers are added to restrict api access to allowedOrigins.
- Messages sent via postMessage must come from a domain included in allowedOrigins.

### Start a local webserver

```
cd api
npm i
sls offline
```

When the offline server has started, open https://localhost:5000/dev/login in your browser



### Update the login system web pages 
```
cd client
npm i
npm run build
```

### Deploy to AWS  (assuming you have aws credentials configured with appropriate permissions)
```
cd api
sls deploy
```

If you don't have credentials, you will be sent to the AWS management console to create an IAM user with appropriate credentials.


## Integration 

### Option 1 - Standalone Cross Domain

Deploy the login system as a standalone serverless app providing configuration of allowedOrigins for all the clients of the login system.

This approach guarantees the login system is independant of any software changes to the client application.

It can also be used to provide unified login across a collection of domains.

When the login system is deployed, the serverless output LAMBDARESTGATEWAY is set to the public URL of the login system. This information is also written to stack.json.

Web app clients that use the login system can import the ```ExternalLogin``` component from the npm package ```lambda-oauth-login-system-react-components``` and specify the property ```loginServer```

The ExternalLogin components uses cross domain postMessages to popup windows for login/oauth flows and an iframe for polling login status.

The ExternalLogin component provides properties to it's children including
- user  data (including token)
- doLogin, doProfile, doLogout (using popup windows)
- helpers including getAxiosClient (to add auth headers), getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, useRefreshToken, logout


#### Example

See the lambda-oauth-login-system-example for sample code.

To trial the sample application, first ensure that the login system offline server has been started (on port 5000)
```
cd lambda-oauth-login-system-example
sls offline
```
The sample application will be available at http://localhost:5001/dev/handler

The example detects the URL for the login system from the serverless output LAMBDARESTGATEWAY 
The handler function uses this value to replace markers in the statically built example react app.

#### Custom React App

Where using the login from outside the serverless context (eg a static react app hosted on github pages), you can provide the loginServer url using
the environment variable REACT_APP_LOGIN in the react build environment.


### Option 2 - Integrated Same Domain

1. Include the ```express-oauth-login-system-server``` routes into your application. See api/handler.js
2. Import and use the ```LoginSystem```, ```LoginSystemContext``` and other components from the npm package ```lambda-oauth-login-system-components```

In this case you have access to the properties provided by the LoginSystemContext including
- user  data (including token)
- helpers including getAxiosClient (to add auth headers), getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, useRefreshToken, logout

Note that the HashRouter is required to make a react app work as a single lambda endpoint.

With the current handler it is also necessary to use gulp to wrap the client code into a single index.html. 
An expanded handler could deal with serving an unbundled file system but would incur the cost of additional calls to the lambda function.

In a production setting, the client code should be deployed into a Content Delivery Network like AWS S3  or Github Pages and use a proxy or AWS Cloudfront to bring it together with the api 
under the same domain name. For more detail see https://www.serverless.com/plugins/fullstack-serverless


## Social Login

You will need to deploy your login system to AWS to create the url used as ```authorized redirects``` configuring social login services.

When creating keys and secrets for the various social login services, it is required to set one or many authorized redirects which are 
set to the rest url of the lambda function plus a subpath to the callback. Subpaths include googlecallback, facebookcallback, amazoncallback, githubcallback, twittercallback.

See the .env file for links to get keys for the social services.

eg ```https://ki3hmdq3uh.execute-api.us-east-1.amazonaws.com/dev/login/api/googlecallback```

or for localhost
```https://localhost:5000/dev/login/api/googlecallback```


## Authenticated Endpoints

In your client application, you will want to restrict access to some api endpoints based on user login.

Because the access token is a JWT token, any service with the crypto keys can decode and identify a user.

To support this in your api routes, 
- ```npm i express-oauth-login-system-server```
- in your lambda function
```
import 
```


## Technical Overview

The express-oauth-login-system is designed to be used mostly with ajax requests returning JSON.
In this way a client can use the login system on a different domain without the login system knowing about

There are a few special cases around oauth flows that are challenging.


### REST API endpoints

Returning JSON

- /saveuser
- /me
- /refresh_token
- / buttons
- /signup
- /signinajax
- /recover





