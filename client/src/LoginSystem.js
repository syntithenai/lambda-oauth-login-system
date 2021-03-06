/* global document */

import React, { Component } from 'react';
import {HashRouter as Router,Route,Link,Redirect} from 'react-router-dom'
import Logout from './Logout'
import Profile from './Profile'
import Login from './Login'
import Register from './Register'
import TermsOfUse from './TermsOfUse'
import ForgotPassword from './ForgotPassword'
import RegistrationConfirmation from './RegistrationConfirmation'

import OAuth from './OAuth'
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

export default  class LoginSystem extends Component {
    
    constructor(props) {
        super(props);
        this.timeout = null;
        this.refreshInterval = null;
        this.state={message:null};
        // XHR
        this.submitWarning = this.submitWarning.bind(this);
        this.refreshTimeout = null
    };
 
    submitWarning(warning) {
        let that=this;
        clearTimeout(this.timeout);
        this.setState({'message':warning});
        this.timeout = setTimeout(function() {
            that.setState({'message':''});
        },6000);
    };
 
    render() {
		let that = this;
        let callBackFunctions = {
            logout : this.props.logout,
            isLoggedIn : this.props.isLoggedIn,
            saveUser : this.props.saveUser,
            setUser:  this.props.setUser,
            submitWarning : this.submitWarning,
            user:this.props.user,
            message: this.state.message,
            authServer: this.props.authServer,
            authServerHostname: this.props.authServerHostname,
            loginButtons: this.props.loginButtons,
            useRefreshToken: this.props.useRefreshToken,
            loadUser: this.props.loadUser,
            logoutRedirect : this.props.logoutRedirect,
            allowedOrigins: this.props.allowedOrigins
        };
        if (this.state.authRequest) {
			return <div className='pending-auth-request' ><Link to={`${that.props.match.url}/auth`} className='btn btn-success'  >Pending Authentication Request</Link></div>
				
		} else {
            var match = that.props.match.path && that.props.match.path === "/" ? '' : that.props.match.path
            return (
				<div>
                {this.state.message && <div className='warning-message' style={{zIndex:99,clear:'both', position:'fixed', top: 50, left:200, minWidth: '200 px', backgroundColor:'pink', border:'2px solid red', padding: '1em',  borderRadius:'10px', fontWeight: 'bold', fontSize:'1.1em'}} >{this.state.message}</div>}
          
                <Router>
                    <Route  path={`${match}/profile`}  render={(props) => <Profile  {...callBackFunctions}  history={props.history} match={props.match} location={props.location} />}  />
                    <Route  path={`${match}/login`}  render={(props) => <Login {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/register`}  render={(props) => <Register {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/registerconfirm`}  render={(props) => <RegistrationConfirmation {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/logout`}  render={(props) => <Logout {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/oauth`}  render={(props) => <OAuth {...callBackFunctions}  history={props.history} match={props.match} location={props.location} />}  />
                    <Route  path={`${match}/forgot`}  render={(props) => <ForgotPassword {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/privacy`}  render={(props) => <TermsOfUse {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${match}/`} exact render={(props) => <Login {...callBackFunctions} isRoot={true} history={props.history} match={props.match} location={props.location}  />}  />
                   
                    <Route  path={`${match}/blank`} exact render={(props) => <b>Checking Login ....</b>}  /> 
                    
                </Router>    
                </div>
            )
         }
    };
}
