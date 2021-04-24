
import CheckboxComponent from '../components/CheckboxComponent'
import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../components/MediaEditorComponent'
import RatingsComponent from '../components/RatingsComponent'
import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
import TextareaComponent from '../components/TextareaComponent'
import SelectComponent from '../components/SelectComponent'
import ItemListComponent from '../components/ItemListComponent'
import LinkComponent from '../components/LinkComponent'
import HighlightableTextComponent from '../components/HighlightableTextComponent'
// eslint-disable-next-line
import questionMnemonicMeta from './questionMnemonicMeta'
// eslint-disable-next-line
import questionCommentMeta from './questionCommentMeta'
// eslint-disable-next-line
import questionMultipleChoiceMeta from './questionMultipleChoiceMeta'
import {Button} from 'react-bootstrap'

const replyIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-fill" viewBox="0 0 16 16">
  <path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
</svg>

function addLeadingZeros(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n
}


export default function questionsMeta(props) {
	return {
		groups:[
			
			{key:'g1', title:'', fields:[
				{
					field:'quiz',
					label:'',
					component:DropDownComponent,
					//width: '3',
					props:{
						createOption: function(option) {
							var topic = null
							if (props.user.is_admin) {
								topic =  option
							} else {
								topic = props.user.avatar+"'s "+option
							} 
							console.log(['CO',props.addTopic,topic])
							if (props.addTopic) props.addTopic(topic)
							//writabletopicsDB.searchItemsNow({topic: item.topic},function(items) {
								//if (items && items.length) {
									//// already exists
									//props.saveField('quiz',item.topic,props.item,props.itemkey)
								//} else {
									//props.saveField('quiz',item.topic,item,props.itemkey).then(function(newItem) {
										////console.log(['save',item])
										////writabletopicsDB.saveItem(item).then(function() {
											////var newTopics = [].concat(props.topics)
											////newTopics.push(option)
											////newTopics.sort()
											////props.setTopics(newTopics)
											//////writabletopicsDB.searchItems({},null,400,0,{topic:1})
										////})		
									//})				
								//}
							//})
						},
						
						options: Array.isArray(props.topics) ? props.topics.map(function(topic) { return (topic && props.user && (props.user.is_admin || (props.user.avatar && topic.indexOf(props.user.avatar) !== -1)) ) ? topic : null}) : []
						
					}
				}
				
			]},
			{key:'g22',title:'', fields:[
				{
					field:'difficulty',
					label:'Difficulty',
					//width: '3',
					component:RatingsComponent  ,
					props:{ value: props.item && parseInt(props.item.difficulty) > 0 ? parseInt(props.item.difficulty) : 0}
				},
				{
					field:'access',
					label:'Access',
					//width: '3',
					component:SelectComponent  ,
					props:{ 
						//value: props.item && props.item.access,
						options : ['public','private'],
						hidden_in_view: true
					}
				},
				{
					field:'tags',
					label:'',
					//width: '3',
					component:TagsComponent  ,
					props:{float:'right',suggestions: Array.isArray(props.tags) ? props.tags.map(function(tag) { return tag}) : []}
				}
			]},
			{key:'g2',title:'', fields:[
				{
					field:'question',
					label:'Question',
					width: 12,
					component:HighlightableTextComponent,
					props:{
						allowFullScreen: true, 
						onChangeHighlight: function(h) {props.saveField('question_subject', h, props.item, props.itemkey) },
						highlightValue: props.item && props.item.question_subject? props.item.question_subject : ''
					}
				}
			]},
			{key:'g6',title:'', fields:[
				{
					field:'images',
					label:'Images',
					width: 12,
					component:MediaEditorComponent,
					props:{}
				}
			]},
			{key:'g3',title:'', fields:[
				{
					field:'answer',
					label:'Answer',
					width: 12,
					component:TextareaComponent,
					props:{allowFullScreen: true}
				}
			]},
			{key:'g0', title:'', fields:[
				{
					field:'mnemonics',
					modelType:'mnemonics',
					label:'Memory Aids',
					width: 12,
					component:ItemListComponent,
					props:{
						modelType: 'mnemonics',
						fieldMeta: questionMnemonicMeta,
						parentField: 'question'
					}
				}
			]},
			{key:'g0', title:'', fields:[
				{
					field:'multipleChoiceQuestions',
					modelType:'multiplechoicequestions',
					label:'Specific Questions',
					width: 12,
					component:ItemListComponent,
					props:{
						modelType: 'multiplechoicequestions',
						fieldMeta: questionMultipleChoiceMeta,
						parentField: 'question'
					}
				}
			]},
			
			{key:'g5',title:'', fields:[
				{
					field:'link',
					label:'Link',
					width: 6,
					component:LinkComponent,
					props:{}
				},
				{
					field:'attribution',
					label:'Attribution',
					width: 6,
					component:TextComponent,
					props: {}
				},
				
				
			]},
			{key:'g7',title:'', fields:[
				{
					field:'media',
					label:'Media',
					width: 12,
					component:MediaEditorComponent,
					props:{}
				}
			]},
			{key:'g8',title:'', fields:[
				{
					field:'discoverable',
					label:'Discoverable',
					component:CheckboxComponent,
					props:{hidden_in_view: true}
				}
				
			]},
			{key:'g9', title:'', fields:[
				{
					field:'comments',
					modelType:'comments',
					label:'Comments',
					width: 12,
					component:ItemListComponent,
					props:{
						modelType: 'comments',
						sort: 'sort',
						fieldMeta: questionCommentMeta,
						parentField: 'question',
						//autoSaveDelay: '3000',
						createItem: function(item,index) {
							 console.log('createIteddm comment')
							console.log([item,index])
							// filter allowable values by user
							//var newValue = (value && props.user && (props.user.is_admin || (props.user.avatar && value.indexOf(props.user.avatar+"'s") === 0))) ? value : '';
							//console.log([newValue,loginContext.user.avatar])
							// empty then default notes
							//if (!newValue && props.user && loginContext.user._id && loginContext.user.avatar) {
								//newValue =  loginContext.user.avatar+"'s Notes" 
							//} 
							return { access:'public', userAvatar : props.user ? props.user.avatar : '', topic: item ? item.quiz : '' }//, topic: value.quiz 
						 },
						itemButtons:[
						   function(item, callback) { 
							 //console.log(['BC',item,item ? item.itemkey : 'none',item,item.created_date])
							 let currentDatetime = new Date()
							 let createdDate = currentDatetime.getDate() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getFullYear()) + " " + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes()) 
							//+ ":" + addLeadingZeros(currentDatetime.getSeconds())
							 return <span key={item.itemkey} >
									<Button key="info" variant="info"  style={{float:'left'}} title={ 'Block'} ><b>{createdDate}</b> &nbsp;{item.userAvatar ? ' by ' + item.userAvatar : ''}</Button> 
									<Button key="reply" variant="success" style={{float:'left', marginLeft:'0.2em'}} onClick={function(e) {if (item.createNew) item.createNew(item, item.itemkey + 1);  else console.log(props) ; }} title={ 'Reply'} >{replyIcon}</Button>
								</span>
						    }
						]
					}
				}
			]},
			
		]
	}
}
