import React, { Component } from 'react'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default class ExternalLogin   extends Component {
  
   constructor(props) {
        super(props)
        this.state = {confirmIframeLoaded: false, user:null, checkLoginIframe: null, redirect: null, useWindow: (localStorage.getItem('useWindowForLoginPolling') === 'true' ? true : false)}
        this.pollLoginTimeout = null
        this.pollAuthSuccessTimeout = null
        this.pollAuthSuccess = this.pollAuthSuccess.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
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
    
    // send a message to window/frame used to poll login asking it to recheck it's login status
    setIframeUser(user) {
		var loginOrigin = new URL(this.props.loginServer).origin
		if (this.isLoggedIn()) {
			// notify iframe to refresh login
			if (this.myFrame && this.myFrame.contentWindow) this.myFrame.contentWindow.postMessage({refresh_login: user},loginOrigin)
		} else {
			// logout in frame
			if (this.myFrame && this.myFrame.contentWindow) this.myFrame.contentWindow.postMessage({logout: true},loginOrigin)
		}
	}
   
    
    componentDidMount(props) {
        var that = this
        window.addEventListener("message", this.receiveMessage, false); 
        that.createLoginIframe()
     }
    
     receiveMessage(event) {
		 console.log(['ExternalLogin MESSAGE',event.data])
		let that = this
        var origin = new URL(this.props.loginServer).origin
		if (event.origin === origin) {
			// if login failed in frame then use window for login polling
			if (event.data && event.data.hasOwnProperty('confirm_login_ok')) {
				that.setState({confirmIframeLoaded : true})
		     	if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
				if (event.data.confirm_login_ok) {
					that.setState({useWindow: false})
					localStorage.setItem('useWindowForLoginPolling','false')
				} else {
					that.setState({useWindow: true})
					localStorage.setItem('useWindowForLoginPolling','true')
				}
			// after oauth flow
			} else if (event.data && event.data.oauth_success) {
				that.setUser(event.data.oauth_success)
				if (that.testIframeLogin) that.testIframeLogin(event.data.oauth_success)
				// stop oauth polling
				if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
				window.location.hash = "#" + this.props.loginRedirect
			// just the user
			} else if (event.data.hasOwnProperty('user')) {
				this.setUser(event.data.user)	
			}
		}
     }
     
     // CHECK IF BROWSER SUPPORTS CROSS DOMAIN COOKIES INSIDE FRAMES
     // THIS FUNCTION IS CALLED JUST AFTER SUCCESSFUL LOGIN
     testIframeLogin(user) {
			console.log('TEST IFRAME LOGIN')
			let that = this
			
				var url = that.props.loginServer + "#blank"
				var i = document.createElement('iframe')
				that.mytestFrame = i  
				i.style.display = 'none'
				i.src = url
				i.onload = function() {
				  var popup = i.contentWindow
				  setTimeout(function() {
					that.confirmIsLoggedIn(popup)
				  }, 6000)
				}
				
				document.body.appendChild(i)
				// timeout close
				setTimeout(function() {
					if (that.state.confirmIframeLoaded) {
						localStorage.setItem('useWindowForLoginPolling','false')
					} else {
						that.setState({useWindow: true})
						localStorage.setItem('useWindowForLoginPolling','true')
					}
						
					document.body.removeChild(i)
				},10000)
			
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
				if (popup) { 
					var origin = new URL(that.props.loginServer).origin
					popup.postMessage({check_login:true}, origin);
					that.checkIsLoggedIn(popup, count+1)
				}
			},2000)
		}
    }
    
    confirmIsLoggedIn(popup, count = 0) {
		 let that = this
		if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
		this.pollLoginTimeout = setTimeout(function() {
			if (popup) { //&& count < 10) {
				var origin = new URL(that.props.loginServer).origin
				popup.postMessage({confirm_login:true}, origin);
				that.confirmIsLoggedIn(popup, count+1)
			}
		},500)
    }

	doCreateLoginWindow() {
		let that = this
		var url = this.props.loginServer + "#blank"
		if (this.loginPopup) this.loginPopup.close() 
		this.loginPopup = window.open(url,'mywin','resizable=no, scrollbars=no, status=no, width=10,height=10, top: 0, left:'+window.screen.availHeight+10);
		that.checkIsLoggedIn(this.loginPopup)
		// timeout close
		setTimeout(function() {
			that.loginPopup.close()
			// auto refresh token
			setTimeout(function() {
				that.createLoginIframe()
			},that.props.refreshInterval && that.props.refreshInterval > 0 ? that.props.refreshInterval : 840000 )
		},10000)
	}

	doCreateLoginFrame() {
		let that = this
		// cleanup old window/frame
		if (this.myFrame !== null) {
			try {
				document.body.removeChild(this.myFrame);
				delete this.myFrame
			} catch (e) {}
		}	
		var loaded = false
		var url = this.props.loginServer + "#blank"
		var i = document.createElement('iframe')
		this.myFrame = i  
		i.style.display = 'none'
		i.src = url
		i.onload = function() {
		  var popup = i.contentWindow
		  that.checkIsLoggedIn(popup)
		}
		document.body.appendChild(i)
		// timeout close
		setTimeout(function() {
			document.body.removeChild(i)
			// auto refresh token
			setTimeout(function() {
				that.createLoginIframe()
			},that.props.refreshInterval && that.props.refreshInterval > 0 ? that.props.refreshInterval : 840000 )
		},6000)
	}

	createLoginIframe() {
		// use window for polling if check failed at last login
		if (localStorage.getItem('useWindowForLoginPolling') === 'true') {
			this.doCreateLoginWindow()

		} else {
			this.doCreateLoginFrame()
		}
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
    
    postlogout(bearerToken) {
      let that = this;
	  const axiosClient = getAxiosClient(bearerToken);
	  return axiosClient( {
		  url: that.props.loginServer+'/api/logout',
		  method: 'post',
		  
		}).catch(function(err) {
		});	
      
    };
    doLogout() {
		let that = this
		var origin = new URL(that.props.loginServer).origin
       	if (this.isLoggedIn()) this.postlogout(this.state.user.token.access_token)
	    this.setUser(null)
	}
	     
     isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) ? true : false
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
	 	{this.props.children({testIframeLogin: this.testIframeLogin, user:this.state.user,setUser:this.setUser,setIframeUser: this.setIframeUser, getAxiosClient: getAxiosClient,getMediaQueryString: getMediaQueryString,getCsrfQueryString: getCsrfQueryString,isLoggedIn: this.isLoggedIn, loadUser: this.loadUser,logout: this.doLogout, doLogin: this.doLogin, doProfile: this.doProfile, loginServer: this.props.loginServer, pollAuthSuccess: this.pollAuthSuccess, loginRedirect: this.props.loginRedirect, logoutRedirect: this.props.logoutRedirect, buttons: this.props.buttons})}
      </div>
    }
}
