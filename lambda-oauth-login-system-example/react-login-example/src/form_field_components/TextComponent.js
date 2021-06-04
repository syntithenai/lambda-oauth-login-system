import React from 'react';
import {useState, useEffect} from 'react';
import {Form, Modal, Button} from 'react-bootstrap'
import './TextComponent.css'
import icons from '../icons'
const {editIcon} = icons


//const FullScreenIcon = function(props) { return (fullScreenIcon)}

export default function TextComponent(props) {
	const [fullScreen, setFullScreen] = useState(false)
	const [fullText, setFullText] = useState(false)
	var modalInputRef = React.createRef()
	useEffect(function() {
		if (modalInputRef.current) {
			modalInputRef.current.focus();
			var l = props.value ? props.value.length : 0
			modalInputRef.current.setSelectionRange(l,l)
		}
	})
	
	function splitNewlinesToDivs(text) {
		return <>{text && text.split("\n").map(function(chunk,k) {return <div style={{fontWeight: (props.highlightFirstLine && k===0 ? 'bold' : 'normal')}}>{chunk}</div>} ) }</>
	}

	if (!props.readOnly) { 
		if (fullScreen) {
				
			return <span style={{position:'relative'}}>
				{<Modal dialogClassName="modal-90w"  
				
				  show={fullScreen} onHide={function(e) {console.log('FS off'); setFullScreen(false)}}  >
					<Modal.Header closeButton>&nbsp;
						
					</Modal.Header>
				
					<Modal.Body  >
					
							
					<textarea ref={modalInputRef} rows={props.rows ? props.rows : 15} cols={props.cols ? props.cols : 50}   type="text"  style={{float: 'left', width: '90%'}}   value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />	
					 </Modal.Body>
				</Modal>}
				
			</span>
		} else {
			if (props.editInline) {
				return <input type="text"    type="text"  style={{float: 'left', width: '90%'}}   value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />	
			} else {
				return <span onClick={ function(e) {setFullScreen(true)}}>{props.value ? splitNewlinesToDivs(props.value) : <Button variant="success">{editIcon}</Button>}</span>
			}
				
		}
	  } else {
		  return <span  >
				{fullText ? splitNewlinesToDivs(props.value) : ((props.value && props.value.split) ? props.value.split("\n")[0].replace("."," ") : '')}
				{(props.value && props.value.split && props.value.split("\n").length > 1 ? <>&nbsp;&nbsp;&nbsp;{!fullText && <Button onClick={ function(e) {setFullText(!fullText)}} variant={fullText ? 'warning' : 'info'} >{fullText ? 'Less Info' : 'More Info'}</Button>}</> : '') }
		  </span>	
	  }
}

	
