
import CheckboxComponent from '../form_field_components/CheckboxComponent'
import TagsComponent from '../form_field_components/TagsComponent'
import MediaEditorComponent from '../form_field_components/MediaEditorComponent'
import RatingsComponent from '../form_field_components/RatingsComponent'
import DropDownComponent from '../form_field_components/DropDownComponent'
import TextComponent from '../form_field_components/TextComponent'
import TextareaComponent from '../form_field_components/TextareaComponent'
import SelectComponent from '../form_field_components/SelectComponent'
import ItemListComponent from '../components/ItemListComponent'
import LinkComponent from '../form_field_components/LinkComponent'
import HighlightableTextComponent from '../form_field_components/HighlightableTextComponent'
// eslint-disable-next-line
import questionMnemonicMeta from './questionMnemonicMeta'
// eslint-disable-next-line
//import questionCommentMeta from './questionCommentMeta'
// eslint-disable-next-line
import questionMultipleChoiceMeta from './questionMultipleChoiceMeta'
import {Button} from 'react-bootstrap'
import {addLeadingZeros} from '../helpers'
//import CommentListComponentRow from '../components/CommentListComponentRow'
import commentProps from '../props/commentProps'




export default function questionsMeta(props) {
	//console.log(['qmeta',props.user])
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
					field:'tags',
					label:'',
					//width: '3',
					component:TagsComponent  ,
					props:{float:'right',suggestions: Array.isArray(props.tags) ? props.tags.map(function(tag) { return tag}) : []}
				}
				,{
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
					field:'discoverable',
					label:'Discoverable',
					component:CheckboxComponent,
					props:{hidden_in_view: props.user && props.user.is_admin ? false : true, hidden_in_form: props.user && props.user.is_admin ? false : true}
				}
				
			]},
			{key:'g2',title:'', fields:[
				{
					field:'question_full',
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
					props:{height:'300px'}
				}
			]},
			{key:'g3',title:'', fields:[
				{
					field:'answer',
					label:'Answer',
					width: 12,
					component:TextareaComponent,
					props:{highlightFirstLine: true, allowFullScreen: true}
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
						parentField: 'questionId'
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
			]},
			
			{key:'gf5',title:'', fields:[
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

			{key:'g9', title:'', fields:[
				{
					field:'comments',
					modelType:'comments',
					label:'Comments',
					width: 12,
					component:ItemListComponent,
					props:commentProps(props)
					//props:{ modelType:'comments', props: commentProps(props)},
				}
			]},
			
		]
	}
}
