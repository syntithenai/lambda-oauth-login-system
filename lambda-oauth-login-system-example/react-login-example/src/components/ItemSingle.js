import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {getAxiosClient, isEditable} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

const closeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>

const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>


const refreshIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
</svg>

export default function ItemSingle(props) {

	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, saveItemNow, deleteItem, getItem, refreshItem} = useLocalForageAndRestEndpoint({user: props.user, modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, autoRefresh: props.autoRefresh ? true : false , populate: props.populate})
	//console.log(props)
	const history = useHistory()
	
	const [item,setItem] = useState({})
	// use props item or id in preference, fallback to params
	//const params = useParams();
	const { id, topic } = props.match.params
	//console.log(props.match.params)
	//console.log(['param',id,topic])
	const [progress, setProgress] = useState(null)
	
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
					history.push('/search/'+newItem._id)
				})
			} else {
				//console.log('getItem '+useId)
				getItem(useId,function(item) {
					//console.log('getItem got '+item._id)
					if (item  && item._id) {
						//console.log('getItem set '+item._id)
						setItem(item)
					} 
				})
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
		return new Promise(function(resolve,reject) {
			//console.log(['dosavefield',field,value,item,key])
			saveField(field,value,item,key).then(function(newItem) {
				setItem(newItem)
				resolve()
			})
		})
	}
	
	const formProps = Object.assign({},props,{
		axiosClient: axiosClient, 
		item: item,
		saveField: doSaveField,
		refreshItem: refreshItem,
		categoryOptions: props.tags,
		//isEditable: props.isEditable
		editable: props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
	})
	formProps.fieldMeta = props.fieldMeta(formProps)
	
	//if (!props.isLoggedIn()) {
		//return <div style={{width:'100%'}}>   </div>
	//} else {
		//const editable = props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
	
		return <div style={{width:'100%'}}>   
			<div style={{height: '4em'}} ></div>
			<Button title="Close"  onClick={function() {history.push('/search')}}  style={{float:'right', marginLeft:'0.2em'}}  >{closeIcon}</Button>
			<Button  title="Refresh" style={{float:'right', marginLeft:'0.2em'}} variant="warning" onClick={function() {
				refreshItem(item._id,null).then(function(newItem) {
					setItem(newItem)
				})
			}} >{refreshIcon}</
			Button>
				
			{(item && item._id && formProps.editable) && <Button  title="Delete"  style={{float:'right', marginLeft:'0.2em'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?'))  {deleteItem(item._id); history.push(parent)}}} >{deleteIcon}</Button>}
			
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
			
			{(item && item._id) && <div>
			 <ItemForm  {...formProps}  />
					
			</div>}
			{!(item && item._id) && <div>Creating .....</div>}
		
        </div>
     //}   

}
