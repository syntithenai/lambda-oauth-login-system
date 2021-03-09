import React, { Component } from 'react'
//import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default class ExternalLogin   extends Component {
  
   constructor(props) {
        super(props)
        //var that = this
        this.state = {user:null, checkLoginIframe: null}
        this.loginPopup = null
        this.pollLoginTimeout = null
        this.pollCloseTimeout = null
        this.receiveMessage = this.receiveMessage.bind(this)
        this.pollShouldClose = this.pollShouldClose.bind(this)
        this.checkIsLoggedIn = this.checkIsLoggedIn.bind(this)
        this.checkLogin = this.checkLogin.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doProfile = this.doProfile.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.setUser = this.setUser.bind(this)
        this.setCheckLoginIframe = this.setCheckLoginIframe.bind(this)
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    setCheckLoginIframe(url) {
        this.setState({checkLoginIframe:url})
    }
    
    componentDidMount(props) {
        var that = this
        //console.log(['moiunt',this.props])
        //var loginUrl = new URL(this.props.loginServer)
		//this.setState({
			//loginServerHostname : loginUrl ? loginUrl.origin : '',
			//loginServerPath : loginUrl ? loginUrl.pathname + '/api' : '',
			//authWeb : loginUrl ? loginUrl.pathname  : ''
		//})
		//console.log(['ffffff',loginUrl,this.state])
	  
        window.addEventListener("message", this.receiveMessage, false); 
        setTimeout(function() {
            that.checkLogin()
        },1000)
     }
    
     receiveMessage(event) {
         console.log(['msg',event.origin,event.data,event.source])
        var origin = new URL(this.props.loginServer).origin
        if (event.origin === origin) {
            console.log(['msgOK',event.origin,event.data,event.source])
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
                console.log(['send msg',{check_login:true, allowedPages: allowedPages}, origin])
                popup.postMessage({check_login:true, allowedPages: allowedPages}, origin);
                that.pollShouldClose(popup, allowedPages)
            }
        },500)
    }
    // open a window to check login then close it when it responds
     checkIsLoggedIn(popup, count = 0) {
        
         console.log('check is logged in login')
        let that = this
        if (this.pollLoginTimeout) clearTimeout(this.pollLoginTimeout)
        this.pollLoginTimeout = setTimeout(function() {
            if (popup && count < 10) {
				var origin = new URL(that.props.loginServer).origin
                console.log([count,'send iframe login msg',{check_login:true}, origin,popup])
                popup.postMessage({check_login:true}, origin);
                that.checkIsLoggedIn(popup, count+1)
            }
        },1000)
    }

    // open an iframe to check login 
     checkLogin() {
		 //return
		var that = this
        var url = this.props.loginServer + "#blank"
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.src = url
        i.onload = function() {
          var popup = i.contentWindow;
          console.log(['iframepopup',popup])   
            that.checkIsLoggedIn(popup)
        }
        document.body.appendChild(i);
        ////var popup = window.open(url, `toolbar=no,
                                    //location=no,
                                    //status=no,
                                    //menubar=no,
                                    //scrollbars=no,
                                    //resizable=no,
                                    //width=10,
                                    //height=10`)
        //popup.resizeTo(1,1); 
        //this.loginPopup = window.open(url,'mywin','resizable=no, scrollbars=no, status=no, width=10,height=10, top: 0, left:'+window.screen.availHeight+10);
        //that.checkIsLoggedIn(this.loginPopup)
         //console.log('check ddlogin')
        
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
        var url = this.props.loginServer + '#logout'
        var popup = window.open(url,'mywin')
        this.pollShouldClose(popup,['logout'])
        
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
      {this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString,this.isLoggedIn, this.loadUser,this.doLogout, this.doLogin, this.doProfile)}
      
      </div>
    }
}
