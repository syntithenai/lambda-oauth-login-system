/* global document */
import React, { Component } from 'react';

import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default  class LoginSystemContext extends Component {
    
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
            user: {}, 
            // from props or env vars
            //authServer: props.authServer && props.authServer.trim() ? props.authServer : '', 
            //authServerHostname: props.authServerHostname && props.authServerHostname.trim() ? props.authServerHostname : (window.authServer && window.authServer.trim() ? window.authServer : window.location.origin),
            allowedOrigins: props.allowedOrigins && props.allowedOrigins.split(",").length > 0  ? props.allowedOrigins : (window.allowedOrigins && window.allowedOrigins.split(",").length > 0 ? window.allowedOrigins.split(",") : [])
        }
        //console.log(['STATE',this.state])
        this.setUser = this.setUser.bind(this)
        this.useRefreshToken = this.useRefreshToken.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.logout = this.logout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
     };
    
    isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) ? true : false
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    componentDidMount(props) {
        let that=this;
        this.useRefreshToken().then(function(userAndToken) { 
            that.setUser(userAndToken)
        })
    
        window.addEventListener("message", receiveMessage, false);
        
        function receiveMessage(event) {
			//console.log(['LoginSystemContext MESSAGE',event.data])
			
             // only handle messages if allowedOrigins is set and message comes from an allowedOrigin  
             if (that.state.allowedOrigins && that.state.allowedOrigins.indexOf(event.origin) !== -1) {  
					
				//console.log(['LoginSystemContext MESSAGE allowed',event.data,that.state.allowedOrigins,event.origin])
				// poll login status
                if (event.data && event.data.check_login) {
                    // send null unless token AND user are loaded
                    //console.log('LoginSystemContext MESSAGE check login')
				
                    event.source.postMessage({user:that.state.user },event.origin)
                }
                if (event.data && event.data.refresh_login) {
                    // send null unless token AND user are loaded
                    that.useRefreshToken().then(function (user) {
						event.source.postMessage({user:user},event.origin)
					})
             	}
                // close window when location changes from an allowedPage
                if (event.data && event.data.allowedPages && Array.isArray(event.data.allowedPages)) {
                    var parts = window.location.href ? window.location.href.split("/") : []
                    if (event.data.allowedPages.indexOf(parts[parts.length -1]) === -1) {
                           window.close()
                    }
                
                }
                // logout message
                if (event.data && event.data.logout) {
                    // send null unless token AND user are loaded
                    if (that.isLoggedIn()) that.logout(that.state.user.access_token)
                    event.source.postMessage({user: null},event.origin)
                }
            }
        }

        
    };
   
    
    useRefreshToken() {
        let that = this
        return new Promise(function(resolve,reject) {
            const axiosClient = getAxiosClient();
            axiosClient( {
              url: that.props.loginServer+'/api/refresh_token',
              method: 'get'
            }).then(function(res) {
                return res.data;  
            }).then(function(res) {
		        if (res.access_token) {
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
				axiosClient.post(that.props.loginServer+'/api/me',{
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
		  url: that.props.loginServer+'/api/logout',
		  method: 'post',
		  
		}).catch(function(err) {
		});	
      
  };
  
   
  
    render() {
        return <div>
			{this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, this.isLoggedIn, this.loadUser, this.useRefreshToken,this.logout, this.props.loginServer, this.state.allowedOrigins)}
         </div>
    }
    
}
