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
        this.state={redirect: null, warning_message: '', signin_username:'',signin_password:'',rememberme:false};
        this.change = this.change.bind(this);
        this.signIn = this.signIn.bind(this);
        this.submitWarning = this.submitWarning.bind(this)
        this.startOauthFlow = this.startOauthFlow.bind(this)
        this.authWindow = null
    };
    
    componentDidMount() {
        let that = this
        if (window.location.search.indexOf('fail=true') !== -1) {
            this.submitWarning('Login Failed')
        }
        
    }
         
    signIn(e) {
		let that = this;
		e.preventDefault()
		//console.log('signing')
        const axiosClient = getAxiosClient({});
        axiosClient.post(that.props.loginServer+'/api/signinajax',{
			username: this.state.username,
			password: this.state.password
		})
		.then(function(res) {
		  return res.data;  
		})
		.then(function(data) {
			if (data && data.user && data.user.username && data.user.username.trim()) {
				that.props.setUser(data.user)
				that.setState({redirect: that.props.loginRedirect})
			} else if (data.error) {
				that.submitWarning(data.error)
			}
			
		}).catch(function(err) {
			console.log(err);
			
		})
		return false
	} 
	
    submitWarning(warning) {
        let that=this;
        clearTimeout(this.timeout);
        this.setState({'warning_message':warning});
        this.timeout = setTimeout(function() {
            that.setState({'warning_message':''});
        },6000);
    };     
         
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
   
	startOauthFlow(url) {
		if (this.authWindow) this.authWindow.close() 
		this.authWindow = window.open(url)
		if (this.props.pollAuthSuccess) this.props.pollAuthSuccess(this.authWindow)
	}
 
    render() {
		let that = this;
		   
		if (this.state.redirect) {
			return <Redirect to={this.state.redirect} />
		} else {
		    let loginButtons = that.props.buttons.map(function(key) {
				let link = that.props.loginServer + '/api/'+ key;
				let title = key.slice(0,1).toUpperCase() + key.slice(1);
				let image = brandImages[key]
				return <span key={key} >&nbsp;<a className='btn btn-primary' onClick={function(e) {that.startOauthFlow(link)}}  >
				{key === "amazon" && <AmazonLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "google" && <GoogleLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "github" && <GithubLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "twitter" && <TwitterLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{key === "facebook" && <FacebookLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
				{title}
				</a></span>                         
			 });
			   return <div> 
		   
			   {window.opener && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
					 Close</button>}
							
			 {(this.props.isLoggedIn()) && <Link to={this.props.linkBase + '/profile'} style={{clear:'both',display:'inline'}} >
				 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Profile</div>
			</Link>}
			 
			 <Link to={this.props.linkBase + '/forgot'} style={{clear:'both',display:'inline'}} >
			 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Forgot Password</div>
			 </Link>
			 
			 <Link to={this.props.linkBase + '/register'} style={{clear:'both',display:'inline'}} >
			 <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Register</div>
			 </Link>
			  
			  
			  <h1 className="h3 mb-3 font-weight-normal" style={{textAlign:'left'}}>Sign in</h1>
			 {loginButtons && loginButtons.length > 0 && <div style={{float:'right'}}> using {loginButtons}  <br/> </div>}
				 
			   <form className="form-signin"   onSubmit={this.signIn} >
			   
				{this.state.warning_message && <div className='warning-message'   style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
			 
											  
						 
			  <label htmlFor="inputEmail" className="sr-only">Email address</label>
			  <input type="text" name="signin_username" id="inputEmail" className="form-control" placeholder="Email address" required onChange={this.change}   value={this.state.signin_username} autoComplete="signin_username" />
			  <label htmlFor="inputPassword" className="sr-only">Password</label>
			  <input type="password" name="signin_password" id="inputPassword" className="form-control" placeholder="Password" required  onChange={this.change} value={this.state.signin_password} autoComplete="signin_password" />

			  <button className="btn btn-lg btn-success btn-block" type="submit">Sign In</button>  
					   
			</form>
		   </div>
		  }
    };
}
