import React, { Component } from 'react'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default class ExternalLogin   extends Component {
  
   constructor(props) {
        super(props)
        this.state = {user:null, checkLoginIframe: null, redirect: null, useWindow: (localStorage.getItem('useWindowForLoginPolling') === 'true' ? true : false)}
        //this.loginPopup = null
        this.pollLoginTimeout = null
        //this.pollCloseTimeout = null
        this.pollAuthSuccessTimeout = null
        this.pollAuthSuccess = this.pollAuthSuccess.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
        //this.pollShouldClose = this.pollShouldClose.bind(this)
        this.checkIsLoggedIn = this.checkIsLoggedIn.bind(this)
        this.createLoginIframe = this.createLoginIframe.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doProfile = this.doProfile.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.setUser = this.setUser.bind(this)
        this.setIframeUser = this.setIframeUser.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
        this.myFrame = null
        this.testIframeLogin = this.testIframeLogin.bind(this)
        this.confirmIsLoggedIn = this.confirmIsLoggedIn.bind(this)
    }
    
    setUser(user) {
		
        this.setState({user:user})
        
    }
    
    setIframeUser(user) {
		if (this.isLoggedIn()) {
			// notify iframe to refresh login
			if (this.myFrame && this.myFrame.contentWindow) this.myFrame.contentWindow.postMessage({refresh_login: user},event.origin)
		} else {
			// logout in frame
			if (this.myFrame && this.myFrame.contentWindow) this.myFrame.contentWindow.postMessage({logout: true},event.origin)
		}
	}
   
    
    componentDidMount(props) {
        var that = this
        window.addEventListener("message", this.receiveMessage, false); 
        that.createLoginIframe()
     }
    
     receiveMessage(event) {
		 //console.log(['ExternalLogin MESSAGE',event.data])
		 let that = this
        var origin = new URL(this.props.loginServer).origin
		if (event.origin === origin) {
			if (event.data && event.data.oauth_success) {
				that.setUser(event.data.oauth_success)
				that.setIframeUser(event.data.oauth_success)
				// stop oauth polling
				if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
				window.location.hash = "#" + this.props.loginRedirect
			} else {
				this.setUser(event.data.user)	
			}
		}
     }
     
     // polling for login status updates
     pollAuthSuccess(popup) {
		let that = this
		if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
        this.pollAuthSuccessTimeout = setTimeout(function() {
		    if (popup && !popup.closed) {
		    	var origin = new URL(that.props.loginServer).origin
                popup.postMessage({poll_oauth_success:true}, origin);
                that.pollAuthSuccess(popup)
            }
        },1000)
    }
    // poll a window to check if it's path is in a list of allowed pages or close the window
    // used with external standalone login 
     //pollShouldClose(popup, allowedPages) {
        //let that = this
        //if (this.pollTimeout) clearTimeout(this.pollTimeout)
        //this.pollTimeout = setTimeout(function() {
            //if (popup && !popup.closed) {
				//var origin = new URL(that.props.loginServer).origin
                //popup.postMessage({check_login:true, allowedPages: allowedPages}, origin);
                //that.pollShouldClose(popup, allowedPages)
            //}
        //},500)
    //}
    // open a window to check login then close it when it responds
     checkIsLoggedIn(popup, count = 0) {
		 let that = this
		 if (!this.isLoggedIn()) {
			if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
			this.pollLoginTimeout = setTimeout(function() {
				if (popup) { //&& count < 10) {
					var origin = new URL(that.props.loginServer).origin
					popup.postMessage({check_login:true}, origin);
					that.checkIsLoggedIn(popup, count+1)
				}
			},2000)
		}
    }

	createLoginIframe() {
		let that = this
		if (this.myFrame !== null) {
			document.body.removeChild(this.myFrame);
			delete this.myFrame
		}
		var url = this.props.loginServer + "#blank"
		var i = document.createElement('iframe');
		this.myFrame = i  
		i.style.display = 'none'; 
		i.src = url
		i.onload = function() {
		  var popup = i.contentWindow;
		  that.checkIsLoggedIn(popup)
		}
		document.body.appendChild(i);
	}

     doLogin() {
     //
        //var url = this.props.loginServer+ '#login'
        //var popup = window.open(url,'mywin')
        //this.pollShouldClose(popup,['login','register','forgot','registerconfirm','privacy'])
    }
    
     doProfile() {
        //sShouldClose(popup,['profile','logout'])
    }
    
    doLogout() {
		let that = this
		var origin = new URL(that.props.loginServer).origin
        if (this.myFrame && this.myFrame.contentWindow) {
			console.log('post logout message')
			this.myFrame.contentWindow.postMessage({logout:true}, origin);
		}
        this.setUser(null)
	}
	     
     isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) 
     }
    
     loadUser(accessToken) {
		let that = this;
        return new Promise(function(resolve,reject) {
			if (accessToken) {
        		const axiosClient = getAxiosClient(accessToken);
				axiosClient.post(that.props.loginServer+'/api/me',{
				})
				.then(function(res) {
				   return res.data;  
				})
				.then(function(user) {
                    that.setUser(user)
        			resolve(user);
				}).catch(function(err) {
					console.log(err);
					reject();
				});				
			} else {
				reject();
			}
		})
	}     
  
    render(props) {
	  return <div>
		{this.props.children({user:this.state.user,setUser:this.setUser,setIframeUser: this.setIframeUser, getAxiosClient: getAxiosClient,getMediaQueryString: getMediaQueryString,getCsrfQueryString: getCsrfQueryString,isLoggedIn: this.isLoggedIn, loadUser: this.loadUser,logout: this.doLogout, doLogin: this.doLogin, doProfile: this.doProfile, loginServer: this.props.loginServer, pollAuthSuccess: this.pollAuthSuccess, loginRedirect: this.props.loginRedirect, logoutRedirect: this.props.logoutRedirect, buttons: this.props.buttons})}
      </div>
    }
}
