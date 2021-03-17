/* global document */

import React, { Component } from 'react';
import {HashRouter as Router,Route,Link,Redirect, Switch} from 'react-router-dom'
import Logout from './Logout'
import Profile from './Profile'
import Login from './Login'
import LoginSuccess from './LoginSuccess'
import Register from './Register'
import DoConfirm from './DoConfirm'
import DoForgot from './DoForgot'
import TermsOfUse from './TermsOfUse'
import ForgotPassword from './ForgotPassword'
import RegistrationConfirmation from './RegistrationConfirmation'

import OAuth from './OAuth'
import {getAxiosClient} from './helpers'  

export default  class LoginSystem extends Component {
    
    constructor(props) {
        super(props);
        this.timeout = null;
        this.refreshInterval = null;
        this.state={message:null, buttons: []};
        // XHR
        this.submitWarning = this.submitWarning.bind(this);
        this.refreshTimeout = null
    };
	
	componentDidMount() {
		let that = this
		var client = getAxiosClient()
		if (Array.isArray(that.props.buttons)) {
			that.setState({buttons: that.props.buttons})
		} else {
			client.get(that.props.loginServer+'/api/buttons').then(function(res) {
				that.setState({buttons: res && res.data  && res.data.buttons ? res.data.buttons.split(",") : []  })
			})
		}
	}
	
    submitWarning(warning) {
        let that=this;
        clearTimeout(this.timeout);
        this.setState({'message':warning});
        this.timeout = setTimeout(function() {
            that.setState({'message':''});
        },6000);
    };
 
    render() {
		
		//console.log(this.props)
		let that = this;
		// prevent leading slash in root links
		var linkBase = that.props.match && that.props.match.path ? ( that.props.match.path === "/" ? '' : that.props.match.path ) : ''
		 let callBackFunctions = {
			loginServer: this.props.loginServer,
            logout : this.props.logout,
            isLoggedIn : this.props.isLoggedIn,
            saveUser : this.props.saveUser,
            setUser:  this.props.setUser,
            setIframeUser:  this.props.setIframeUser,
            submitWarning : this.submitWarning,
            user:this.props.user,
            message: this.state.message,
            loginButtons: this.props.loginButtons,
            useRefreshToken: this.props.useRefreshToken,
            loadUser: this.props.loadUser,
            logoutRedirect : this.props.logoutRedirect,
            loginRedirect : this.props.loginRedirect,
            allowedOrigins: this.props.allowedOrigins,
            showCloseButton: this.props.showCloseButton,
            pollAuthSuccess: this.props.pollAuthSuccess,
            history: this.props.history,
            match: this.props.match,
            location: this.props.location,
            linkBase: linkBase,
            hideButtons: this.props.hideButtons,
            buttons: this.state.buttons
        };
        if (this.state.authRequest) {
			return <div className='pending-auth-request' ><Link to={`${linkBase}/auth`} className='btn btn-success'  >Pending Authentication Request</Link></div>
				
		} else {
            
            
            return (
				<div>
                {this.state.message && <div className='warning-message' style={{zIndex:99,clear:'both', position:'fixed', top: 100, left:200, minWidth: '200 px', backgroundColor:'pink', border:'2px solid red', padding: '1em',  borderRadius:'10px', fontWeight: 'bold', fontSize:'1.1em'}} >{this.state.message}</div>}
          
                <Router>
                    <Switch>
						<Route  path={`${linkBase}/`} exact render={(props) => <Login {...callBackFunctions} isRoot={true}   />}  />
						<Route  path={`${linkBase}/profile`}  render={(props) => <Profile  {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/login`}  render={(props) => <Login {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/register`}  render={(props) => <Register {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/registerconfirm`}  render={(props) => <RegistrationConfirmation {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/logout`}  render={(props) => <Logout {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/oauth`}  render={(props) => <OAuth {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/forgot`}  render={(props) => <ForgotPassword {...callBackFunctions}   />}  />
						<Route  path={`${linkBase}/privacy`}  render={(props) => <TermsOfUse {...callBackFunctions}   />}  />
						
						<Route  path={`${linkBase}/blank`} exact render={(props) => <b>Checking Login ....</b>}  /> 
						<Route  path={`${linkBase}/success`} render={(props) => <LoginSuccess {...callBackFunctions}   />}   /> 
						<Route  path={`${linkBase}/doconfirm`} render={(props) => <DoConfirm  {...callBackFunctions}   />}   /> 
						<Route  path={`${linkBase}/dorecover`} render={(props) => <DoForgot {...callBackFunctions}   />}   /> 
                    </Switch>
                </Router>    
                </div>
            )
         }
    };
}
