
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../form_field_components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
import DropDownComponent from '../form_field_components/DropDownComponent'
import TextComponent from '../form_field_components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
//import ItemListComponent from '../components/ItemListComponent'
//import questionMnemonicMeta from './questionMnemonicMeta'

//import questionMultipleChoiceMeta from './questionMultipleChoiceMeta'

export default function questionsMiniMeta(props) {
	return {
		groups:[
			{key:'g1',title:'', fields:[
				{
					field:'question_full',
					label:'',
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
			]}
			
		]
	}
}
