import React, { Component } from 'react';
import './App.css';

import {LoginSystem,LoginSystemContext, getAxiosClient,getMediaQueryString,getCsrfQueryString} from 'lambda-oauth-login-system-react-components'


import {HashRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// web server uses marker replace to provide these values to React
const LOGIN_SERVER = '###MARKER_loginServer###'
const ALLOWED_ORIGINS = '###MARKER_allowedOrigins###'  

class App extends Component {
	
  constructor(props) {
	  super(props);
	  this.state = {waiting: false,list:[]};
      this.startWaiting = this.startWaiting.bind(this);
	  this.stopWaiting = this.stopWaiting.bind(this);
  }	
	


  startWaiting() {
	  this.setState({waiting:true})
  }
  
  stopWaiting() {
	  this.setState({waiting:false})
  }
   

	      
  render() {
    	
    	let that = this;
	    // if markers are not replaced, try use process.env.REACT_APP_LOGIN
	    var markerReplaced = (LOGIN_SERVER !== '###MARKER'.concat('_loginServer###'))
	    //console.log(['loog',markerReplaced,LOGIN_SERVER])
		
		var loginServer = LOGIN_SERVER 
		if (loginServer == '' || !markerReplaced) {
			loginServer = process.env.REACT_APP_LOGIN
		}
		
		//// if no allowedOrigins set, use loginServer origin
		//console.log(['LGOddIN',loginServer,LOGIN_SERVER, (LOGIN_SERVER != '###MARKER'+'_loginServer###'),process.env.REACT_APP_LOGIN])
		var allowedOrigins = ALLOWED_ORIGINS
		var amarkerReplaced = (ALLOWED_ORIGINS !== '###MARKER'.concat('_allowedOrigins###'))
	    try {
			var u = new URL(loginServer)
			if (allowedOrigins == '' || !amarkerReplaced) {
				allowedOrigins = u.origin
			}
		} catch (e) {
			console.log(e)
		}
	   //console.log(window.loginServer)
	   //console.log(process.env)
	   //var loginServer = (window.loginServer && window.loginServer.trim() && window.loginServer !== "###MARKER_loginServer###") ?  window.loginServer : (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : 'https://localhost:5000/dev/login'
	
      return (
      <div className="App">
            <LoginSystemContext  
				loginServer={loginServer}
				allowedOrigins={allowedOrigins}
				logoutRedirect={'/'}
			    loginRedirect={'/profile'}
			    buttons={['google','twitter','facebook','github','amazon']}
			    startWaiting={that.startWaiting} stopWaiting={that.stopWaiting} 
            >
            {(loginProps) => {
                  return  <React.Fragment>
                       {this.state.waiting && <div className="overlay" onClick={this.stopWaiting} >LOADING</div>}
                        <header className="App-header">
                           <Router>
                                <div style={{width:'70%'}}>
                                    <Route path='/'  render={
                                    (props) => <LoginSystem  
                                       {...loginProps}
                                       match={props.match}
                                       location={props.location}
                                       history={props.history}
                                       
                                     />}
                                     />
                                </div>
                           </Router>
                        </header>
                    </React.Fragment>
           
              
            }}
        </LoginSystemContext>
      </div>
    );
  }
}

export default App;
		  
          
