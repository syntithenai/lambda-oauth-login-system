import React, { Component } from 'react'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default class ExternalLogin   extends Component {
	
  //(navigator.brave && await navigator.brave.isBrave() || false)
   
   constructor(props) {
        super(props)
        this.state = {
			loginCheckActive: true,
			doLoginRedirect: null,
			warning_message: '',
			 confirmIframeLoaded: false, 
			 user:null, 
			 checkLoginIframe: null,
			 redirect: null, 
			 useWindow: ((!localStorage) || (localStorage && localStorage.getItem && localStorage.getItem('useWindowForLoginPolling') === 'true') ? true : false)
		}
        this.pollLoginTimeout = null
        this.pollAuthSuccessTimeout = null
        this.refreshTimeout = null
        
        this.loginWindow = null
        this.myFrame = null
        
        this.isBusy = false
        
        
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
        this.receiveMessage = this.receiveMessage.bind(this)
        this.testIframeLogin = this.testIframeLogin.bind(this)
        this.confirmIsLoggedIn = this.confirmIsLoggedIn.bind(this)
        this.pollLoginSuccess = this.pollLoginSuccess.bind(this)
        this.startPollLoginSuccess = this.startPollLoginSuccess.bind(this)
        this.submitWarning = this.submitWarning.bind(this)
        this.pollForgotSuccess = this.pollForgotSuccess.bind(this)
        this.startPollForgotSuccess = this.startPollForgotSuccess.bind(this)
        this.pollConfirmSuccess = this.pollConfirmSuccess.bind(this)
        this.startPollConfirmSuccess = this.startPollConfirmSuccess.bind(this)
    }
    
    
    componentDidMount(props) {
        var that = this
        window.addEventListener("message", this.receiveMessage, false); 
        // don't try auto login when using forgot or confirm registration
         if (window.location.search.indexOf('code=') === -1) {
			that.createLoginIframe()
		}
		this.setState({'loginCheckActive':true})
     }
    
     receiveMessage(event) {
		 //console.log(['ExternalLogin MESSAGE',event.data])
		let that = this
        var origin = new URL(this.props.loginServer).origin
		if (event.origin === origin) {
			// if login failed in frame then use window for login polling
			if (event.data && event.data.hasOwnProperty('confirm_login_ok')) {
				if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
				//console.log(['CIOBNF LOGIN OK',event.data.confirm_login_ok])
				
				that.isBusy = false
				that.setState({'loginCheckActive':false})
				if (that.testTimeout) clearTimeout(that.testTimeout)
				if (that.mytestFrame) document.body.removeChild(that.mytestFrame)
				
				if (event.data.confirm_login_ok) {
					//that.setState({confirmIframeLoaded : true})
		     		//that.setState({useWindow: false})
					if (localStorage && localStorage.setItem) localStorage.setItem('useWindowForLoginPolling','false')
				} else {
					//that.setState({confirmIframeLoaded : false})
					//that.setState({useWindow: true})
					if (localStorage && localStorage.setItem) localStorage.setItem('useWindowForLoginPolling','true')
				}
				if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
			// after oauth flow
			} else if (event.data && event.data.oauth_success) {
				that.isBusy = false
				that.setUser(event.data.oauth_success)
				that.setState({'loginCheckActive':false})
				that.testIframeLogin(event.data.oauth_success)
				// stop oauth polling
				if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
				//window.location = window.location.origin + window.location.pathname + "#" + that.props.loginRedirect
				if (that.props.onLogin) that.props.onLogin(event.data.oauth_success) 
				that.setState({doLoginRedirect: that.props.loginRedirect})
			// just the user
			//} else if (event.data && event.data.login_success) {
				// IMPLEMENTED IN LOGIN COMPONENT SWITCHED BY testIframeLogin
			} else if (event.data && event.data.login_success) {
				that.isBusy = false
				//console.log('LOGIN SUCCESS EVENT')
				that.setUser(event.data.user)
				that.testIframeLogin()
				if (that.pollAuthSuccessTimeout) clearTimeout(that.pollAuthSuccessTimeout)
				that.setState({'loginCheckActive':false})
				if (that.props.onLogin) that.props.onLogin(event.data.user) 
				that.setState({doLoginRedirect: that.props.loginRedirect})
				
			} else if (event.data && event.data.login_fail) {
				that.isBusy = false
				//console.log('LOGIN FAIL EVENT')
				// show error message
				//console.log(event.data.login_fail)
				that.submitWarning(event.data.login_fail)
				that.setState({'loginCheckActive':false})
				if (that.pollAuthSuccessTimeout) clearTimeout(that.pollAuthSuccessTimeout)
				
			}
			// ?? TODO remove
			 else if (event.data.check_login_ok && event.data.hasOwnProperty('user')) {
				that.isBusy = false
				 //console.log('UPDATE USER')
				 //console.log(event.data)
				if (event.data && event.data.user) this.setUser(event.data.user)
				that.setState({'loginCheckActive':false})
				if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)	
			}
		}
     }
     
     submitWarning(warning) {
        let that=this;
        if (this.warningTimeout) clearTimeout(this.warningTimeout);
        this.setState({'warning_message':warning});
        this.warningTimeout = setTimeout(function() {
            that.setState({'warning_message':''});
        },6000);
    };     
    
    
    setUser(user) {
	    this.setState({user:user})
    }
    
  
     // OAuth polling for login status updates, called by Login component
     pollAuthSuccess(popup) {
		let that = this
		that.isBusy = true
		if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
        this.pollAuthSuccessTimeout = setTimeout(function() {
		    if (popup && !popup.closed) {
		    	var origin = new URL(that.props.loginServer).origin
                popup.postMessage({poll_oauth_success:true}, origin);
                that.pollAuthSuccess(popup)
            }
        },1000)
    }
       
     // CHECK IF BROWSER SUPPORTS CROSS DOMAIN COOKIES INSIDE FRAMES
     // THIS FUNCTION IS CALLED JUST AFTER SUCCESSFUL LOGIN
     testIframeLogin() {
		 //console.log('TEST IFRAME LOGIN')
		//return
		 //if (!this.testActive)  {
			//if (localStorage && localStorage.setItem) 
			//if (localStorage.getItem('useWindowForLoginPolling') !== null) {
				//return
			//}
			let that = this
			that.isBusy = true
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
				if (that.testTimeout) clearTimeout(that.testTimeout) 
				that.testTimeout = setTimeout(function() {
					that.testActive = false
					//console.log(['TEST IFRAME LOGIN timeout',that.state.confirmIframeLoaded ? 'can use frame' : 'no can use frame' ])
					if (that.state.confirmIframeLoaded) {
						if (localStorage && localStorage.setItem) localStorage.setItem('useWindowForLoginPolling','false')
					} else {
						that.setState({useWindow: true})
						if (localStorage && localStorage.setItem) localStorage.setItem('useWindowForLoginPolling','true')
					}
					if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
					if (that.mytestFrame) document.body.removeChild(that.mytestFrame)
				},14000)
		  //}
			
	 }
     
     confirmIsLoggedIn(popup, count = 0) {
		//console.log(['TEST IFRAME LOGIN confirm is logged in',popup,count])
			
		let that = this
		that.isBusy = true
		if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
		this.pollLoginTimeout = setTimeout(function() {
			if (popup && count < 30) {
				//console.log(['TEST IFRAME LOGIN confirm is post message'])
				var origin = new URL(that.props.loginServer).origin
				popup.postMessage({confirm_login:true}, origin);
				that.confirmIsLoggedIn(popup, count+1)
			}
		},500)
    }
     
    
    startPollLoginSuccess(username,password) {
		//console.log(['startPollLoginSuccess',username,password])
		this.isBusy = true
		if (this.loginWindow)  this.loginWindow.close()
		this.loginWindow = window.open(this.props.loginServer+'#/blank')
		this.pollLoginSuccess(this.loginWindow,username,password)	
	}
         
    pollLoginSuccess(popup,username,password) {
		let that = this
		//console.log(['pollLoginSuccess',username,password])
		if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
		if (!this.isLoggedIn()) {
			var origin = new URL(that.props.loginServer).origin
			this.loginWindow.postMessage({login:true,username:username,password:password},origin)
			this.pollAuthSuccessTimeout = setTimeout(function() {
				that.pollLoginSuccess(popup,username,password)
			},1000)
		}
	} 
	
	
	 
    startPollConfirmSuccess(code) {
		//console.log(['startPollConfirmSuccess',code])
		this.isBusy = true
		if (this.loginWindow)  this.loginWindow.close()
		this.loginWindow = window.open(this.props.loginServer+'#/blank')
		this.pollConfirmSuccess(this.loginWindow,code)	
	}
         
    pollConfirmSuccess(popup,code) {
		let that = this
		//console.log(['pollConfirmnSuccess',code])
		if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
		if (popup && !this.isLoggedIn()) {
			var origin = new URL(that.props.loginServer).origin
			this.loginWindow.postMessage({doconfirm:true,code:code},origin)
			this.pollAuthSuccessTimeout = setTimeout(function() {
				that.pollConfirmSuccess(popup,code)
			},1000)
		}
	} 
	
	  
    startPollForgotSuccess(code) {
		//console.log(['startPollForgotSuccess',code])
		this.isBusy = true
		if (this.loginWindow)  this.loginWindow.close()
		this.loginWindow = window.open(this.props.loginServer+'#/blank')
		this.pollForgotSuccess(this.loginWindow,code)	
	}
         
    pollForgotSuccess(popup,code) {
		let that = this
		//console.log(['pollForgotSuccess',code])
		if (this.pollAuthSuccessTimeout) clearTimeout(this.pollAuthSuccessTimeout)
		if (popup && !this.isLoggedIn()) {
			var origin = new URL(that.props.loginServer).origin
			this.loginWindow.postMessage({doforgot:true,code:code},origin)
			this.pollAuthSuccessTimeout = setTimeout(function() {
				that.pollForgotSuccess(popup,code)
			},1000)
		}
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
    
     checkIsLoggedIn(popup, count = 0) {
		 //console.log('CHECK IS LOGGED IN')
		 this.isBusy = true
		 let that = this
		 //if (!this.isLoggedIn()) {
			if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
			this.pollLoginTimeout = setTimeout(function() {
				if (popup && !popup.closed) { 
					//console.log('CHECK IS LOGGED IN send')
					var origin = new URL(that.props.loginServer).origin
					popup.postMessage({check_login:true}, origin);
					that.checkIsLoggedIn(popup, count+1)
				}
			},2000)
			this.setState({'loginCheckActive':true})
		//}
    }

	doCreateLoginWindow() {
		let that = this
		var refreshToken = this.isLoggedIn() ? '?refresh_token='+this.state.user.token.refresh_token  : ''
		var url = this.props.loginServer + refreshToken + "#blank"
		if (this.loginPopup) this.loginPopup.close() 
		this.loginPopup = window.open(url,'mywin','resizable=no, scrollbars=no, status=no, width=10,height=10, top: 0, left:'+window.screen.availHeight+10);
		that.checkIsLoggedIn(this.loginPopup)
		this.setState({'loginCheckActive':true})
		// timeout close
		setTimeout(function() {
			that.loginPopup.close()
			that.loginPopup = null
			if (false) that.setState({'loginCheckActive':false})
			// auto refresh token
			if (that.refreshTimeout) clearTimeout(that.refreshTimeout)
			that.refreshTimeout = setTimeout(function() {
				that.createLoginIframe()
			},that.props.refreshInterval && that.props.refreshInterval > 0 ? that.props.refreshInterval : 600000 )
		},15000)
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
		var refreshToken = this.isLoggedIn() ? '?refresh_token='+this.state.user.token.refresh_token : ''
		var url = this.props.loginServer + refreshToken + "#blank"
		var i = document.createElement('iframe')
		this.myFrame = i  
		i.style.display = 'none'
		i.src = url
		i.onload = function() {
		  var popup = i.contentWindow
		  that.checkIsLoggedIn(popup)
		  that.setState({'loginCheckActive':true})
		}
		document.body.appendChild(i)
		// timeout close
		
		setTimeout(function() {
			document.body.removeChild(i)
			if (false) that.setState({'loginCheckActive':false})
			// auto refresh token
			if (that.refreshTimeout) clearTimeout(that.refreshTimeout)
			that.refreshTimeout = setTimeout(function() {
				that.createLoginIframe()
			},that.props.refreshInterval && that.props.refreshInterval > 0 ? that.props.refreshInterval : 600000 )
		},15000)
	}

	createLoginIframe() {
		// don't poll login while cookie test active
		if (!this.isBusy) {
			this.setState({'loginCheckActive':true})
			//console.log('CREATELOGINIFRAME' + new Date().toString())
			// use window for polling if check failed at last login
			//  when no localStorage, use window >> =>  !localStorage || 
			if (localStorage.getItem('useWindowForLoginPolling') === 'true') {
				this.doCreateLoginWindow()

			} else {
				this.doCreateLoginFrame()
			}
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
	    if (that.props.onLogout) that.props.onLogout()
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
	   {this.state.warning_message && <div className='warning-message'   style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
        
	  {this.props.children({loginCheckActive: this.state.loginCheckActive, doLoginRedirect: this.state.doLoginRedirect,  user:this.state.user,setUser:this.setUser, getAxiosClient: getAxiosClient,getMediaQueryString: getMediaQueryString,getCsrfQueryString: getCsrfQueryString,isLoggedIn: this.isLoggedIn, loadUser: this.loadUser,logout: this.doLogout, doLogin: this.doLogin, doProfile: this.doProfile, loginServer: this.props.loginServer, pollAuthSuccess: this.pollAuthSuccess, loginRedirect: this.props.loginRedirect, logoutRedirect: this.props.logoutRedirect, buttons: this.props.buttons, submitWarning: this.submitWarning, startPollLoginSuccess: this.startPollLoginSuccess, startPollConfirmSuccess: this.startPollConfirmSuccess, startPollForgotSuccess: this.startPollForgotSuccess})}
      </div>
    }
}
