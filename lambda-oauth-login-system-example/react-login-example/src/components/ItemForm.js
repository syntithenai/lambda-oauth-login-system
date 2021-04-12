//{ tag, removeButtonText, onDelete }
import React, {Fragment} from 'react';
import {Form, Row, Col} from 'react-bootstrap'

import CheckboxComponent from './CheckboxComponent'
import TagsComponent from './TagsComponent'
import MediaEditorComponent from './MediaEditorComponent'
import RatingsComponent from './RatingsComponent'
import DropDownComponent from './DropDownComponent'
import TextComponent from './TextComponent'
import TextareaComponent from './TextareaComponent'

import {getAxiosClient, getDistinct, isEditable} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
 
// needs props
// fieldMeta
// item
// itemkey (optional)
// onChange (or saveField)
// getFieldValue (optional)
// getFieldDisplayValue (optional)
export default function ItemForm(props) {
	//const tags = props.tagsDB && Array.isArray(props.tagsDB.items) ? props.tagsDB.items.map(function(tag) { return tag && tag.title ? tag.title : ''}) : []
	//const topics = props.topicsDB && Array.isArray(props.topicsDB.items) ? props.topicsDB.items.map(function(topic) { return topic && topic.topic ? topic.topic : ''}) : []
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	
	var fieldMeta = props.fieldMeta ? props.fieldMeta : {}
	//console.log(fieldMeta)
	//const props.tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//const writabletopicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//useEffect(function() {
		//props.tagsDB.searchItems({},null,400)	
		//props.topicsDB.searchItems({},null,400)
	//},[])
	
	////const tags = getDistinct('tags','title')
	const editable = true //isEditable(props.item,props.user)
	//console.log(props)
	return <div key={props.itemkey ? props.itemkey: 'none'} >
	{fieldMeta && Array.isArray(fieldMeta.groups) && fieldMeta.groups.map(function(group,gkey) {
		return <Form.Group key={gkey} ><Row>
			{(group && group.label) && <b>{group.label}</b>}
			
			{(group && Array.isArray(group.fields)) && group.fields.map(function(field,fieldKey) {
				// can provide override function in fieldMeta
				const getFieldValue = typeof field.getFieldValue === "function" ? field.getFieldValue : function(item) {
					if (item && item.hasOwnProperty(field.field)) {
						return item[field.field]
					}
				}
				const getFieldDisplayValue = typeof field.getFieldDisplayValue === "function" ? field.getFieldDisplayValue : function(item) {
					if (item && item.hasOwnProperty(field.field)) {
						return item[field.field]
					}
				}
				
				const onChange = typeof field.onChange === "function" ? field.onChange : function(value) { if (props.saveField) props.saveField(field.field,value,props.item,props.itemkey)}
				
				return <Col key={fieldKey} xs={field.width > 0 ? field.width : 'auto'}>
					{(field && field.label) && <Form.Label  >{field.label}</Form.Label>}
			
					{(editable && field.component) && field.component(Object.assign({},{value:getFieldValue(props.item),displayValue:getFieldDisplayValue(props.item),onChange: onChange , axiosClient: axiosClient, isLoggedIn: props.isLoggedIn, user: props.user}, (field.props ? field.props : {})  ))}
						
					{!editable && <span>{getFieldDisplayValue(props.item)}</span>}

				</Col>
			})}
		</Row></Form.Group >
	})}
	
		
	</div>
}
