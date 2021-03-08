import React, { Component } from 'react'
import {Button} from 'react-bootstrap'

export default function ExternalLoginButtons(props) {
	return <React.Fragment>
		{props.isLoggedIn() && 
			<span>
				<Button style={{float:'right'}} variant="primary" onClick={props.doProfile} >{'Profile'}</Button>
				<Button  style={{float:'right'}} variant="danger" onClick={props.doLogout}  >{'Logout'}</Button>
			</span>
		}
		{ !props.isLoggedIn() && 
			<Button  style={{float:'right'}}  variant="success" onClick={props.doLogin} >{'Login'}</Button>
		}
		</React.Fragment>
}
