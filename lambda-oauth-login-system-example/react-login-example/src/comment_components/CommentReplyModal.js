import React,{useEffect, useState} from 'react'; //, {Fragment, useState}
import {Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable, addLeadingZeros} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from '../components/ItemForm'
import TextareaComponent from '../form_field_components/TextComponent'

import icons from '../icons'
const {deleteIcon, editIcon, replyIcon} = icons
						

const CommentReplyModal = function({item,showReplyModal, setShowReplyModal,  rows, cols, createNewFromSibling}) {
	//var modalInputRef = React.createRef()
	//useEffect(function() {
		//if (modalInputRef.current) {
			//modalInputRef.current.focus();
		//}
	//})
	const [replyText,setReplyText] = useState('')
	return <span style={{position:'relative'}}>
				{<Modal dialogClassName="modal-90w"  
				
				  show={showReplyModal} onHide={function(e) { setShowReplyModal(false)}}  >
					<Modal.Header closeButton>&nbsp;
						<b>Reply to comment</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button variant="success" onClick={function(e) {
							var data = Object.assign({},item,{comment:replyText,_id:null, parentComment: item._id, isFullScreen: true})
							//console.log([item.createNewFromSibling,data])
							createNewFromSibling(data)
							setShowReplyModal(false)
						}} >Save</Button>&nbsp;&nbsp;&nbsp;
						<Button variant="danger" onClick={function(e) {
							setShowReplyModal(false)
							setReplyText('')
						}} >Cancel</Button>
					</Modal.Header>
				
					<Modal.Body  >
						<textarea  rows={rows ? rows : 15} cols={cols ? cols : 50}   type="text"  style={{float: 'left', width: '90%'}}   value={replyText ? replyText : ''} onChange={function(e) {setReplyText(e.target.value)}} />	
					 </Modal.Body>
				</Modal>}
				
			</span>
}
export default CommentReplyModal
