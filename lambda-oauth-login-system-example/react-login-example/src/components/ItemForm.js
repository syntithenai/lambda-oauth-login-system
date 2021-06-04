//{ tag, removeButtonText, onDelete }
import React from 'react';
//, {Fragment, useState, useEffect}
import {Form, Row, Col} from 'react-bootstrap'

// eslint-disable-next-line 
import CheckboxComponent from '../form_field_components/CheckboxComponent'
// eslint-disable-next-line 
import TagsComponent from '../form_field_components/TagsComponent'
// eslint-disable-next-line 
import MediaEditorComponent from '../form_field_components/MediaEditorComponent'
// eslint-disable-next-line
import RatingsComponent from '../form_field_components/RatingsComponent'
// eslint-disable-next-line
import DropDownComponent from '../form_field_components/DropDownComponent'
// eslint-disable-next-line
import TextComponent from '../form_field_components/TextComponent'
// eslint-disable-next-line
import TextareaComponent from '../form_field_components/TextareaComponent'
// eslint-disable-next-line
import SelectComponent from '../form_field_components/SelectComponent'

import {getAxiosClient, isEditable} from '../helpers'  
//import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
 
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
	const axiosClient = props.axiosClient ? props.axiosClient : (props.user && props.user.token &&  props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient())
	
	
	var fieldMeta = props.fieldMeta ? props.fieldMeta : {}
	//console.log(props.item,props.fieldMeta)
	//const props.tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//const writabletopicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//useEffect(function() {
		//props.tagsDB.searchItems({},null,400)	
		//props.topicsDB.searchItems({},null,400)
	//},[])
	
	////const tags = getDistinct('tags','title')
	//const editable = true //isEditable(props.item,props.user)
	//console.log(fieldMeta)
			
	return <div  >
	{fieldMeta && Array.isArray(fieldMeta.groups) && fieldMeta.groups.map(function(group,gkey) {
		return <Form.Group key={gkey} ><Row>
			{(group && group.label) && <span style={{fontWeight:900}} >{group.label}</span>}
			{(group && Array.isArray(group.fields)) && group.fields.map(function(field,fieldKey) {
				// can provide override function in fieldMeta
				const getFieldValue = typeof field.getFieldValue === "function" ? field.getFieldValue : function(item) {
					if (item && item.hasOwnProperty(field.field)) {
						return item[field.field]
					}
				}
				
				const onChange = typeof field.onChange === "function" ? field.onChange : function(value) { 
					console.log(['onchange',onChange,props.saveField,value,field.field,props.item,props.itemkey]); 
					if (props.saveField) { 
						props.saveField(field.field,value,props.item,props.itemkey).then(function() {
							console.log(['onchanged'])
						})
					}
				}
				
				var fieldProps = Object.assign({autoSaveDelay: props.autoSaveDelay, minimumBatchSize: props.minimumBatchSize, threshold: props.threshold},field.props,{
						value:getFieldValue(props.item),
						parent: props.item,
						//displayValue:getFieldDisplayValue(props.item),
						onChange: onChange , 
						axiosClient: axiosClient, 
						isLoggedIn: props.isLoggedIn, 
						user: props.user,
						loginCheckActive: props.loginCheckActive,
						startWaiting:props.startWaiting,
						stopWaiting: props.stopWaiting,
						onItemQueued: props.onItemQueued,
						onStartSaveQueue: props.onStartSaveQueue,
						onFinishSaveQueue: props.onFinishSaveQueue,
						tags: props.tags,
						topics: props.topics,
						reviewApi: props.reviewApi,
						
					  //  props: (field.props ? field.props : {})  
					  })
				if (field.props && props.item && field.props.parentField) fieldProps.parentValue = props.item._id
	
				var formEditable = props.hasOwnProperty('editable') ? props.editable : isEditable(props.item,props.user)
				var fieldEditable = formEditable
				//console.log(fieldEditable)
				//var fieldEditable = true
				// field props to force
				if (field.props && field.props.hasOwnProperty('editable')) fieldEditable = field.props.editable 
				// item list is always editable
				if (field && field.component && field.component.name === 'ItemListComponent') fieldEditable = true
				
				//const getFieldDisplayValue = typeof field.getFieldDisplayValue === "function" ? field.getFieldDisplayValue : function(item) {
					//if (item && item.hasOwnProperty(field.field)) {
						//return field.component(Object.assign({},fieldProps,{readOnly: false}))
						////new String(item[field.field])
					//}
				//}
				var hideField = false
				// field meta props hidden_in_*
				//console.log('HIDE FIELD?')
				//console.log(field)
				if (field && field.props && ((formEditable && field.props.hidden_in_form) || (!formEditable && field.props.hidden_in_view) )) {
					//console.log('from hidden')
					hideField = true
				} else {
					// in view only
					if (!formEditable) {
						// hide field and label if empty value
						if (!fieldProps.value) {
							//console.log('from empty')
							hideField = true
						// hide field and label if empty array 
						} else if ((fieldProps.value && Array.isArray(fieldProps.value) && fieldProps.value.length === 0))   {
							//console.log('from empty array')
							if (!fieldEditable) hideField = true
						}
					} 
				}
				
				//console.log(['FIELDPROPS',field.field,formEditable,fieldEditable,hideField, fieldProps,field,field.props])
				//console.log(['FIELDPROPS',field.field,hideField])	
				// render both and use CSS display to hide to avoid variable number of useEffect calls in children
				return <Col style={{display: (hideField ? 'none' : 'block')}} key={fieldKey} xs={field.width > 0 ? field.width : 'auto'}>
					{(field && field.label) && <Form.Label key={'daformLabel'} > <b>{field.label}</b> </Form.Label>}
					<div key={'daformInput'} style={{display: ((fieldEditable)) ? 'block' : 'none'}} >{field.component(Object.assign({},fieldProps,{readOnly: false}))}</div>
						
					<div key={'displayValue'} style={{display: !(fieldEditable ) ? 'block' : 'none'}} >{field.component(Object.assign({}, fieldProps,{readOnly: true}))}</div>

				</Col>
			})}
		</Row></Form.Group >
	})}
	
		
	</div>
}
