/* edslint-disable */ 
/* global window */

import React, { Component } from 'react';
import {HashRouter as Router,Route,Link,Redirect} from 'react-router-dom'
import { ReactComponent as GoogleLogo } from './images/google-brands.svg';
import { ReactComponent as TwitterLogo } from './images/twitter-brands.svg';
import { ReactComponent as FacebookLogo } from './images/facebook-brands.svg';
import { ReactComponent as GithubLogo } from './images/github-brands.svg';
import { ReactComponent as AmazonLogo } from './images/amazon-brands.svg';
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

let brandImages={amazon: AmazonLogo, google:GoogleLogo,twitter:TwitterLogo,facebook:FacebookLogo,github:GithubLogo}

export default  class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state={signin_username:'',signin_password:'',rememberme:false, buttons: [] };
        this.change = this.change.bind(this);
    };
    
    componentDidMount() {
        let that = this
        if (window.location.search.indexOf('fail=true') !== -1) {
            this.props.submitWarning('Login Failed')
        }
        var client = getAxiosClient()
        client.get(this.props.authServerHostname + this.props.authServer+'/buttons').then(function(res) {
            //console.log(['RD',res.data])
            that.setState({buttons: res && res.data  && res.data.buttons ? res.data.buttons.split(",") : []  })
        })
    }
         
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
   
 
    render() {
       let that = this;
       var standalone = (this.props.allowedOrigins && this.props.allowedOrigins.length > 0) ? true : false
		 let loginButtons = that.state.buttons.map(function(key) {
			let link = that.props.authServerHostname + that.props.authServer + '/'+ key;
			let title = key.slice(0,1).toUpperCase() + key.slice(1);
			let image = brandImages[key]
			return <span key={key} >&nbsp;<a className='btn btn-primary' href={link} >
            {key === "amazon" && <AmazonLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "google" && <GoogleLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "github" && <GithubLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "twitter" && <TwitterLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "facebook" && <FacebookLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {title}
            </a></span>                         
		 });
		   if (that.props.isRoot) {
               parentPath = that.props.history.location.pathname && that.props.history.location.pathname !== "/" ? that.props.history.location.pathname : ''
            } else {
                var pathParts = that.props.history.location.pathname.split("/")
                var parentPath = pathParts.slice(0,pathParts.length-1).join("/")
            }
           return <div> 
       
                 
         {(!standalone && this.props.isLoggedIn()) && <Link to={parentPath+'/profile'} style={{clear:'both',display:'inline'}} >
             <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Profile</div>
        </Link>}
         
         <Link to={parentPath+'/forgot'} style={{clear:'both',display:'inline'}} >
         <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Forgot Password</div>
         </Link>
         
         <Link to={parentPath+'/register'} style={{clear:'both',display:'inline'}} >
         <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Register</div>
         </Link>
          <h1 className="h3 mb-3 font-weight-normal" style={{textAlign:'left'}}>Sign in</h1>
         {loginButtons && loginButtons.length > 0 && <div style={{float:'right'}}> using {loginButtons}  <br/> </div>}
             
           <form className="form-signin" method="POST"  action={that.props.authServerHostname + that.props.authServer+'/signin'} >
                             
                     
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="text" name="username" id="inputEmail" className="form-control" placeholder="Email address" required   autoComplete="signin_username" />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password" required  autoComplete="signin_password" />

          <button className="btn btn-lg btn-success btn-block" type="submit">Sign in</button>  
                   
        </form>
       </div>
    };
}
