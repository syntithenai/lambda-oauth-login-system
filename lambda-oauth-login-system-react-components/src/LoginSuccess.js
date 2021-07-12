/* global window */
import  React,{ Component } from 'react';
import {Redirect, Link} from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class LoginSuccess extends Component {
	
	constructor(props) {
		super(props)
		this.state = {}
	}
	
	componentDidMount() {
		let that = this
		// close this window after oauth flow (when there is a parent window)
		// parent window polls message poll_oauth_success and close this window when heard
		window.addEventListener("message", function(event) {
			//console.log(['login success message',event])
			//if (that.props.isLoggedIn) console.log(that.props.isLoggedIn())
			if (that.props.isLoggedIn()) {
				//console.log(['login success message is logged in',that.props.allowedOrigins,event.origin])
				if (that.props.allowedOrigins && that.props.allowedOrigins.indexOf(event.origin) !== -1) {  
					//console.log(['login success message allowed origin'])
					if (event.data && event.data.poll_oauth_success) {
						//console.log(['login success message poll auth'])
						event.source.postMessage({oauth_success: that.props.user},event.origin)
						window.close()
					} 
				}
			} 
		}, false); 
	}
	
	componentDidUpdate(props) {
		let that = this
		//if (props.userInitialised) {
			if (props && props.isLoggedIn()) {				
				// delay for next poll message
				setTimeout(function() {
				
					let authRequest = null
					try {
						authRequest = JSON.parse(localStorage.getItem('auth_request'))
					} catch (e) {
						//console.log(e)
					}
					console.log(authRequest)
					if (authRequest) {
						that.setState({redirect: '/authorize'})
					} else {
						that.setState({redirect: props.loginRedirect && props.loginRedirect.trim() ? props.loginRedirect : '/'})
					}		
			
					
					//that.setState({redirect: props.loginRedirect && props.loginRedirect.trim() ? props.loginRedirect : '/'})
				},1200)
			}
		//}
	}
 
    render() {
		if (this.state.redirect && this.state.redirect.length > 0) {
			//return <div>{this.state.redirect} </div> 
			return <Redirect to={this.state.redirect} />
		} else {
			return <b>Checking Login</b>
		}
	}
}

