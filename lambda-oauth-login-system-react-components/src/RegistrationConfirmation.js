/* eslint-disable */ 
import React, { Component } from 'react';

export default class RegistrationConfirmation extends Component {
     
    componentDidMount() {
        let that = this
                      
      setTimeout(function() {
        if (that.props.showCloseButton) window.close()
      },8000)   
    }
    
    render() {
		 return  (
        <div className="registrationconfirmation" style={{textAlign:'left'}} >
			  {window.opener && <button  id="close_button" className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
                         Close</button>}
            <h3>Thanks for Registering</h3>
			
			<div>
			To finish creating your account, check your email and open the confirmation link. 
			<br/><br/>If the email confirming your registration doesn't arrive, please check your SPAM folder.
			</div>
			
        </div>
)

}


}
