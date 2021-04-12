import React  from 'react'; //, {Fragment, useState}
import {Button, Navbar, Dropdown} from 'react-bootstrap'
import {Link} from 'react-router-dom'
//import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  
//import useRestEndpoint from './useRestEndpoint'

export default function NavbarComponent(props) {

//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
						
    return <Navbar  bg="dark" variant="dark"  style={{zIndex: 9999, width:'100%', border:'', position: 'fixed', top: 0, left: 0}} >
      <div style={{width:'100%'}}>   
            <React.Fragment>
				{props.loginCheckActive && <span><Link to="/login/login" ><Button style={{float:'right'}} variant="warning"  >{'Checking Login'}</Button></Link></span>}
				
				{(props.isLoggedIn()) && <Dropdown style={{zIndex:9999, float:'left'}}>
				  <Dropdown.Toggle style={{zIndex:9999}}  variant="success" id="dropdown-basic">

				  </Dropdown.Toggle>

				  <Dropdown.Menu style={{zIndex:9999}} >
					<Dropdown.Item href="#/questions">Editor</Dropdown.Item>
					<Dropdown.Item  href="#/login/profile">Profile</Dropdown.Item>
					
				  </Dropdown.Menu>
				</Dropdown>}
				
				{(!props.loginCheckActive && props.isLoggedIn()) && 
					<span>
						
						
						{props.queueActive && <Button   variant="disabled" >Saving</Button>}
						{(props.itemsQueued && !props.queueActive) && <Button   variant="disabled" >Changed</Button>}
						<Link to="/login/profile" ><Button style={{float:'right'}} variant="primary"  >{'Profile'}</Button></Link>
						<Link to="/login/logout" ><Button  style={{float:'right'}} variant="danger"  >{'Logout'}</Button></Link>
					</span>
				}
				{(!props.loginCheckActive && !props.isLoggedIn()) && 
					<Link to="/login/login" ><Button  style={{float:'right'}}  variant="success"  >{'Login'}</Button></Link>
				}
				
			</React.Fragment>
		
        </div>
        
    </Navbar>

}
         
