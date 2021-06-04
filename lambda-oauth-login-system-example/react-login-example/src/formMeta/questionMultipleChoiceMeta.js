
//import CheckboxComponent from '../components/CheckboxComponent'
import TagsComponent from '../form_field_components/TagsComponent'
//import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../form_field_components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
//import SelectComponent from '../components/SelectComponent'

export default function questionMultipleChoiceMeta(props) {
	return {
		groups:[
			
			{key:'mc3',title:'', fields:[
				{
					field:'question',
					label:'Question',
					width: 6,
					component:TextComponent,
					props:{allowFullScreen: true}
				},
				{
					field:'answer',
					label:'Answer',
					width: 6,
					component:TextComponent,
					props:{}
				},
				{
					field:'multiple_choice_options',
					label:'Options',
					width: 6,
					component:TagsComponent,
					props:{}
				},
				{
					field:'also_accept',
					label:'Also Accept',
					width: 6,
					component:TagsComponent,
					props:{}
				},
				{	field:'feedback',
					label:'Feedback',
					width: 12,
					component:TextComponent,
					props:{allowFullScreen: true}
				}
			
			]},
			
			
		]
	}
}
//, options: ['','homonym','association','alliteration','rhyme','acronym','mnemonic major system','visual'] 
