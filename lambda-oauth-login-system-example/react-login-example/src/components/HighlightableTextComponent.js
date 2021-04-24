import React, {useRef} from 'react';
import {useState} from 'react';
import {Form, Modal, Button} from 'react-bootstrap'


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

const bullsEyeIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bullseye" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
  <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
</svg>


export default function HighlightableTextComponent(props) {
	const [fullScreen, setFullScreen] = useState(false)
	const [subject, setSubject] = useState(props.highlightValue)
	const [selection, setSelection] = useState(null)
	const inputRef = useRef();
	
	if (!props.readOnly) { 
		return <span style={{position:'relative'}}>
			<div style={{clear:'both'}}>
				{(!subject && !selection) && <Button style={{float: 'left'}} variant="secondary"  >{bullsEyeIcon}</Button>}
				{(!subject && selection) && <Button style={{float: 'left'}} variant="success" onClick={function(e) { if (selection) setSubject(selection); props.onChangeHighlight(selection); setSelection(null)}} >{bullsEyeIcon}</Button>}
				{(subject) && <Button style={{float: 'left'}} variant="info" onClick={function(e) { setSubject(selection) ; props.onChangeHighlight(selection);  setSelection(null)}} >{bullsEyeIcon} {subject.value}</Button>}
				
			</div>
			{props.allowFullScreen && <Button style={{float: 'left'}}  onClick={function(e) {console.log('FS'); setFullScreen(true)}} ><FullScreenIcon/></Button>}
			
						
			{<Modal dialogClassName="modal-90w"
			  show={fullScreen} onHide={function(e) {console.log('FS off'); setFullScreen(false)}}  >
				<Modal.Header closeButton>&nbsp;</Modal.Header>
			
				<Modal.Body >
						<Form.Control as='textarea'  rows={15}   value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />		
					
				 </Modal.Body>
			</Modal>}
		<input  ref={inputRef}  type="text" onSelect={function(e) {
			//console.log(inputRef.current.value); 
			//console.log(inputRef.current ? [inputRef.current.selectionStart,inputRef.current.selectionEnd] : null)
			var selection = (inputRef.current && inputRef.current.value) ? inputRef.current.value.substring(inputRef.current.selectionStart,inputRef.current.selectionEnd) : ''
			if (inputRef.current && inputRef.current.value && selection) {
				setSelection({
					start:inputRef.current.selectionStart,
					end:inputRef.current.selectionEnd,
					value:selection
				})
			} else {
				setSelection(null)
			}
		}} style={{float: 'left', width: '90%'}}  as='input' value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />		
		</span>
	  } else {
		  return <span>{props.value}</span>
	  }
}

	
