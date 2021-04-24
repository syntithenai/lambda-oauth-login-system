
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
//import TextareaComponent from '../components/TextareaComponent'
import SelectComponent from '../components/SelectComponent'

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
					props:{}
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
