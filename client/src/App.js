import React, { Component } from 'react';
import './App.css';

import {LoginSystem,LoginSystemContext, getAxiosClient,getMediaQueryString,getCsrfQueryString} from 'lambda-oauth-login-system-react-components'


import {HashRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
	   //console.log(window.loginServer)
	   //console.log(process.env)
	   var loginServer = (window.loginServer && window.loginServer.trim() && window.loginServer !== "###MARKER_loginServer###") ?  window.loginServer : (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : 'https://localhost:5000/dev/login'
	
      return (
      <div className="App">
            <LoginSystemContext  
				loginServer={loginServer}
            >
            {(user,setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, isLoggedIn, loadUser, useRefreshToken, logout, loginServer, allowedOrigins) => {
                  return  <React.Fragment>
                       {this.state.waiting && <div className="overlay" onClick={this.stopWaiting} >LOADING</div>}
                        <header className="App-header">
                           <Router>
                                <div style={{width:'70%'}}>
                                    <Route path='/'  render={
                                    (props) => <LoginSystem  
                                       loginServer={loginServer}
                                       match={props.match}
                                       location={props.location}
                                       history={props.history}
                                       logoutRedirect={'/'}
                                       loginRedirect={'/profile'}
                                       buttons={['google','twitter','facebook','github','amazon']}
                                       user={user} setUser={setUser} isLoggedIn={isLoggedIn} logout={logout}  startWaiting={that.startWaiting} stopWaiting={that.stopWaiting} allowedOrigins={allowedOrigins}
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
		  
          
