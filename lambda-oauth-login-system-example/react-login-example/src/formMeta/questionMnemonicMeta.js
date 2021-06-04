
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../form_field_components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../form_field_components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
import SelectComponent from '../form_field_components/SelectComponent'

export default function questionMnemonicMeta(props) {
	return {
		groups:[
			{key:'mn3',title:'', fields:[
				{
					field:'mnemonic_technique',
					label:'',
					width: 2,
					component:SelectComponent,
					props:{allowFullScreen: true, options: ['','highlight','keypoint','homonym','association','alliteration','rhyme','acronym','mnemonic major system','visual'] }
				},
				{
					field:'mnemonic',
					label:'',
					width: 10,
					component:TextComponent,
					props:{editInline: true}
				},
				{
					field:'meme',
					label:'Meme',
					width: 12,
					component:MediaEditorComponent,
					props:{}
				}
			]},
			
			
		]
	}
}
