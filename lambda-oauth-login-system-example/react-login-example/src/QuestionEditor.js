import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {getAxiosClient} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
import QuestionForm from './QuestionForm'

export default function QuestionEditor(props) {

	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, saveItemNow, deleteItem, getItem} = useLocalForageAndRestEndpoint({modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay})
	
	
	const [item,setItem] = useState({})
	// use props item or id in preference, fallback to params
	const { id, topic } = useParams();
	//console.log(['param',id,topic])
	//
	useEffect(function() {
		if (props.item) {
			setItem(props.item)
		} else {
			const useId = props.id ? props.id : id;
			if (!useId) { 
				// if no id provided, create a new item
				var selectTopic = ''
				if (props.user && (props.user.is_admin || props.user.avatar && topic.indexOf(props.user.avatar+"'s") === 0)) {
					selectTopic = topic
				}
				saveItemNow({quiz: selectTopic}).then(function(newItem) {
					//console.log(['carete new item',newItem])
					setItem(newItem)
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
	
	const formProps = {
		isLoggedIn: props.isLoggedIn,
		tags: props.tags,
		topics: props.topics,
		setTags: props.setTags,
		setTopics: props.setTopics,
		axiosClient: axiosClient, 
		user: props.user,
		item: item,
		saveField: doSaveField
	}
	
	if (!props.isLoggedIn()) {
		return <div style={{width:'100%'}}>   </div>
	} else {
		return <div style={{width:'100%'}}>   
    
			{(item && item._id) && <Link to="/editor"><Button  style={{float:'right'}} variant="danger" onClick={function(e) {deleteItem(item._id)}} >Delete</Button></Link>}
			<Link to="/editor"><Button  style={{float:'right'}}  >Close</Button></Link>
			{(item && item._id) && <div>
			<h3>Edit</h3>
			{JSON.stringify(item)}	
			
			 <QuestionForm  {...formProps}  />
					
			</div>}
			{!(item && item._id) && <div>Creating .....</div>}
		
        </div>
     }   

}
