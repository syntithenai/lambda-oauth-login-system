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
        this.state={redirect: null,  signin_username:'',signin_password:'',rememberme:false};
        this.change = this.change.bind(this);
        this.signIn = this.signIn.bind(this);
        this.startOauthFlow = this.startOauthFlow.bind(this)
        this.pollAuthSuccessTimeout = null
        this.authWindow = null
        this.loginWindow = null
    };
    
    componentDidMount() {
        let that = this
        if (window.location.search.indexOf('fail=true') !== -1) {
            this.props.submitWarning('Login Failed')
        }
		window.addEventListener("message", function() {
			var origin = new URL(that.props.loginServer).origin
			if (event.origin === origin) {
				if (event.data && event.data.login_success) {
					//console.log('LOGIN SUCCESS EVENT')
					that.setState({signin_username: '', signin_password:''})
				} else if (event.data && event.data.login_fail) {
					//console.log('LOGIN fail EVENT')
					that.setState({signin_username: '', signin_password:''})
				}
			}
		}, false); 
	
    }
    
    startOauthFlow(url) {
		if (this.authWindow) this.authWindow.close() 
		this.authWindow = window.open(url)
		if (this.props.pollAuthSuccess) this.props.pollAuthSuccess(this.authWindow)
	}
 
    signIn(e) {
		//console.log(this.props)
		
		let that = this;
		e.preventDefault()
		if (that.props.startPollLoginSuccess) {
			//console.log(this.state)
			that.props.startPollLoginSuccess(this.state.signin_username,this.state.signin_password)
			//that.setState({signin_username: '', signin_password:''})
				
		} else {
			if (this.props.startWaiting) this.props.startWaiting();
			const axiosClient = getAxiosClient({});
			axiosClient.post(that.props.loginServer+'/api/signinajax',{
				username: this.state.signin_username,
				password: this.state.signin_password
			})
			.then(function(res) {
			  return res.data;  
			})
			.then(function(data) {
				if (that.props.stopWaiting) that.props.stopWaiting();
				if (data && data.user && data.user.username && data.user.username.trim()) {
					that.props.setUser(data.user)
					
					that.setState({redirect: that.props.loginRedirect, signin_username: '', signin_password:''})
					
				} else if (data.error) {
					that.setState({signin_username: '', signin_password:''})
					that.props.submitWarning(data.error)
				}
				
			}).catch(function(err) {
				console.log(err);
				
			})
		}
		return false
	} 
	
  
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
   

 
    render() {
		let that = this;
		   
		if (this.state.redirect) {
			return <Redirect to={this.state.redirect} />
		} else {
		    let loginButtons = that.props.buttons.map(function(key,buttonNum) {
				let link = that.props.loginServer + '/api/'+ key;
				let title = key.slice(0,1).toUpperCase() + key.slice(1);
				let image = brandImages[key]
				return <span key={key} >&nbsp;<a id={"oauth_signin_button_"+buttonNum} className='btn btn-primary' onClick={function(e) {that.startOauthFlow(link)}}  >
				{key === "amazon" && <AmazonLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "google" && <GoogleLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "github" && <GithubLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "twitter" && <TwitterLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "facebook" && <FacebookLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{title}
				</a></span>                         
			 });
			   return <div> 
		   
			   {window.opener && <button id="close_button" className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
					 Close</button>}
							
			 {(this.props.isLoggedIn() && !this.props.hideButtons) && <Link id="nav_profile_button" to={this.props.linkBase + '/profile'} style={{clear:'both',display:'inline'}} >
				 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary'  >Profile</div>
			</Link>}
			 
			 <Link id="nav_forgot_button" to={this.props.linkBase + '/forgot'} style={{clear:'both',display:'inline'}} >
			 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Forgot Password</div>
			 </Link>
			 
			 <Link  id="nav_register_button"to={this.props.linkBase + '/register'} style={{clear:'both',display:'inline'}} >
			 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Register</div>
			 </Link>
			  
			  
			  <h1 className="h3 mb-3 font-weight-normal" style={{textAlign:'left'}}>Sign in</h1>
			 {loginButtons && loginButtons.length > 0 && <div style={{float:'right'}}> using {loginButtons}  <br/> </div>}
				 
			   <form className="form-signin"   onSubmit={this.signIn}  >
			   
				{this.state.warning_message && <div className='warning-message'   style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
			 
						 
			  <label htmlFor="inputEmail" className="sr-only">Email address</label>
			  <input type="text" name="signin_username" id="inputEmail" className="form-control" placeholder="Email address" required onChange={this.change}   value={this.state.signin_username} autoComplete="signin_username" />
			  <label htmlFor="inputPassword" className="sr-only">Password</label>
			  <input type="password" name="signin_password" id="inputPassword" className="form-control" placeholder="Password" required  onChange={this.change} value={this.state.signin_password} autoComplete="signin_password" />

			  <button id="signin_button" className="btn btn-lg btn-success btn-block" type="submit">Sign In</button>  
					   
			</form>
		   </div>
		  }
    };
}
