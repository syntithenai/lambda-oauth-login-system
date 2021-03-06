/* eslint-disable */ 
import React, { Component } from 'react';

export default class RegistrationConfirmation extends Component {
     
    componentDidMount() {
        let that = this
        var standalone = (that.props.allowedOrigins && that.props.allowedOrigins.length > 0) ? true : false
                      
      setTimeout(function() {
        if (standalone) window.close()
      },5000)   
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
