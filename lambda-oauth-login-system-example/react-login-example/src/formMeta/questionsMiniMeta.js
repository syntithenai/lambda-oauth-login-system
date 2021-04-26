
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
//import ItemListComponent from '../components/ItemListComponent'
//import questionMnemonicMeta from './questionMnemonicMeta'

//import questionMultipleChoiceMeta from './questionMultipleChoiceMeta'

export default function questionsMiniMeta(props) {
	return {
		groups:[
			
			{key:'g1', title:'', fields:[
				{
					field:'quiz',
					label:'',
					component:DropDownComponent,
					//width: '3',
					props:{
						//createOption: function(option) {
							//var item = null
							//if (props.user.is_admin) {
								//item = {topic: option}
							//} else {
								//item = {topic: props.user.avatar+"'s "+option}
							//} 
							////writabletopicsDB.searchItemsNow({topic: item.topic},function(items) {
								////if (items && items.length) {
									////// already exists
									//props.saveField('quiz',item.topic,props.item,props.itemkey)
								////} else {
									////props.saveField('quiz',item.topic,item,props.itemkey).then(function(newItem) {
										//////console.log(['save',item])
										//////writabletopicsDB.saveItem(item).then(function() {
											//////var newTopics = [].concat(props.topics)
											//////newTopics.push(option)
											//////newTopics.sort()
											//////props.setTopics(newTopics)
											////////writabletopicsDB.searchItems({},null,400,0,{topic:1})
										//////})		
									////})				
								////}
							////})
						//},
						
						options: Array.isArray(props.topics) ? props.topics.map(function(topic) { return (topic && props.user && (props.user.is_admin || (props.user.avatar && topic.indexOf(props.user.avatar) !== -1)) ) ? topic : null}) : []
						
					}
				},
				//{
					//field:'difficulty',
					//label:'Difficulty',
					////width: '3',
					//component:RatingsComponent  ,
					//props:{float:'right'} //, value: props.item && parseInt(props.item.difficulty) > 0 ? parseInt(props.item.difficulty) : 0
				//}
			]},
			{key:'g2',title:'', fields:[
				{
					field:'question_full',
					label:'qq',
					width: 8,
					component:TextComponent,
					props:{allowFullScreen: false}
				}
			,	{
					field:'images',
					label:'',
					width: 4,
					component:MediaEditorComponent,
					props:{editable: false, height:'90px'}
				}
			]},
			//{key:'g3',title:'', fields:[
				//{
					//field:'answer',
					//label:'Answer',
					//width: 12,
					//component:TextComponent,
					//props:{allowFullScreen: true}
				//}
			//]},
			//{key:'g0', title:'', fields:[
				//{
					//field:'mnemonics',
					//modelType:'mnemonics',
					//label:'Memory Aids',
					//width: 12,
					//component:ItemListComponent,
					//props:{
						//modelType: 'mnemonics',
						//fieldMeta: questionMnemonicMeta,
						//parentField: 'question'
					//}
				//}
			//]},
			//{key:'g0', title:'', fields:[
				//{
					//field:'multipleChoiceQuestions',
					//modelType:'multiplechoicequestions',
					//label:'Specific Questions',
					//width: 12,
					//component:ItemListComponent,
					//props:{
						//modelType: 'multiplechoicequestions',
						//fieldMeta: questionMultipleChoiceMeta,
						//parentField: 'question'
					//}
				//}
			//]},
			//{key:'g4',title:'', fields:[
				//{
					//field:'feedback',
					//label:'Feedback',
					//width: 12,
					//component:TextComponent,
					//props:{allowFullScreen: true}
				//}
			//]},
			//{key:'g5',title:'', fields:[
				//{
					//field:'link',
					//label:'Link',
					//width: 6,
					//component:TextComponent,
					//props:{}
				//},
				//{
					//field:'attribution',
					//label:'Attribution',
					//width: 6,
					//component:TextComponent,
					//props: {}
				//},
				
				
			//]},
			//{key:'g6',title:'', fields:[
				//{
					//field:'images',
					//label:'Images',
					//width: 12,
					//component:MediaEditorComponent,
					//props:{}
				//}
			//]},
			//{key:'g7',title:'', fields:[
				//{
					//field:'media',
					//label:'Media',
					//width: 12,
					//component:MediaEditorComponent,
					//props:{}
				//}
			//]},
			//{key:'g8',title:'', fields:[
				//{
					//field:'discoverable',
					//label:'Discoverable',
					//component:CheckboxComponent,
					//props:{}
				//}
				//,
				//{
					//field:'tags',
					//label:'',
					////width: '3',
					//component:TagsComponent  ,
					//props:{float:'right',suggestions: Array.isArray(props.tags) ? props.tags.map(function(tag) { return tag}) : []}
				//}
			//]}
			
		]
	}
}
