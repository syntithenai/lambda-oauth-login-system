import React from 'react';
import {HashRouter as  Router, Route, Link  } from 'react-router-dom'
import {ExternalLogin} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
import Profile from './Profile'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require('axios');
 
function App(props) {
	let that = this
	var loginServer = (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer
	var loginServerURL = new URL(loginServer)			
					
	  return (
		 <ExternalLogin  
				loginServer={loginServer}
					
				>{(user,setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, doLogout, doLogin, doProfile,  authServer, authServerHostname) => {  
					let callBackFunctions = {
						user:user,
						setUser:  setUser,
						authServer: loginServerURL.pathname+'/api',
						authServerHostname: loginServerURL.origin,
					};
				
						 return  <React.Fragment>
					  
					  <Router>
						<NavbarComponent user={user} doLogin={doLogin} doLogout={doLogout} doProfile={doProfile} isLoggedIn={isLoggedIn}   />
					    <Route  path={`/profile`}  render={(props) => <Profile  {...callBackFunctions}  />}  />
						</Router>
					  </React.Fragment>
				}}
		 </ExternalLogin>         
	  );

}

export default App;
