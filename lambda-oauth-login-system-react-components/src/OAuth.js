import React, { Component } from 'react';
import Login from './Login'
import {Link} from 'react-router-dom'
import {getAxiosClient} from './helpers'  

export default  class OAuth extends Component {
    
    constructor(props) { 
        super(props);
        this.state={authRequest:{}, loadingClients: false, clients: null, client: null};
        this.change = this.change.bind(this);
        this.cancelAuthRequest = this.cancelAuthRequest.bind(this);
        this.createAuthRequest = this.createAuthRequest.bind(this);
        this.approveAuthRequest = this.approveAuthRequest.bind(this);
     }
         
    change(e) {
        var state = {};
        if (e && e.target && e.target.name ) {
			state[e.target.name] =  e.target.value;
			this.setState(state);
		}
        return true;
    }
    
    cancelAuthRequest(e) {
		e.preventDefault();
		this.setState({authRequest:null})
		if (localStorage && localStorage.setItem) localStorage.setItem('auth_request','')
		window.location=this.props.loginServer
		return false;
	}
    
    approveAuthRequest(e) {
		if (localStorage && localStorage.setItem) {
			localStorage.setItem('auth_request','')
			localStorage.setItem('pending_auth_request',JSON.stringify(this.state.authRequest))
		}
		//this.setState({authRequest:null})
		window.location=this.props.loginServer
		return false;
	}
    
    componentDidUpdate(props) {
		let that = this
	    if (props.isLoggedIn()  && !this.state.loadingClients) {
			let params = that.props.location.search ? that.props.location.search.slice(1).split("&") : [];
			let paramsObject = {};
			params.map(function(keyAndData) {
				let parts = keyAndData.split("=");
				if (parts.length === 2) {
					paramsObject[parts[0]] = parts[1]
				}
				return null;
			})
		   this.setState({loadingClients: true})
	       var axiosClient = getAxiosClient(this.props.user.token.access_token)
           axiosClient.get(this.props.loginServer + '/api/oauthclients').then(function(results) {
			    that.createAuthRequest(paramsObject, results)
		   })
       }
    };
  
    componentDidMount() {
		let that = this;
        //if (this.props.userInitialised && !this.props.isLoggedIn()) {
           //this.props.history.push(this.props.linkBase + "/login");
       //} else {
			// extract request info
			let params = this.props.location.search ? this.props.location.search.slice(1).split("&") : [];
			let paramsObject = {};
			params.map(function(keyAndData) {
				let parts = keyAndData.split("=");
				if (parts.length === 2) {
					paramsObject[parts[0]] = parts[1]
				}
				return null;
			})
			//console.log(params)
			
			
			var axiosClient = getAxiosClient()
            axiosClient.get(this.props.loginServer + '/api/oauthclientspublic').then(function(results) {
			  
				that.createAuthRequest(paramsObject,results)

		   })
			
	}

  
    createAuthRequest(paramsObject,results) {
		//console.log(['CAR',paramsObject,results])
		let that = this
		var clientsIndex = {}
		var client = null
		// prep index
		if (results && results.data && Array.isArray(results.data)) {
			results.data.forEach(function(c) {
				if (c.clientId) clientsIndex[c.clientId] = c;
			})
		}
		// by parameter
		if (paramsObject.client && clientsIndex[paramsObject.clientId]) {
			client = clientsIndex[paramsObject.clientId]
			that.setState({'clients':results, client: client})
		// fall back to first
		} else if (results.data && results.data && results.data.length > 0) {
			client = results.data[0]
			that.setState({'clients':results, client: client})
		} 
		
		//var redirectUri = paramsObject.redirect_uri ? paramsObject.redirect_uri : 
		var firstRedirect = (client && Array.isArray(client.redirectUris) && client.redirectUris.length > 0) ? client.redirectUris[0] : ''
		
		var authRequest =  {
			redirect_uri: paramsObject.redirect_uri ? paramsObject.redirect_uri : firstRedirect,
			clientId: paramsObject.clientId ? paramsObject.clientId : client.clientId,
			clientSecret: paramsObject.clientSecret ? paramsObject.clientSecret : client.clientSecret,
			scope: paramsObject.scope ? paramsObject.scope : client.scope,
			state: paramsObject.state ? paramsObject.state : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		}
		//console.log({authRequest:authRequest})
		that.setState({authRequest:authRequest})
		localStorage.setItem('auth_request',JSON.stringify(authRequest))
	}
  
    // xhr processing chain
    checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    }


    parseJSON(response) {
      return response.json()
    }
    
    
    render() {
		let that = this
		
		if (this.state.client && this.props.isLoggedIn()) {
			var redirectUri = ''
			// use first configured redirect
			if (Array.isArray(this.state.client.redirectUris) && this.state.client.redirectUris.length > 0) redirectUri = this.state.client.redirectUris[0]
			return <div>
			<img src={this.state.client.clientImage} style={{height:'120px'}}  />
			<Link to={this.props.linkBase + '/profile'} ><div style={{float:'right', marginLeft:'1em'}}  className='btn btn-warning' >Signed in as {this.props.user ? this.props.user.avatar : ''}</div></Link>
			
			<h1>{this.state.client.name}</h1>
			{this.state.client.by && <div style={{fontWeight:'bold',float:'right'}} >by {this.state.client.by}</div>}
			{this.state.client.clientWebsite && <div>{this.state.client.clientWebsite}</div>}
			<h3 style={{clear:'both'}} >This app would like to:</h3>
			<hr/>
			<div>View your name and email address.</div>
			<hr/>
			<form  style={{width:'100%'}}  action={that.props.loginServer+'/api/authorize'} method="POST">
			<input type='hidden' name='response_type'  value='code' />
			<input type='hidden' name='client_id'  value={this.state.authRequest ? this.state.authRequest.clientId : ''}/>
			<input type='hidden' name='client_secret'  value={this.state.authRequest ? this.state.authRequest.clientSecret : ''}/>
			<input type='hidden' name='redirect_uri'  value={this.state.authRequest ? this.state.authRequest.redirect_uri : ''}/>
			<input type='hidden' name='state'  value={this.state.authRequest ? this.state.authRequest.state : ''}/>
			<input type='hidden' name='access_token'  value={this.props.user && this.props.user.token ? this.props.user.token.access_token : ''}/>
			<div style={{fontSize:'1.1em', clear:'both', width: '100%'}} className='row' >
				<div className='col-6' >
				<button  id="accept_oauth_button" onClick={this.approveAuthRequest} type='submit' style={{color: 'black', width:'100%', fontWeight: 'bold'}}  className='btn btn-block btn-lg  btn-success'  >&nbsp;Yes</button>
				</div>
				<div className='col-6' >
				<button  id="deny_oauth_button" style={{color: 'black', width:'100%', fontWeight: 'bold'}} className='btn  btn-block btn-lg  btn-danger' onClick={this.cancelAuthRequest} >&nbsp;No</button>
				</div>
			</div>
			</form>
			
			</div>
		} else if (this.state.client) {
			return <div>
				{this.state.client.by && <div style={{fontWeight:'bold',float:'right'}} >by {this.state.client.by}</div>}
				<h1>{this.state.client.name}</h1>
				{this.state.client.clientWebsite && <div>{this.state.client.clientWebsite}</div>}
				<h3 style={{clear:'both'}} >This app would like to:</h3>
				<hr/>
				<div>View your name and email address.</div>
				<hr/>
				<Login {...this.props} />
			</div>
		} else {
			return <div>Loading</div>
		}
		
          
    };
}

