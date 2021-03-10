/* eslint-disable */ 
import React, { Component } from 'react';

export default class RegistrationConfirmation extends Component {
     
    componentDidMount() {
        let that = this
                      
      setTimeout(function() {
        if (this.props.showCloseButton) window.close()
      },8000)   
    }
    
    render() {
		 return  (
        <div className="registrationconfirmation" style={{textAlign:'left'}} >
			<h3>Thanks for Registering</h3>
			
			<div>
			To finish creating your account, check your email and open the confirmation link.
			</div>
        </div>
)

}


}
