
import CheckboxComponent from '../components/CheckboxComponent'
import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../components/MediaEditorComponent'
import RatingsComponent from '../components/RatingsComponent'
import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
import TextareaComponent from '../components/TextareaComponent'
import ItemListComponent from '../components/ItemListComponent'

export default function (props) {
	return {
		groups:[
			
			//{key:'g1', title:'', fields:[{
				//field:'topic',
				//label:'',
				//component:DropDownComponent,
				////width: '3',
				//props:{
					//editable: false,
					////createOption: function(option) {
						////var item = null
						////if (props.user.is_admin) {
							////item = {topic: option}
						////} else {
							////item = {topic: props.user.avatar+"'s "+option}
						////} 
						//////writabletopicsDB.searchItemsNow({topic: item.topic},function(items) {
							//////if (items && items.length) {
								//////// already exists
								////props.saveField('quiz',item.topic,props.item,props.itemkey)
							//////} else {
								//////props.saveField('quiz',item.topic,item,props.itemkey).then(function(newItem) {
									////////console.log(['save',item])
									////////writabletopicsDB.saveItem(item).then(function() {
										////////var newTopics = [].concat(props.topics)
										////////newTopics.push(option)
										////////newTopics.sort()
										////////props.setTopics(newTopics)
										//////////writabletopicsDB.searchItems({},null,400,0,{topic:1})
									////////})		
								//////})				
							//////}
						//////})
						////},
					
						//options: Array.isArray(props.topics) ? props.topics.map(function(topic) { return (topic && props.user && (props.user.is_admin || (props.user.avatar && topic.indexOf(props.user.avatar) !== -1)) ) ? topic : null}) : []
					
					//}
				//},
			//]},
			
			{key:'g2',title:'', fields:[
				{
					field:'comment',
					label:'Comment',
					width: 12,
					component:TextComponent,
					props:{allowFullScreen: false}
				}
			]}
			
			
			
		]
	}
}
