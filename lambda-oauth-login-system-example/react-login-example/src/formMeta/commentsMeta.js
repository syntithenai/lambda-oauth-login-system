
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
//import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
//import TextComponent from '../components/TextComponent'
import TextareaComponent from '../form_field_components/TextareaComponent'
//import ItemListComponent from '../components/ItemListComponent'

export default function (props) {
	return {
		groups:[
			{key:'g1',title:'', fields:[
				{
					field:'comment',
					label:'Comment',
					width: 12,
					component:TextareaComponent,
					props:{
						editInline: true, 
						allowFullScreen: false,
						rows: 4, 
						cols: 50,

					}
				}
			]}
		]
	}
}
