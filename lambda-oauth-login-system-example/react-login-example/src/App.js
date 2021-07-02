/* global window */
import React,{useState, useEffect} from 'react';
import {HashRouter as  Router, Route  , Switch, Link} from 'react-router-dom'
import {ExternalLogin, LoginSystem, waitingImage} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Badge} from 'react-bootstrap'
import {getAxiosClient, getDistinct,analyticsEvent, addLeadingZeros} from './helpers'  

const LOGIN_SERVER = '###MARKER_loginServer###'

function App(props) {
	 var markerReplaced = (LOGIN_SERVER !== '###MARKER'.concat('_loginServer###'))
	 var loginServer = LOGIN_SERVER 
	 if (loginServer == '' || !markerReplaced) {
		loginServer = process.env.REACT_APP_LOGIN
	 }
	
	 //(process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer
	 const [waiting,setWaiting] = useState(false)
	 const [queueActive,setQueueActive] = useState(false)
	 const [itemsQueued, setItemsQueued] = useState(false)
     var axiosClient = getAxiosClient()
    
	// notifications from nested components
	 function startWaiting() {
		  setWaiting(true)
	  }
	  function stopWaiting() {
		  setWaiting(false)
	  }
	  
	  
	 function onLogin(user) {
		  console.log('APLOGIN')
		  if (user && user._id && user.token) {
			  axiosClient = getAxiosClient(user.token.access_token)
		  } else {
			  axiosClient = getAxiosClient()
		  }
	  }
	  
	  function onLogout() {
		  console.log('APLOGOUT')
	  }
	 
	 
	 const appProps = {
		axiosClient: axiosClient,
		startWaiting: startWaiting,
		stopWaiting: stopWaiting,
	 } 
	 return (
		 <ExternalLogin  
				onLogin={onLogin}
				onLogout={onLogout}
				loginServer={loginServer}
				buttons={['google','twitter','facebook','github','amazon']}
				refreshInterval={6000000}
				startWaiting={startWaiting} stopWaiting={stopWaiting}
				>{(loginContext) => {
				return  <Router > 
							
					{(waiting) && <div className="overlay" style={{zIndex:999, position:'fixed', top: 0, left:0, width:'100%', height:'100%', opacity: 0.5, backgroundColor:'grey'}} onClick={stopWaiting} ><img alt="waiting" style={{position: 'fixed' ,top: '100px', left: '100px', width: '100px', height: '100px'}} src={waitingImage} onClick={stopWaiting} /></div>}
					
					<div style={{height:'4em'}}>&nbsp;</div>
						   
					<NavbarComponent loginCheckActive={loginContext.loginCheckActive}   user={loginContext.user} queueActive={queueActive} isLoggedIn={loginContext.isLoggedIn}  />
					 
					<Route  path={`/login`}   render={(props) => <LoginSystem  {...loginContext} hideButtons={true}  match={props.match}  history={props.history}  location={props.location}  />}  />
					
					<Route  path={`/`}  exact={true} render={(props) => <div><h1>Login System Test</h1></div>}  />
					 
					 
			    </Router>
					 
				}}
		 </ExternalLogin>         
	  );

}

export default App;
