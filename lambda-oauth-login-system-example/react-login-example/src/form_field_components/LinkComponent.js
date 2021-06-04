import React from 'react';
import {useState, useEffect} from 'react';
import {Form, Modal, Button} from 'react-bootstrap'
import './TextComponent.css'
import icons from '../icons'
const {editIcon} = icons

export default function LinkComponent(props) {
	const [fullScreen, setFullScreen] = useState(false)
	var modalInputRef = React.createRef()
	useEffect(function() {
		if (modalInputRef.current) modalInputRef.current.focus();
	})
	
	if (!props.readOnly) { 
		if (fullScreen) {
				
			return <span style={{position:'relative'}}>
				{<Modal dialogClassName="modal-90w"  
				
				  show={fullScreen} onHide={function(e) {console.log('FS off'); setFullScreen(false)}}  >
					<Modal.Header closeButton>&nbsp;
						
					</Modal.Header>
				
					<Modal.Body  >
					
							
					<textarea ref={modalInputRef} rows={15} cols={50}   type="text"  style={{float: 'left', width: '90%'}}   value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />	
					 </Modal.Body>
				</Modal>}
				
			</span>
		} else {
			if (props.editInline) {
				return <textarea rows={15} cols={50}   type="text"  style={{float: 'left', width: '90%'}}   value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />	
				
			} else {
				return <span onClick={ function(e) {setFullScreen(true)}}>{props.value ? props.value : <Button variant="success">{editIcon}</Button>}</span>
			}
				
		}
	  } else {
		  return <>{props.value && <a target="_new" href={props.value} >{props.value}</a>}</>
	  }
}

	
	
