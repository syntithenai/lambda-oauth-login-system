import React, { Component } from 'react'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default class ExternalLogin   extends Component {
  
   constructor(props) {
        super(props)
        this.state = {user:null, checkLoginIframe: null}
        this.loginPopup = null
        this.pollLoginTimeout = null
        this.pollCloseTimeout = null
        this.receiveMessage = this.receiveMessage.bind(this)
        this.pollShouldClose = this.pollShouldClose.bind(this)
        this.checkIsLoggedIn = this.checkIsLoggedIn.bind(this)
        this.createLoginIframe = this.createLoginIframe.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doProfile = this.doProfile.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.setUser = this.setUser.bind(this)
        this.myFrame = null
    }
    
    setUser(user) {
        this.setState({user:user})
    }
   
    
    componentDidMount(props) {
        var that = this
        window.addEventListener("message", this.receiveMessage, false); 
        that.createLoginIframe()
     }
    
     receiveMessage(event) {
        var origin = new URL(this.props.loginServer).origin
        if (event.origin === origin) {
            this.setUser(event.data.user)
            if (this.loginPopup) this.loginPopup.close()
        }
     }
   
    // open a window to check login and keep polling for login status updates
     pollShouldClose(popup, allowedPages) {
        let that = this
        if (this.pollTimeout) clearTimeout(this.pollTimeout)
        this.pollTimeout = setTimeout(function() {
            if (popup && !popup.closed) {
				var origin = new URL(that.props.loginServer).origin
                popup.postMessage({check_login:true, allowedPages: allowedPages}, origin);
                that.pollShouldClose(popup, allowedPages)
            }
        },500)
    }
    // open a window to check login then close it when it responds
     checkIsLoggedIn(popup, count = 0) {
         if (!this.isLoggedIn()) {
			let that = this
			if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
			this.pollLoginTimeout = setTimeout(function() {
				if (popup && count < 10) {
					var origin = new URL(that.props.loginServer).origin
					popup.postMessage({check_login:true}, origin);
					that.checkIsLoggedIn(popup, count+1)
				}
			},1000)
		}
    }

	createLoginIframe() {
		let that = this
		if (this.myFrame === null) {
			var url = this.props.loginServer + "#blank"
			var i = document.createElement('iframe');
			this.myFrame = i
			i.style.display = 'none'; 
			i.src = url
			i.onload = function() {
			  var popup = i.contentWindow;
			  that.checkIsLoggedIn(popup)
			  setInterval(function(popup) {that.checkIsLoggedIn(popup)},5000)
			}
			document.body.appendChild(i);
		}
	}

     doLogin() {
        var url = this.props.loginServer+ '#login'
        var popup = window.open(url,'mywin')
        this.pollShouldClose(popup,['login','register','forgot','registerconfirm','privacy'])
    }
    
     doProfile() {
        var url = this.props.loginServer + '#profile'
        var popup = window.open(url,'mywin')
        this.pollShouldClose(popup,['profile','logout'])
    }
    
    doLogout() {
		var origin = new URL(that.props.loginServer).origin
		this.myFrame.src=that.props.loginServer + '#logout'
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
		var theUrl = new URL(this.props.loginServer)
	  
      return <div>
      {this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString,this.isLoggedIn, this.loadUser,this.doLogout, this.doLogin, this.doProfile,theUrl.path, theUrl.origin)}
      
      </div>
    }
}
