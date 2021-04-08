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
import waitingImage from './waiting_image'
import OAuth from './OAuth'
import {getAxiosClient} from './helpers'  

function Blank(props) {
	if (props.doLoginRedirect) {
		return <Redirect to={props.doLoginRedirect} />
	} else {
		return <b>Checking Login ....</b>
	}
}

export default  class LoginSystem extends Component {
    
    constructor(props) {
        super(props);
        this.timeout = null;
        this.refreshInterval = null;
        this.state={buttons: [], waiting: false};
        this.refreshTimeout = null
        this.startWaiting = props.startWaiting ? props.startWaiting : this.startWaiting.bind(this)
        this.stopWaiting = props.stopWaiting ? props.stopWaiting : this.stopWaiting.bind(this)
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
	     
     startWaiting() {
		 this.setState({waiting: true})
	 }
    
     stopWaiting() {
		 this.setState({waiting: false})
	 }


    render() {
		let that = this;
		// prevent leading slash in root links
		var linkBase = that.props.match && that.props.match.path ? ( that.props.match.path === "/" ? '' : that.props.match.path ) : ''
		 let callBackFunctions = Object.assign({},this.props,{
			//loginServer: this.props.loginServer,
            //logout : this.props.logout,
            //isLoggedIn : this.props.isLoggedIn,
            //saveUser : this.props.saveUser,
            //setUser:  this.props.setUser,
            //testIframeLogin:  this.props.testIframeLogin,
            //submitWarning : this.props.submitWarning,
            //user:this.props.user,
            //loginButtons: this.props.loginButtons,
            //useRefreshToken: this.props.useRefreshToken,
            //loadUser: this.props.loadUser,
            //logoutRedirect : this.props.logoutRedirect,
            //loginRedirect : this.props.loginRedirect,
            //allowedOrigins: this.props.allowedOrigins,
            //showCloseButton: this.props.showCloseButton,
            //pollAuthSuccess: this.props.pollAuthSuccess,
            //history: this.props.history,
            //match: this.props.match,
            //location: this.props.location,
            //hideButtons: this.props.hideButtons,
            //startPollLoginSuccess: this.props.startPollLoginSuccess,
            message: this.state.message,
            linkBase: linkBase,
            buttons: this.state.buttons,
            startWaiting: this.startWaiting,
            stopWaiting: this.stopWaiting
            
        });
        if (this.state.authRequest) {
			return <div className='pending-auth-request' ><Link to={`${linkBase}/auth`} className='btn btn-success'  >Pending Authentication Request</Link></div>
				
		} else {
            
            
            return (
				<div>
				{(this.props.waiting || this.state.waiting) && <div className="overlay" style={{zIndex:999, position:'fixed', top: 0, left:0, width:'100%', height:'100%', opacity: 0.5, backgroundColor:'grey'}} onClick={this.stopWaiting} ><img style={{position: 'fixed' ,top: '100px', left: '100px', width: '100px', height: '100px'}} src={waitingImage} /></div>}
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
						
						<Route  path={`${linkBase}/blank`} exact render={(props) => <Blank {...callBackFunctions} />}  /> 
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
