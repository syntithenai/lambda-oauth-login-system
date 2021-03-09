import React from 'react';
//import {useState, useEffect} from 'react';
import {HashRouter as  Router, Route, Link  } from 'react-router-dom'
//import NavbarComponent from './components/NavbarComponent'
//import {ExternalLogin}  from 'react-express-oauth-login-system-components'
import ExternalLogin from './ExternalLogin'
import NavbarComponent from './NavbarComponent'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require('axios');
 
function App() {
	
	//if (window.loginServer) {
		var loginUrl = new URL(window.loginServer)
		// allow for running react-login-example with npm start for live changes on save in local development
		if (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) {
			loginUrl = new URL(process.env.REACT_APP_LOGIN)
		}
		//var loginServerHostname = loginUrl ? loginUrl.origin : ''
		//var loginServerPath = loginUrl ? loginUrl.pathname + '/api' : ''
		//var authWeb = loginUrl ? loginUrl.pathname  : ''
		console.log(['ffffff',loginUrl])
	  //authServer={loginServerPath} 
					//authServerHostname={loginServerHostname} 
					//authWeb={authWeb}
	  return (
		 <ExternalLogin  
				loginServer={(process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer}
					
				>{(user,setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, doLogout, doLogin, doProfile,  authServer, authServerHostname) => {  
						 return  <React.Fragment>
					  <NavbarComponent user={user} doLogin={doLogin} doLogout={doLogout} doProfile={doProfile} isLoggedIn={isLoggedIn}   />
					  user:
					  {JSON.stringify(user)}</React.Fragment>
				}}
		 </ExternalLogin>         
	  );
	//} else {
		  //return <b>Invalid configuration missing login server</b>
	 //}
}

export default App;
