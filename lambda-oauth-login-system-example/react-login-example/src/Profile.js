import React, { Component } from 'react';
import {FaSignOutAlt as LogoutButton} from 'react-icons/fa';
import {FaSave as SaveButton} from 'react-icons/fa';
import {Link,Redirect} from 'react-router-dom'
import {scrollToTop} from './helpers'  
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

 
export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.saveUserReal = this.saveUserReal.bind(this);
        this.state = {
            warning_message: '',
            redirect: ''
        }
        this.redirTimeout = null
    };
    
      
    change(e) {
        let state = {...this.props.user};
        var key = e.target.name;
        if (e.target.name.startsWith('fake_')) {
            key = e.target.name.slice(5);
        }
        state[key] =  e.target.value;
        this.props.setUser(state);
        return true;
    };
    
    
    saveUser(e) {
        e.preventDefault();
        this.saveUserReal(this.props.user);
        return false;
    };
    
     saveUserReal(user) {
        let that = this
        return new Promise(function(resolve,reject) {
             if (that.props.startWaiting) that.props.startWaiting();
             if (user && user.token && user.token.access_token) {
                 const axiosClient = getAxiosClient(user.token.access_token);
                 axiosClient({
                  url: that.props.authServerHostname + that.props.authServer+'/saveuser',
                  method: 'post',
                  data: user
                }).then(function(res) {
                    if (that.props.stopWaiting) that.props.stopWaiting();
                    return res.data;  
                }).then(function(data) {
                    if (data.error) {
                            that.submitWarning(data.error);
                  } else {
                        if (data.message) {
                            that.submitWarning(data.message);
                        } 
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
         })
         
    };
    
    componentDidMount() {
        let that = this;
		scrollToTop();
	};
     
    submitWarning(warning) {
        let that=this;
        clearTimeout(this.timeout);
        this.setState({'warning_message':warning});
        this.timeout = setTimeout(function() {
            that.setState({'warning_message':''});
        },6000);
    };
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } 
        let that = this;
		if (this.props.user) {
          return (
            <div> 
                
               
                
                <form method="POST" onSubmit={this.saveUser} autoComplete="false" >
                    <div className="form-group" style={{width: '70%',marginLeft:'4em'}} >
                
                            <h3  style={{textAlign: 'left'}} >Profile</h3>
                            {this.state.warning_message && <div className='warning-message'  style={{padding: '1em', border: '1px solid darkpink', backgroundColor:'pink'}}  >{this.state.warning_message}</div>}
         
                               <label htmlFor="username" className='row'>Email </label><input autoComplete="false" id="username" readOnly={true} type='text' name='username' onChange={this.change} value={this.props.user ? this.props.user.username: ''}   className="form-control" />
                                
                                <label htmlFor="name" className='row'>Name </label><input autoComplete="false" id="name" type='text' name='name' onChange={this.change} value={this.props.user ? this.props.user.name : ''} className="form-control" />
                                <label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="false" id="avatar" type='text' name='avatar' onChange={this.change} value={this.props.user ? this.props.user.avatar: ''}  className="form-control" />
                                
                            
                                <label htmlFor="password" className='row'>Password</label> <input  autoComplete="false" id="password" type='password' name='fake_password' onChange={this.change}    className="form-control"  />
                                <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="false" id="password2" type='password' name='fake_password2' onChange={this.change}   className="form-control" />
                                <input id="id" type='hidden' name='_id' value={this.props.user ? this.props.user._id : ''} />
                                <br/>
                                <br/>
                                <button  className='btn btn-lg btn-success btn-block'><SaveButton/> Save</button>
                   
                </div>
                </form></div>
                    
            )
        } else return <b></b>;
    };
}
