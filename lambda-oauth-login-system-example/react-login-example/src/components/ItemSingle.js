import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {useHistory, useLocation} from 'react-router-dom'
import {getAxiosClient, isEditable} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

import icons from '../icons'
const {closeIcon, viewIcon, deleteIcon, refreshIcon} = icons

export default function ItemSingle(props) {

	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {searchItems, setItems, saveField, saveItemNow, deleteItem, getItem, refreshItem, items} = useLocalForageAndRestEndpoint({user: props.user, modelType:props.modelType,axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, autoRefresh: props.autoRefresh ? true : false , populate: props.populate , createIndexes: props.createIndexes})
	//console.log(props)
	const history = useHistory()
	const location = useLocation()
	//console.log(location)
	var parts = location.pathname.split("/")
	var basePath = parts.length > 0 ? "/" + parts[1]  : ""
	//const [item,setItem] = useState({})
	var item = items && items.length > 0 ? items[0] : null
	function setItem(item) {
		setItems([item])
	}
	// use props item or id in preference, fallback to params
	//const params = useParams();
	const { id, topic } = props.match.params
	//console.log(props.match.params)
	//console.log(['param',id,topic])
	const [progress, setProgress] = useState(null)
	const [forceView, setForceView] = useState(false)
				
	var parent = props.match.url.split("/").slice(0,-1).join('/')
	//console.log(['parent',parent])
	//
	useEffect(function() {
		if (props.item) {
			//console.log('fromItem '+props.item._id)
			setItem(props.item)
		} else {
			const useId = props.id ? props.id : id;
			if (!useId) { 
				//console.log(props.createItem)
				var newItem = props.createItem ? props.createItem({topic:topic}) : {}
				saveItemNow(newItem).then(function(newItem) {
					//console.log(['created new item',newItem])
					setItem(newItem)
					history.replace(basePath+"/"+newItem._id)
				})
			} else {
				console.log('getItem '+useId)
				searchItems({_id:useId})
				//getItem(useId,function(item) {
					////console.log('getItem got '+item._id)
					//if (item  && item._id) {
						//console.log('getItem set '+item._id)
						//setItem(item)
					//} 
				//})
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.item, props.id, props.user])
	
	function updateProgress() {
		//console.log(['SET PROGRESS ??',props.reviewApi,item])
		if (props.reviewApi && props.reviewApi.questionProgress && item && item._id) {
			//console.log(['SET PROGRESS real ??',props.reviewApi,item])
			props.reviewApi.questionProgress(item).then(function(res) {
				//console.log(['SET PROGRESS',res])
				setProgress(res)
			}) 
		}
	}
	
	useEffect(function() {
		updateProgress()
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[item,props.user])
	
	function doSaveField(field,value,item,key) {
		var newItem = item ? item : {}
		newItem[field] = value
		setItem(newItem)
		return new Promise(function(resolve,reject) {
			console.log(['dosavefield',field,value,item,key])
			
			saveField(field,value,item,-1).then(function(newItem) {
				resolve()
			})
		})
	}
	var editable = props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
	if (forceView) editable = false
	
	const formProps = Object.assign({},props,{
		axiosClient: axiosClient, 
		item: item,
		saveField: doSaveField,
		refreshItem: refreshItem,
		categoryOptions: props.tags,
		//isEditable: props.isEditable
		editable: editable
	})
	formProps.fieldMeta = props.fieldMeta(formProps)
	
	//if (!props.isLoggedIn()) {
		//return <div style={{width:'100%'}}>   </div>
	//} else {
		//const editable = props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
	
		return <div style={{width:'98%', marginLeft:'1em'}}>   
			<div style={{height: '4em'}} ></div>
			<Button title="Close"  onClick={function() {history.goBack() /*push(basePath)*/}}  style={{float:'right', marginLeft:'0.2em'}}  >{closeIcon}</Button>
			<Button  title="Refresh" style={{float:'right', marginLeft:'0.2em'}} variant="warning" onClick={function() {
				refreshItem(item._id,null).then(function(newItem) {
					setItem(newItem)
				})
			}} >{refreshIcon}</
			Button>
				
			{(item && item._id && formProps.editable) && <Button  title="Delete"  style={{float:'right', marginLeft:'0.2em'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?'))  {deleteItem(item); history.push(parent)}}} >{deleteIcon}</Button>}
			
			{Array.isArray(props.buttons) ? <>{props.buttons.map(function(button,bkey) {
				if (typeof button === 'function' ) {
					var thisButton = button(Object.assign({},item,{itemkey: 'fff'+bkey, progress: progress}),function(e) {
						console.log('click')
						//clickFunction(e)
						updateProgress()
					})
					return thisButton
				} else {
					return button
				}
			})}</> : null }	
			
			{(props.user && props.user._id) && <Button title="Preview" variant={forceView ? 'success': 'secondary'} onClick={function() {setForceView(!forceView)}}  style={{float:'right', marginLeft:'0.2em'}}  >{viewIcon}</Button>}
			
			{(item && item._id) && <div>
			 <ItemForm  {...formProps}  />
					
			</div>}
			{!(item && item._id) && <div>Creating .....</div>}
		
        </div>
     //}   

}
