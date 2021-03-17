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
			//if (that.props.isLoggedIn) console.log(that.props.isLoggedIn())
			if (that.props.isLoggedIn()) {
				if (that.props.allowedOrigins && that.props.allowedOrigins.indexOf(event.origin) !== -1) {  
					if (event.data && event.data.poll_oauth_success) {
						event.source.postMessage({oauth_success: that.props.user},event.origin)
						window.close()
					} 
				}
			} 
		}, false); 
	}
	
	componentDidUpdate(props) {
		let that = this
		if (props && props.isLoggedIn()) {
			setTimeout(function() {
				that.setState({redirect: props.loginRedirect && props.loginRedirect.trim() ? props.loginRedirect : '/'})
			},1000)
		}
	}
 
    render() {
		if (this.state.redirect && this.state.redirect.length > 0) {
			return <Redirect to={this.state.redirect} />
		} else {
			return <b>Checking Login</b>
		}
		//
    };
}

