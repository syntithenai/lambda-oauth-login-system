import commentsMeta from '../formMeta/commentsMeta'
import {addLeadingZeros} from '../helpers'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import icons from '../icons'
import CommentListComponentRow from '../comment_components/CommentListComponentRow'

const {viewIcon, replyIcon} = icons

export default function(loginContext) {
	const commentsProps = {
			modelType: 'comments',
			//collateOn: 'parentComment',
			fieldMeta: commentsMeta,
		    defaultSort: {updated_date:-1},
		    sort: 'sort',
			parentField: 'question',
			autoRefresh: true,
			matchUrl: '/discuss',
		 
			createIndexes : {
				question: function(item) {return item ? [item.question,item._id] : []},
				questionTopic: function(item) {return item ? [item.questionTopic,item._id] : []},
			 },
			//autoSaveDelay: '3000',
			createItem: function(item,index) {
				return Object.assign({},item,{ access:'public', userAvatar : loginContext.user ? loginContext.user.avatar : '', questionTopic: item ? item.quiz : '',  questionText: item.question_full })//, topic: value.quiz 
			 },
			 createItemFromSibling: function(sibling,item) {
				return Object.assign({},sibling,{ comment:item.comment ? item.comment : '',userAvatar : loginContext.user ? loginContext.user.avatar : '',_id:null },item)//, topic: value.quiz 
			 },
			
			listItemComponent: CommentListComponentRow,
			//createIndexes: {questions: function(item) {return [item.question,item._id]}}
		    minimumBatchSize: 200,
		    threshold: 10,
			useCategorySearch: "questionTopic",
		    buttons:[ function(item) { 
				 //console.log(['BC',item,item ? item.itemkey : 'none',item,item.created_date])
				 let currentDatetime = new Date(item.created_date)
				 let createdDate = currentDatetime.getDate() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getFullYear()) + " " + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes()) 
				 return (!item || !item.created_date) ? null : <span key={item.itemkey} >
						<Button key="info" variant="info"  style={{float:'left'}} title={ 'Block'} ><b>{createdDate}</b> &nbsp;{item.userAvatar ? ' by ' + item.userAvatar : ''}</Button> 
						<Button key="reply" variant="success" style={{float:'left', marginLeft:'0.2em'}} onClick={function(e) {
							var data = Object.assign({},item,{_id:null, comment:'',parentComment: item._id})
							console.log(['REPLY',item.createNew,data])
							if (item.setShowNewItemModal) item.setShowNewItemModal(true)
							//if (item.createNewFromSibling) item.createNewFromSibling(item, item.itemkey + 1);  else console.log(commentsProps) ; 
							}} title={ 'Reply'} >{replyIcon}</Button>
						<span>&nbsp;&nbsp;&nbsp;
							<b>{item.questionTopic ? item.questionTopic : ''}</b>
						</span>
						{item.question && <div style={{width:'100%', clear:'both'}} >
							<Link to={"/search/"+item.question} >{item.questionText ? item.questionText : ''}</Link></div>}
					</span>
				}
			]
										
	}
	return commentsProps
}
