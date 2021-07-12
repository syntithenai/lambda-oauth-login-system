/* global window */
import  React,{ Component } from 'react';
import {Redirect, Link} from 'react-router-dom'
import {getAxiosClient} from './helpers'  

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class DoConfirm extends Component {
	
	constructor(props) {
        super(props);
        this.state={redirect: null, error: null};
    }
    
    componentDidMount() {
		//console.log(['DOCONF',window.location,window.hash])
		var parts = window.location.href.split("?")
		var searchString = parts.length > 1 ? parts[1] : ''
		let that = this
		if (that.props.startPollConfirmSuccess) {
			that.props.startPollConfirmSuccess(window.location.search)
		} else {
			const axiosClient = getAxiosClient();
			axiosClient({
			  url: that.props.loginServer+'/api/doconfirm?' + searchString,
			  method: 'get',
			}).then(function(res) {
				return res.data;  
			}).then(function(data) {
				if (data.user && data.user.username && data.user.username.trim()) {
					that.props.setUser(data.user)
					that.setState({redirect:that.props.loginRedirect})
				}
				if (data.error) that.setState({error: data.error})
			}).catch(function(err) {
				console.log(err);
			});
		}
	}
 
    render() {
		if (this.state.redirect) {
			return <Redirect to={this.state.redirect} />
		} else if (this.state.error) {
			return <b>
				{window.opener && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}} id="close_button"> Close</button>}     
				{this.state.error}
			</b>
		} else {
			return <b>Checking login</b>
		}
		
		
    }
}
