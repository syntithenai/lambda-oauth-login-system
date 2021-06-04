import {Button} from 'react-bootstrap'
//import CheckboxComponent from '../components/CheckboxComponent'
//import TagsComponent from '../components/TagsComponent'
//import MediaEditorComponent from '../components/MediaEditorComponent'
//import RatingsComponent from '../components/RatingsComponent'
//import DropDownComponent from '../components/DropDownComponent'
import TextComponent from '../components/TextComponent'
import TextareaComponent from '../components/TextareaComponent'
//import SelectComponent from '../components/SelectComponent'

const replyIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-fill" viewBox="0 0 16 16">
  <path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
</svg>

export default function questionCommentMeta(props) {
	return {
		groups:[
			{key:'mn3',title:'', fields:[
				
				{
					field:'comment',
					label:'',
					width: 12,
					component:TextareaComponent,
					
					props:{
						allowFullScreen: true ,
						editInline: true, 
						rows: 4, 
						cols: 50,
						
					},
					
				}
			]},
			
			
		]
	}
}
