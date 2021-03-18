import React from 'react';
import {HashRouter as  Router, Route, Link  , Switch} from 'react-router-dom'
import {ExternalLogin, LoginSystem} from 'lambda-oauth-login-system-react-components'
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
				loginRedirect={'/loggedin'}	
				logoutRedirect={'/'}
				buttons={['google','twitter','facebook','github','amazon']}
				>{(loginContext) => {
						 return  <React.Fragment>
					  
					  <Router >
					    <NavbarComponent user={loginContext.user}  isLoggedIn={loginContext.isLoggedIn}   />
					    <Switch>
							<Route  path={`/login`}  render={(props) => <LoginSystem  {...loginContext} hideButtons={true}  match={props.match}  history={props.history}  location={props.location}  />}  />
							<Route  path={`/loggedin`} component={function(props) {return <b>{loginContext.isLoggedIn() && <b>Logged dddIn{JSON.stringify(loginContext.user)}</b>}{!loginContext.isLoggedIn() && <b>NOT Logged In</b>}</b>   }} />
						</Switch>
						</Router>
					  </React.Fragment>
				}}
		 </ExternalLogin>         
	  );

}

export default App;
