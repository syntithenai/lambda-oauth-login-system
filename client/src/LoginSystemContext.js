/* global document */
import React, { Component } from 'react';

import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default  class LoginSystemContext extends Component {
    
    constructor(props) {
        super(props);
        // authServer url must be on same domain as website so oauth callback saves refresh cookie to same domain 
        // by default use the relative path /api/login
        this.state = {
            user: {}, 
            // from props or env vars
            authServer: props.authServer && props.authServer.trim() ? props.authServer : '', 
            authServerHostname: props.authServerHostname && props.authServerHostname.trim() ? props.authServerHostname : (window.authServer && window.authServer.trim() ? window.authServer : window.location.origin),
            allowedOrigins: props.allowedOrigins ? props.allowedOrigins : (window.allowedOrigins ? window.allowedOrigins.split(",") : [])
        }
        //console.log(['STATE',this.state])
        this.setUser = this.setUser.bind(this)
        this.useRefreshToken = this.useRefreshToken.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.logout = this.logout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
     };
    
    isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) 
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    componentDidMount(props) {
        let that=this;
        this.useRefreshToken().then(function(userAndToken) { 
            that.setUser(userAndToken)
            window.addEventListener("message", receiveMessage, false);
        })
        
        function receiveMessage(event) {
             //console.log(["frame MESSAGE", JSON.stringify(event.data), event, event.origin,that.state.allowedOrigins, event.source])
             
             // only handle messages if allowedOrigins is set and message comes from an allowedOrigin  
             if (that.state.allowedOrigins && that.state.allowedOrigins.indexOf(event.origin) !== -1) {  
                // poll login status
                if (event.data && event.data.check_login) {
                    // send null unless token AND user are loaded
                    //console.log(["return frame MESSAGE",{user:that.state.user && that.state.user.token ? that.state.user : null},event.origin])
                    event.source.postMessage({user:that.state.user && that.state.user.token && that.state.user.username && that.state.user.username.trim() ? that.state.user : null},event.origin)
                // close window when location changes from an allowedPage
                }
                if (event.data && event.data.allowedPages && Array.isArray(event.data.allowedPages)) {
                    var parts = window.location.href ? window.location.href.split("/") : []
                    //console.log(["close win ?"])
                    if (event.data.allowedPages.indexOf(parts[parts.length -1]) === -1) {
                        //setTimeout(function() {
                            window.close()
                        //},2000)
                    }
                
                }
            }
        }

        
    };
   
    
    useRefreshToken() {
        let that = this
        return new Promise(function(resolve,reject) {
            const axiosClient = getAxiosClient();
            axiosClient( {
              url: that.state.authServerHostname + that.state.authServer+'/refresh_token',
              method: 'get'
            }).then(function(res) {
                return res.data;  
            }).then(function(res) {
                if (res.access_token) {
                    //that.setUser({token:res})
                    that.loadUser(res.access_token).then(function(user) {
                        var combined = Object.assign({},user,{token:res})
                        if (that.refreshTimeout) clearTimeout(that.refreshTimeout)
                        that.refreshTimeout = setTimeout(function() {
                            that.useRefreshToken().then(function(userAndToken) { 
                                that.setUser(userAndToken)
                            })
                        },840000) // 14 minutes
                        resolve(combined)
                    })
                } else {
                    resolve({})
                }
             }).catch(function(err) {
                console.log(err);
            });
        })
    }
   
	loadUser(accessToken) {
		let that = this;
        return new Promise(function(resolve,reject) {
			if (accessToken) {
        		const axiosClient = getAxiosClient(accessToken);
				axiosClient.post(that.state.authServerHostname + that.state.authServer+'/me',{
				})
				.then(function(res) {
				  return res.data;  
				})
				.then(function(user) {
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
    
      
  logout(bearerToken) {
      let that = this;
	  this.setState({user:null});
	  const axiosClient = getAxiosClient(bearerToken);
      return axiosClient( {
		  url: that.state.authServerHostname + that.state.authServer+'/logout',
		  method: 'post',
		  
		}).catch(function(err) {
			console.log(err);
		});	
      
  };
  
   
  
    render() {
        return <div>{this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, this.isLoggedIn, this.loadUser, this.useRefreshToken,this.logout, this.state.authServer, this.state.authServerHostname, this.state.allowedOrigins)}</div>
    }
    
}
