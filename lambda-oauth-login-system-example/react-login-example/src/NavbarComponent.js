import React  from 'react'; //, {Fragment, useState}
import {Button, Navbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function NavbarComponent(props) {

    return <Navbar  bg="dark" variant="dark"  style={{width:'100%', border:''}} >
      <div style={{width:'100%'}}>   
            <React.Fragment>
				{props.isLoggedIn() && 
					<span>
						<Link to="/profile" ><Button style={{float:'right'}} variant="primary"  >{'Profile'}</Button></Link>
						<Link to="/" ><Button  style={{float:'right'}} variant="danger" onClick={props.doLogout}  >{'Logout'}</Button></Link>
					</span>
				}
				{ !props.isLoggedIn() && 
					<Link to="/profile" ><Button  style={{float:'right'}}  variant="success" onClick={props.doLogin} >{'Login'}</Button></Link>
				}
			</React.Fragment>
		
        </div>
        
    </Navbar>

}
         
