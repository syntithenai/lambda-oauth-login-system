
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
//import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
//import ItemListComponent from '../components/ItemListComponent'

export default function (props) {
	return {
		groups:[
			
			
			{key:'g2',title:'', fields:[
				{
					field:'mnemonic',
					label:'Mnemonic',
					width: 12,
					component:TextComponent,
					props:{}
				}
			]},
			//{key:'g3',title:'', fields:[
				//{
					//field:'mnemonic_technique',
					//label:'Type',
					//width: 12,
					//component:TextComponent,
					//props:{allowFullScreen: true}
				//}
			//]}
			
		]
	}
}
