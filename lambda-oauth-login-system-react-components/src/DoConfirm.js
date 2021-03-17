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
		let that = this
		const axiosClient = getAxiosClient();
		axiosClient({
		  url: that.props.loginServer+'/api/doconfirm' + window.location.search,
		  method: 'get',
		}).then(function(res) {
			return res.data;  
		}).then(function(data) {
			if (data.user && data.user.username && data.user.username.trim()) {
				that.props.setUser(data.user)
				that.props.setIframeUser(data.user)
				that.setState({redirect:that.props.loginRedirect})
			}
			if (data.error) that.setState({error: data.error})
		}).catch(function(err) {
			console.log(err);
		});

	}
 
    render() {
		if (this.state.redirect) {
			//window.location.search = ''
			return <Redirect to={this.state.redirect} />
		} else if (this.state.error) {
			return <b>
				{window.opener && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}> Close</button>}     
				{this.state.error}
			</b>
		} else {
			return <b>Checking confirmation</b>
		}
		
		
    }
}
