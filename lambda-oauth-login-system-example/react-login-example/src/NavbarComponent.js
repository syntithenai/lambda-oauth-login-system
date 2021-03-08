import React  from 'react'; //, {Fragment, useState}
import {Button, Navbar} from 'react-bootstrap'
//import {Link} from 'react-router-dom'
import ExternalLoginButtons from './ExternalLoginButtons'

export default function NavbarComponent(props) {

    return <Navbar  bg="dark" variant="dark"  style={{width:'100%', border:''}} >
      <div style={{width:'100%'}}>   
            <ExternalLoginButtons isLoggedIn={props.isLoggedIn} doLogin={props.doLogin} doLogout={props.doLogout} doProfile={props.doProfile} />
         
        </div>
        
    </Navbar>

}
