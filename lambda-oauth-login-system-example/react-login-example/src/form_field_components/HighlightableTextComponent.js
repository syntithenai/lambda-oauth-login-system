import React, {useRef} from 'react';
import {useState, useEffect} from 'react';
import {Form, Modal, Button} from 'react-bootstrap'
import './HighlightableTextComponent.css'

import icons from '../icons'
const {bullsEyeIcon, editIcon} = icons



//const FullScreenIcon = function(props) { return (fullScreenIcon)}

export default function HighlightableTextComponent(props) {
	const [fullScreen, setFullScreen] = useState(false)
	const [subject, setSubject] = useState(props.highlightValue)
	const [selection, setSelection] = useState(null)
	const inputRef = useRef();
	//var modalInputRef = useRef()
	useEffect(function() {
		if (inputRef.current) {
			inputRef.current.focus();
			var l = props.value ? props.value.length : 0
			inputRef.current.setSelectionRange(l,l)
		}
	},[])
	
	function splitNewlinesToDivs(text) {
		return <>{text && text.split("\n").map(function(chunk,k) {return <div style={{fontWeight: (props.highlightFirstLine && k===0 ? 'bold' : 'normal')}}>{chunk}</div>} ) }</>
	}
	if (!props.readOnly) { 
		if (fullScreen) {
				
			return <span style={{position:'relative'}}>
				{<Modal dialogClassName="modal-90w"  
				
				  show={fullScreen} onHide={function(e) {console.log('FS off'); setFullScreen(false)}}  >
					<Modal.Header closeButton>&nbsp;
						<div style={{clear:'both'}}>
						{(!subject && !selection) && <Button style={{float: 'left'}} variant="secondary"  >{bullsEyeIcon}</Button>}
						{(!subject && selection) && <Button style={{float: 'left'}} variant="success" onClick={function(e) { if (selection) setSubject(selection); props.onChangeHighlight(selection); setSelection(null)}} >{bullsEyeIcon}</Button>}
						{(subject) && <Button style={{float: 'left'}} variant="info" onClick={function(e) { setSubject(selection) ; props.onChangeHighlight(selection);  setSelection(null)}} >{bullsEyeIcon} {subject.value}</Button>}
						
						</div>
					</Modal.Header>
				
					<Modal.Body  >

					<textarea rows={15} cols={50} ref={inputRef}  type="text" onSelect={function(e) {
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
							
					
						
					 </Modal.Body>
				</Modal>}
				
			</span>
		} else {
			return <span onClick={ function(e) {setFullScreen(true)}}>{props.value ? splitNewlinesToDivs(props.value) : <Button variant="success">{editIcon}</Button>}</span>
			if (props.editInline) {
				return <textarea  rows={15} cols={50} ref={inputRef}  type="text" onSelect={function(e) {
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
			} else {
				return <span onClick={ function(e) {setFullScreen(true)}}>{props.value ? splitNewlinesToDivs(props.value) : 'Click to edit'}</span>
			}	
		}
	  } else {
		  return <span>{splitNewlinesToDivs(props.value)}</span>
	  }
}

	
