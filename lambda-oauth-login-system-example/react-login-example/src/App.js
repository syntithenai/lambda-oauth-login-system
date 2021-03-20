import React from 'react';
import {HashRouter as  Router, Route  , Switch} from 'react-router-dom'
import {ExternalLogin, LoginSystem} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(props) {
	var loginServer = (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer
	return (
		 <ExternalLogin  
				loginServer={loginServer}
				loginRedirect={'/loggedin'}	
				logoutRedirect={'/'}
				buttons={['google','twitter','facebook','github','amazon']}
				refreshInterval={840000}
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
