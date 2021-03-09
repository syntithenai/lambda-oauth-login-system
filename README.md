# Lambda Open Auth Login System

This repository provides a web based login system that can be deployed to AWS Lambda.

The login system provides a complete Open Auth system supporting social login.

The system relies on a mongo database to persist user and token data.

The system delivers JWT tokens for authentication without a call back to the central service.

Included are
- react package with components for the login system and using the login system from another domain.
- client folder which is the web UI
- api folder containing serverless deployment artifacts and api routes for login and open auth.
- example independant serverless app/service integrating login system on a different domain (cross window messaging)




## Quickstart Localhost

### Prep - Start Mongo
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

### Prep: Sendgrid

Head over to sendgrid.com and sign up for a free account.
Create a validated user and an api key.


### Start a local webserver
```
cd api
# copy .env.sample to .env and update configuration. databaseConnection string and sendgrid api key are required

sls offline
# open https://localhost:5000/dev/login in your browser
```

To update the UI 
```
cd client
npm run build
```

To deploy to AWS  (assuming you have aws credentials configured with appropriate permissions)
```
cd api
sls deploy
```


## Integration 

1. The easiest way to create a web application that uses the login system is to use this repository as a template for your app and make 
your changes to the client and api handler. 

In this case you have access to the properties provided by the LoginSystemContext including
- user  data (including token)
- helpers including getAxiosClient (to add auth headers), getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, useRefreshToken, logout

Note that the HashRouter is required to work as a single lambda endpoint.


2. The custom web application runs independantly as a different lambda function or even as a seperate service on a different port and uses serverless outputs to make the lambda gateway url available from the login system.
This approach guarantees the login system is independant of any software changes to the main application.
It can also be used to provide unified login across a collection of domains.

The REST url for the login system is also written to stack.json when the application is deployed. 
This can be useful to dynamically provide the login url to a custom web application is served from somewhere else, 

To make the login work cross domain, popup windows are used for openauth flows and login refresh.

The login system is configured with allowedOrigins which is used for restrictions on the 
window postMessage used to pass the login token back to the main window.

In this case you can import the ExternalLogin component which provides
- user  data (including token)
- doLogin, doProfile, doLogout (using popup windows)
- helpers including getAxiosClient (to add auth headers), getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, useRefreshToken, logout


# Social Login
When creating keys and secrets for the various social login services, it is required to set one or many authorized redirects which are 
set to the rest url of the lambda function plus a subpath to the callback.
See the .env file for links to get keys for the social services.

eg ```https://ki3hmdq3uh.execute-api.us-east-1.amazonaws.com/dev/login/api/googlecallback```

or for localhost
```https://localhost:5000/dev/login/api/googlecallback```
