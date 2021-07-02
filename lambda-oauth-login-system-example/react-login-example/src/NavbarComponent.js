import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button, Navbar, Dropdown} from 'react-bootstrap'
import {Link, useLocation} from 'react-router-dom'
import {getAxiosClient} from './helpers'  

export default function NavbarComponent(props) {
					
    return <Navbar  bg="dark" variant="dark"  style={{zIndex: 9999, width:'100%', border:'', position: 'fixed', top: 0, left: 0}} >
      <div style={{width:'100%'}}>   
            <React.Fragment>
				
				{props.loginCheckActive && <span><Link to="/login/login" ><Button style={{float:'right'}} variant="warning" id="nav_login_button" >{'Checking Login'}</Button></Link></span>}
				
				{(!props.loginCheckActive && props.isLoggedIn()) && 
					<span>
						{props.queueActive && <Button   variant="disabled" >Saving</Button>}
						{(props.itemsQueued && !props.queueActive) && <Button   variant="disabled" >Changed</Button>}
						<Link to="/login/logout" ><Button  style={{float:'right'}} variant="danger" id="nav_logout_button" >{'Logout'}</Button></Link>
						<Link to="/login/profile" ><Button style={{float:'right'}} variant="primary" id="nav_profile_button" >{'Profile'}</Button></Link>
					</span>
				}
				{(!props.loginCheckActive && !props.isLoggedIn()) && 
					<Link to="/login/login" ><Button  style={{float:'right'}}  variant="success"  id="nav_login_button" >{'Login'}</Button></Link>
				}
				
				
			</React.Fragment>
		
        </div>
        
    </Navbar>

}
         
