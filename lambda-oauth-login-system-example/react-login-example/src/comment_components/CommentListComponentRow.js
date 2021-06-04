import React,{useEffect, useState} from 'react'; //, {Fragment, useState}
import {Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable, addLeadingZeros} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from '../components/ItemForm'
import TextareaComponent from '../form_field_components/TextComponent'
import CommentReplyModal from './CommentReplyModal'

import icons from '../icons'
const {deleteIcon, editIcon, replyIcon} = icons
						


export default function CommentListComponentRow(props) {
	let updatedDate = new Date(props.item.updated_date)
	let updatedDateString = updatedDate.getDate() + "-" + addLeadingZeros(updatedDate.getMonth() + 1) + "-" + addLeadingZeros(updatedDate.getFullYear()) + " " + addLeadingZeros(updatedDate.getHours()) + ":" + addLeadingZeros(updatedDate.getMinutes()) 
				
	const [showReplyModal,setShowReplyModal] = useState(false)
	//const [replyText,setReplyText] = useState('')
	//var replyText=''
	//function setReplyText(val) {
		//replyText = val
	//}
				
	return showReplyModal ? <CommentReplyModal {...props}  showReplyModal={showReplyModal} setShowReplyModal={setShowReplyModal} /> :  <div className="List-Item" >
			{(props.item && props.item._id) && 
				<div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (props.index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={props.item._id}><div style={{clear:'both'}} >
					
					{props.editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) props.doDeleteItem(props.item,props.index)} } >{deleteIcon}</Button>}
				
					{(props.editable && props.editUrl) && <Link to={props.editUrl +props.item._id} ><Button style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
					
					<span>
							<Button key="info" variant="info"  style={{float:'left'}} title={ 'Block'} ><b>{updatedDateString}</b> &nbsp;{props.item.userAvatar ? ' by ' + props.item.userAvatar : ''}</Button> 
							<Button key="reply" variant="success" style={{float:'left', marginLeft:'0.2em'}} onClick={function(e) {
								setShowReplyModal(true)
							}} title={ 'Reply'} >{replyIcon}</Button>
					</span>
									
					
				</div>
				
				
				<div style={{clear:'both', width:'100%'}}>
					<ItemForm editable={isEditable(props.item,props.user)} item={props.item} itemkey={props.index} {...props} />
					{Array.isArray(props.item.children) && <div style={{marginLeft:'1em', marginBottom:'2em'}}><b>Replies</b>{props.item.children.map(function(child) {
						let updatedDateString = ''
						if (child.updated_date) {
							let updatedDate = new Date(child.updated_date)
							updatedDateString = updatedDate.getDate() + "-" + addLeadingZeros(updatedDate.getMonth() + 1) + "-" + addLeadingZeros(updatedDate.getFullYear()) + " " + addLeadingZeros(updatedDate.getHours()) + ":" + addLeadingZeros(updatedDate.getMinutes()) 
						}
						var replyEditable = isEditable(child,props.user)
						return <div>
							<Button><b>{updatedDateString}</b>&nbsp;by&nbsp;{child.userAvatar}</Button>
							{replyEditable && <Button title="Delete"  style={{zIndex:99999, float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) props.doDeleteItem(child,child.itemindex)} } >{deleteIcon}</Button>}
						
							
							&nbsp;&nbsp;
							{!replyEditable && child.comment}
							{replyEditable && <TextareaComponent isFullScreen={child.isFullScreen} editInline={true} allowFullScreen={true} value={child.comment} onChange={function(value) {
								console.log([value,props.saveField]) 
								props.saveField('comment',value,child,child.itemkey)
							 }}  />}
							
						</div>
				  })}</div>}
				</div>
				
				
			</div>
			}	
				
	  </div>
	//}
}
