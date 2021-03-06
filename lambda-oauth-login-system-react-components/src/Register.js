
import {scrollToTop} from './helpers'  

import React, { Component } from 'react';
import {Link,Redirect} from 'react-router-dom'
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  
import RegistrationConfirmation from './RegistrationConfirmation'
var faker = require('faker');
         
export default class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state={
			show_confirm: false,
            warning_message:'',
            signin_warning_message:'',
            signup_warning_message:'',
            email_login:'',
            password_login:'',
            name:'',
            email:'',
            password:'',
            password2:'',
            justSignedUp: false,
            forgotPassword: false,
            avatar: faker.commerce.productAdjective()+faker.name.firstName()+faker.name.lastName()
        }
        
        this.change = this.change.bind(this);
        this.submitWarning = this.submitWarning.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
        this.submitSignUpReal = this.submitSignUpReal.bind(this);
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
    
    submitSignUp(e) {
        e.preventDefault();
        this.submitSignUpReal(this.state.name,this.state.avatar,this.state.email,this.state.password,this.state.password2);
        return false;
    };
    
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
    
    submitSignUpReal(name,avatar,email,password,password2) {
	   var that=this;
       this.submitWarning('');
       if (this.props.startWaiting) this.props.startWaiting();
       const axiosClient = getAxiosClient();
       axiosClient( {
          url: that.props.loginServer+'/api/signup',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            name: name,
            avatar: avatar,
            username: email,
            password: password,
            password2: password2,
            //apiUrl: window.location.origin + window.location.pathname,
            // optional react router parent path
            linkBase: that.props.linkBase
          }
        })
        .then(function(res) {
            return res.data;  
          })
          .then(function(data) {
			  
			  if (that.props.stopWaiting) that.props.stopWaiting();
			  if (data.error) {
						that.submitWarning(data.error);
			  } else {
					that.setState({showConfirm: true})
			  }
		  }).catch(function(error) {
			console.log(['request failed', error]);
		  });
    }; 
    
    render() {
        let that = this;
        return (
            <div id="registrationform" >
                { this.state.showConfirm && <RegistrationConfirmation/> }
                { !this.state.showConfirm && <div style={{paddingLeft:'1em',clear:'both'}}>       
                    <form className="col-lg-12" style={{minWidth: '400px'}} method="POST" onSubmit={(e) => this.submitSignUp(e)}  >
                      
                      <div className="form-group">
                        {window.opener && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
                         Close</button>}
                         
                         <Link to={this.props.linkBase + "/forgot"} ><div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Forgot Password</div></Link>
                           {this.props.hideButtons !== true && <Link to={this.props.linkBase + "/login"} style={{clear:'both',display:'inline'}} ><div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Login</div></Link>}
                           
                            <h3 style={{textAlign:'left'}} className="card-title">Registration</h3>
                         
                         {this.state.warning_message && <div className='warning-message'  style={{position:'fixed', top: 100, left:100, padding: '1em', border: '1px solid red', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
         
                            
                            <div style={{textAlign:'left'}}>
                            <b>By registering, you are agreeing to our <Link to={this.props.linkBase + "/privacy"}  style={{clear:'both',display:'inline'}} ><div  id="privacy_button" style={{ marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-warning' >Terms and Conditions</div></Link></b>
                            <br/>
                              
                            </div>
                             
                            </div>
                            
                                <label htmlFor="name" style={{float:'left'}}>Name</label><input className='form-control' autoComplete="false" id="name" type='text' value={this.state.name} name='name' onChange={this.change} />
                                <label htmlFor="avatar" className='row'>Avatar </label><input className='form-control' autoComplete="false" id="avatar" type='text'  name='avatar' value={this.state.avatar} onChange={this.change} />
                                <label htmlFor="email" className='row'>Email </label><input className='form-control' autoComplete="false" id="email" type='text' name='email' value={this.state.email} onChange={this.change} />
                                <label htmlFor="password" className='row'>Password</label> <input value={this.state.password} className='form-control' autoComplete="false"  id="password" type='password' name='password' onChange={this.change} />
                                <label htmlFor="password2" className='row'>Repeat Password</label><input className='form-control'  autoComplete="false"  id="password2" type='password' name='password2' value={this.state.password2} onChange={this.change} />
                            
                             <br/>
                            <button id="register_button" className='btn btn-lg btn-success btn-block'>Register</button>
                    </form>
                </div>
              }
            </div>
        )
    }
}
