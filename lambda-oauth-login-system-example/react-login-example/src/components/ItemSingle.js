import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link, useParams, useHistory} from 'react-router-dom'
import {getAxiosClient} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

export default function ItemSingle(props) {

	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, saveItemNow, deleteItem, getItem} = useLocalForageAndRestEndpoint({modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay})
	console.log(props)
	const history = useHistory()
	
	const [item,setItem] = useState({})
	// use props item or id in preference, fallback to params
	//const params = useParams();
	const { id, topic } = props.match.params
	//console.log(props.match.params)
	//console.log(['param',id,topic])
	
	var parent = props.match.url.split("/").slice(0,-1).join('/')
	//console.log(['parent',parent])
	//
	useEffect(function() {
		if (props.item) {
			setItem(props.item)
		} else {
			const useId = props.id ? props.id : id;
			if (!useId) { 
				// if no id provided, create a new item
				//var selectTopic = ''
				//if (props.user && (props.user.is_admin || props.user.avatar && topic.indexOf(props.user.avatar+"'s") === 0)) {
					//selectTopic = topic
				//}
				//var newItem = {quiz: selectTopic}
				console.log('createItem')
				console.log(props.createItem)
				var newItem = props.createItem ? props.createItem(topic) : {}
				saveItemNow(newItem).then(function(newItem) {
					console.log(['careted new item',newItem])
					setItem(newItem)
					history.push('/questions/'+newItem._id)
				})
			} else {
				getItem(useId,function(item) {
					if (item  && item._id) {
						setItem(item)
					} 
				})
			}
		}
	},[])
	
	function doSaveField(field,value,item,key) {
		return saveField(field,value,item,key).then(function(newItem) {setItem(newItem)})
	}
	
	const formProps = Object.assign({},props,{
		axiosClient: axiosClient, 
		item: item,
		saveField: doSaveField,
		fieldMeta: props.fieldMeta(props),
		categoryOptions: props.tags
	})
	
	if (!props.isLoggedIn()) {
		return <div style={{width:'100%'}}>   </div>
	} else {
		return <div style={{width:'100%'}}>   
			<div style={{height: '4em'}} ></div>
				
			{(item && item._id) && <Button  style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?'))  {deleteItem(item._id); history.push(parent)}}} >Delete</Button>}
			<Button onClick={function() {history.push(parent)}}  style={{float:'right'}}  >Close</Button>
			{(item && item._id) && <div>
			<h3>Edit</h3>
			
			 <ItemForm  {...formProps}  />
					
			</div>}
			{!(item && item._id) && <div>Creating .....</div>}
		
        </div>
     }   

}
