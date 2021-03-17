/* esslint-disable */ 

import React, { Component } from 'react';
import {Link,Redirect} from 'react-router-dom' //BrowserRouter as Router,Route,

import {scrollToTop} from './helpers'  
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

export default  class ForgotPassword extends Component {
    
    constructor(props) {
        super(props);
        this.state={signin_username:'',signin_password:'',rememberme:false};
        this.change = this.change.bind(this);
        this.submitWarning = this.submitWarning.bind(this)
    };
    
    componentDidMount() {
		scrollToTop();
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
    
    recoverPassword(email,password,password2) {
        let that = this;
        that.submitWarning('');
        if (this.props.startWaiting) this.props.startWaiting();
        const axiosClient = getAxiosClient();
        axiosClient({
          url: that.props.loginServer+'/api/recover',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            email: email,
            password: password,
            password2: password2,
            code: Math.random().toString(36).replace(/[^a-z]+/g, ''),
            apiUrl: window.location.origin + window.location.pathname,
            linkBase: this.props.linkBase
          }
        })
      .then(function(res) {
            return res.data;  
		  })
       .then(function(data) {
            if (that.stopWaiting) that.props.stopWaiting();
       // else 
            if (data.message) {
                that.submitWarning(data.message);
            }
            if (data.error) {
                that.submitWarning(data.error);
            }
            
      }).catch(function(error) {
        //console.log(['recover request failed', error])
      });
        return false;
    };
  
  
// 
    render() {
        let that = this
           return  <div>
			{window.opener && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}> Close</button>}     
         
         <Link to={this.props.linkBase + "/register"} style={{clear:'both',display:'inline'}} ><div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Register</div></Link>
         
         { this.props.hideButtons !== true  && <Link to={this.props.linkBase + "/login"} style={{clear:'both',display:'inline'}} ><div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Login</div></Link>}
          
        
           <form className="form-signin" onSubmit={(e) => {e.preventDefault(); this.recoverPassword(this.state.email,this.state.password,this.state.password2); return false} }>
        
            
          <h1 className="h3 mb-3 font-weight-normal" style={{textAlign:'left'}}>Password Recovery</h1>
           
          {this.state.warning_message && <div className='warning-message'   style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
         
                                           
          <fieldset className='col-12' >
				<label htmlFor="email" className='row'>Email </label><input  autoComplete='signin_email'  id="email" type='email' name='email' onChange={this.change} />
				<label htmlFor="password" className='row'>New Password</label> <input  autoComplete="off"  id="password" type='password' name='password' onChange={this.change} />
				<label htmlFor="password2" className='row'>Repeat New Password</label><input  autoComplete="off"  id="password2" type='password' name='password2' onChange={this.change} />
				<br/>
				<br/>
				<button className="btn btn-lg btn-success btn-block" type="submit">Send Recovery Email</button>  

			</fieldset>
        </form>
       </div>
    };
}
  

