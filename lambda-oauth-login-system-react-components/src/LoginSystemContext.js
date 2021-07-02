/* global document */
import React, { Component } from 'react';

import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default  class LoginSystemContext extends Component {
    
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
			warning_message: '',
            user: null,
            userInitialised: false, 
            // from props or env vars
            allowedOrigins: props.allowedOrigins ? props.allowedOrigins : ''
        }
        this.setUser = this.setUser.bind(this)
        this.useRefreshToken = this.useRefreshToken.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.logout = this.logout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.submitWarning = this.submitWarning.bind(this)
        this.signIn = this.signIn.bind(this)
        this.doConfirm = this.doConfirm.bind(this)
        this.doForgot = this.doForgot.bind(this)
		
     };
     
    componentDidMount(props) {
        let that=this;
        //console.log(["CONTEXT MOUNT",props])
        // refresh login using server cookies
        var refreshToken = null
        if (window.location.search && window.location.search.indexOf('?refresh_token') !== -1) {
			refreshToken = window.location.search.slice(15)
		}
		//console.log('userefersh')
		this.useRefreshToken(refreshToken).then(function(userAndToken) { 
			if (userAndToken.user) {
				//console.log(["finished use refresh token SET USER",userAndToken])
				that.setUser(userAndToken)
			}
			//console.log(["finished use refresh token",userAndToken])
			// don't process messages until we've tried restoring login from session
		}).finally(function() {
			//console.log('userefersh finally')
			that.setState({userInitialised: true})
		})
	
        window.addEventListener("message", receiveMessage, false);
        var checkActive = false
        var confirmLoginActive = false
		var refreshActive = false
                
        var loginActive = false
        var confirmActive = false
        var forgotActive = false
         
        
        function receiveMessage(event) {
			//console.log(['smadster event',JSON.stringify(event.data),that.state.allowedOrigins,event.origin])
		     // only handle messages if allowedOrigins is set and message comes from an allowedOrigin  
             if (that.state.allowedOrigins && that.state.allowedOrigins.indexOf(event.origin) !== -1) {  
				//console.log(['madster event allow',that.state])
				// poll login status
                if (event.data && event.data.check_login && that.state.userInitialised) {
					//console.log(['madster event check login'])
                	if (!checkActive) {
						checkActive = true
						that.useRefreshToken().then(function (user) {
							that.setUser(user)
							console.log('send user after check')
							console.log({user:that.state.user})
							event.source.postMessage({check_login_ok: true, user:that.state.user},event.origin)
							checkActive = false
							//if (user && user.username) 
							window.close()
						})
					}
                    
                }
                if (event.data && event.data.confirm_login && that.state.userInitialised) {
				    //console.log(['madster event confirm login'])
				    //if (!confirmLoginActive) {
						//confirmLoginActive = true
						//that.useRefreshToken().then(function (user) {
							//that.setUser(user)
							event.source.postMessage({confirm_login_ok:that.isLoggedIn() },event.origin)
							//confirmLoginActive = false
						//})
					//}
				}
                
                if (event.data && event.data.refresh_login && that.state.userInitialised) {
					//console.log(['madster event refresh login'])
					if (!refreshActive) { 
						//console.log(['madster event refresh login not active'])
						refreshActive = true
						that.useRefreshToken().then(function (user) {
							//console.log(['madster event got refresh token'])
							that.setUser(user)
							event.source.postMessage({user:user},event.origin)
							refreshActive = false
						})
					}
             	}
                // close window when location changes from an allowedPage
                //if (event.data && event.data.allowedPages && Array.isArray(event.data.allowedPages)) {
                    //var parts = window.location.href ? window.location.href.split("/") : []
                    //if (event.data.allowedPages.indexOf(parts[parts.length -1]) === -1) {
                           //window.close()
                    //}
                
                //}
                // logout message
                if (event.data && event.data.logout) {
					//console.log(['madster event logout'])
                    // send null unless token AND user are loaded
                    if (that.isLoggedIn()) that.logout(that.state.user.access_token)
                    event.source.postMessage({user: null},event.origin)
                }
                
                // login message
                if (event.data && event.data.login && event.data.username && event.data.password && that.state.userInitialised) {
					//console.log(['master event login userpass',event.data])
				    if (!loginActive) {
						console.log(['madster event userpass not active'])
						loginActive = true
                		that.signIn(event.data.username,event.data.password).then(function(result) {
							console.log(['madster event signed in',result])
							if (result) {
								if (result.error) {
									event.source.postMessage({login_fail: result.error},event.origin)
								} else {
									that.setUser(result.user)
									event.source.postMessage({login_success: true, user: result.user},event.origin)
								}
							}
							loginActive = false
							window.close()
						})
					}
                }
                
                // registration confirm message
                if (event.data && event.data.doconfirm && event.data.code && that.state.userInitialised) {
					//console.log(['master event confirm',event.data])
				    if (!confirmActive) {
						confirmActive = true
                		that.doConfirm(event.data.code).then(function(result) {
							if (result) {
								if (result.error) {
									event.source.postMessage({login_fail: result.error},event.origin)
								} else {
									that.setUser(result.user)
									event.source.postMessage({login_success: true, user: result.user},event.origin)
								}
							}
							confirmActive = false
							window.close()
						})
					}
                }
                
                // forgot password message
                if (event.data && event.data.doforgot && event.data.code && that.state.userInitialised) {
					//console.log(['master event forgot',event.data])
				    if (!forgotActive) {
						forgotActive = true
                		that.doForgot(event.data.code).then(function(result) {
							if (result) {
								if (result.error) {
									event.source.postMessage({login_fail: result.error},event.origin)
								} else {
									that.setUser(result.user)
									event.source.postMessage({login_success: true, user: result.user},event.origin)
								}
							}
							forgotActive = false
							window.close()
						})
					}
                }
            }
        
            
        }

        
    };
   
    submitWarning(warning) {
        let that=this;
        if (this.warningTimeout) clearTimeout(this.warningTimeout);
        this.setState({'warning_message':warning});
        this.warningTimeout = setTimeout(function() {
            that.setState({'warning_message':''});
        },6000);
    };
     
    isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) ? true : false
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    signIn(username,password) {
		let that = this;
		const axiosClient = getAxiosClient({});
		return new Promise(function(resolve,reject) {
			axiosClient.post(that.props.loginServer+'/api/signinajax',{
				username: username,
				password: password
			})
			.then(function(res) {
			  return res.data;  
			})
			.then(function(data) {
				if (data) {
					if (data.user && data.user.username && data.user.username.trim()) {
						resolve({user: data.user})
					} else if (data.error) {
						resolve({error: data.error})
					} 
				} else {
					resolve(null)
				}
				
			}).catch(function(err) {
				console.log(err);
				resolve(null)
				
			})
		})
	} 
	
	
	doConfirm(code) {
		let that = this
		//console.log(['master event do confirm',code])
		const axiosClient = getAxiosClient();
		return new Promise(function(resolve,reject) {
			axiosClient({
			  url: that.props.loginServer+'/api/doconfirm' + code,
			  method: 'get',
			}).then(function(res) {
				return res.data;  
			}).then(function(data) {
				if (data.user && data.user.username && data.user.username.trim()) {
					resolve({user: data.user})
				} else if (data.error) {
					resolve({error: data.error})
				} else {
					resolve()
				}
			}).catch(function(err) {
				console.log(err);
				resolve()
			});
		})
	 }
	 
	 doForgot(code) {
		let that = this
		//console.log(['master event do forgot',code])
		const axiosClient = getAxiosClient();
		return new Promise(function(resolve,reject) {
			axiosClient({
			  url: that.props.loginServer+'/api/dorecover' + code,
			  method: 'get',
			}).then(function(res) {
				return res.data;  
			}).then(function(data) {
				if (data.user && data.user.username && data.user.username.trim()) {
					resolve({user: data.user})
				} else if (data.error) {
					resolve({error: data.error})
				} else {
					resolve()
				}
			}).catch(function(err) {
				console.log(err);
				resolve()
			});
		})
	 }
	
	   
	
    useRefreshToken(refreshToken) {
        let that = this
        return new Promise(function(resolve,reject) {
            const axiosClient = getAxiosClient();
            // if we have a user loaded, use refresh token from memory
            // this is helpful where cookies are disabled to allow background login refresh
            // NOTE that without cookies, login does not persist through page reloads
            var query = refreshToken ? '?refresh_token='+refreshToken : ''
            axiosClient( {
              url: that.props.loginServer+'/api/refresh_token' + query,
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
                        },that.props.refreshInterval && that.props.refreshInterval > 0 ? that.props.refreshInterval : 8400) // 14 minutes
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
			 {this.state.warning_message && <div className='warning-message'   style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
      
			{this.props.children(Object.assign({},this.props,{user: this.state.user,userInitialised: this.state.userInitialised, setUser: this.setUser,getAxiosClient: getAxiosClient,getMediaQueryString: getMediaQueryString,getCsrfQueryString: getCsrfQueryString, isLoggedIn: this.isLoggedIn, loadUser: this.loadUser, useRefreshToken: this.useRefreshToken,logout: this.logout, allowedOrigins: this.state.allowedOrigins, submitWarning: this.submitWarning}))}
         </div>
    }
    
}
