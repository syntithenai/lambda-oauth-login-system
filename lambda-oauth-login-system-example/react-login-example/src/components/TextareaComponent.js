import React,{useState} from 'react';
//import {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap'
import './TextareaComponent.css'
//import FullScreenIcon from '../images/fullscreen.svg'

const FullScreenIcon = function(props) { return (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M1.464 10.536a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3.5a.5.5 0 01-.5-.5v-3.5a.5.5 0 01.5-.5z" clipRule="evenodd">
      </path>
      <path fillRule="evenodd" d="M5.964 10a.5.5 0 010 .707l-4.146 4.147a.5.5 0 01-.707-.708L5.257 10a.5.5 0 01.707 0zm8.854-8.854a.5.5 0 010 .708L10.672 6a.5.5 0 01-.708-.707l4.147-4.147a.5.5 0 01.707 0z" clipRule="evenodd">
      </path>
      <path fillRule="evenodd" d="M10.5 1.5A.5.5 0 0111 1h3.5a.5.5 0 01.5.5V5a.5.5 0 01-1 0V2h-3a.5.5 0 01-.5-.5zm4 9a.5.5 0 00-.5.5v3h-3a.5.5 0 000 1h3.5a.5.5 0 00.5-.5V11a.5.5 0 00-.5-.5z" clipRule="evenodd">
      </path>
      <path fillRule="evenodd" d="M10 9.964a.5.5 0 000 .708l4.146 4.146a.5.5 0 00.708-.707l-4.147-4.147a.5.5 0 00-.707 0zM1.182 1.146a.5.5 0 000 .708L5.328 6a.5.5 0 00.708-.707L1.889 1.146a.5.5 0 00-.707 0z" clipRule="evenodd">
      </path>
      <path fillRule="evenodd" d="M5.5 1.5A.5.5 0 005 1H1.5a.5.5 0 00-.5.5V5a.5.5 0 001 0V2h3a.5.5 0 00.5-.5z" clipRule="evenodd">
      </path>
    </svg>)}


export default function TextareaComponent(props) {
	const [fullScreen, setFullScreen] = useState(false)
	return <span>
		{props.allowFullScreen && <Button style={{float:'right'}} onClick={function(e) {console.log('FS'); setFullScreen(true)}} ><FullScreenIcon/></Button>}
		{<Modal dialogClassName="modal-90w"
          show={fullScreen} onHide={function(e) {console.log('FS off'); setFullScreen(false)}}  >
			<Modal.Header closeButton>&nbsp;</Modal.Header>
        
			<Modal.Body > 
				<Form.Control as='textarea'  rows={15}  value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />		
			 </Modal.Body>
		</Modal>}
	<Form.Control   as='textarea' rows={props.rows > 0 ? props.rows : 4}  type='text' value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />		
	</span>
}

	
