/* global window */
import  React,{ Component } from 'react';
import {Redirect, Link} from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class Logout extends Component {
  
    componentDidMount() {
        let that = this
        setTimeout(function() {
        //console.log(['LOGOUT'])
            if (that.props.user && that.props.user.token && that.props.user.token.access_token) { 
                //console.log(['LOGOUT USER'])
                that.props.logout(that.props.user.token.access_token).then(function() {
                    //console.log(['DONE LOGOUT'])
                      var standalone = (that.props.allowedOrigins && that.props.allowedOrigins.length > 0) ? true : false
                      //console.log(['LOGOUT SA ',standalone])
                      // wait long enough for postMessage polling before closing window
                      setTimeout(function() {
                        if (standalone) window.close()
                      },1000)
                })
                
            }
        },1500)
    }; 
    
 
    render() {
        //if (this.props.logoutRedirect)  {
           ////window.location=this.props.logoutRedirect
        //} 
        return <div style={{width:'100%', textAlign:'center', paddingTop:'1em'}} ><b>Logging Out ....</b><br/></div>
       
    };
}
//<Link to='../login' ><button className="btn btn-lg btn-success btn-block" type="submit">Login</button></Link>
