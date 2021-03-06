/* global window */
import  React,{ Component } from 'react';
import {Redirect, Link} from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class Logout extends Component {
  
    componentDidMount() {
        let that = this
        if (that.props.isLoggedIn()) this.props.logout(that.props.user.token.access_token)
        
    }; 
    
    componentDidUpdate(props) {
        let that = this
        if (props.isLoggedIn()) props.logout(props.user.token.access_token)
        
    }; 
    
    
 
    render() {
		if (this.props.isLoggedIn()) {
			return <div style={{width:'100%', textAlign:'center', paddingTop:'1em'}} >
			 {window.opener && <button id="close_button" className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
							 Close</button>}
			
			<b>Logging Out ....</b><br/></div>
		} else {
			return <Redirect to={this.props.logoutRedirect} />
		}
		   
    };
}
