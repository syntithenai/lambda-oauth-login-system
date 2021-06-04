import React,{useState, useEffect}  from 'react'; 
//, {Fragment, useState}
import {Button,Row, Col} from 'react-bootstrap'
//Badge, Navbar, Dropdown, 
import {Link, useParams, useHistory} from 'react-router-dom'
import DropDownComponent from './form_field_components/DropDownComponent'
import TagsComponent from './form_field_components/TagsComponent'
//import DropDownSelectorComponent from './components/DropDownSelectorComponent'
import ItemForm from './components/ItemForm'
import {getAxiosClient, isEditable, scrollToTop} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'

import icons from './icons'
const {thumbDownIcon, thumbUpIcon, editIcon} = icons


export default function DiscoverPage(props) {

//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	var history = useHistory()
	
	const {topic} = useParams()
	function setTopic(topic) {
		history.push("/discover/"+(topic ? topic : ''))
	} 
	
	//useEffect(function() {
		//var filter = localStorage.getItem('questionsCategorySearchFilter')
		//console.log(['DISCOINIT',filter,topic])
		//if (!topic.trim() && filter.trim()) {
			//setTopic(filter)
		//}
	//},[])
	//useEffect(function() {
		//var filter = localStorage ? localStorage.getItem('questionsCategorySearchFilter') : ''
		////console.log('EF'+filter)
		//if (!topic && filter) {
			////console.log('EFh'+filter)
			//history.push('/review/'+filter)
		//}
	//},[])	
	//const [categorySearchFilter, setCategorySearchFilter] = useState('')
	
	//const [visible, setVisible]= useState({answer: 0, feedback: 1, link: 0,comments: 1})
	//const [fieldMeta, setFieldMeta]= useState({})
	
	// eslint-disable-next-line
	const [discoverList , setDiscoverList] = useState([])
	const [discoverItem , setDiscoverItem] = useState({})
	//const [progress, setProgress] = useState(null)
	const [totalCount, setTotalCount] = useState(0)
	//function showField(field) {
		//if (field) {
			//var newVis = visible
			//newVis[field] = 1
			////console.log(['SF',newVis])
			//setVisible(newVis)
		//}
	//}
	
	//function showFields(fields) {
		//if (Array.isArray(fields)) {
			//var newVis = visible
			//fields.forEach(function(field) {
				//newVis[field] = 1
			//})
			////console.log(['SF',newVis])
			//setVisible(newVis)
		//}
	//}
	
	
	//function hideField(field) {
		//if (field) {
			//var newVis = visible
			//newVis[field] = 0
			//setVisible(newVis)
		//}
	//}
	
	//useEffect(function() {
		//// filter meta based on visible fields
		//var newMeta = props.fieldMeta(props)
		////var newGroups = newMeta.groups
		//var newGroups = Array.isArray(newMeta.groups) ? newMeta.groups.map(function(group) {
			//var newGroup = group
			//if (newGroup && Array.isArray(newGroup.fields)) {
				////console.log(['newgroup',newGroup.fields])
				//var newFields = []
				//newGroup.fields.forEach(function(field) {
					//if (field.field && visible[field.field] === 1) newFields.push(Object.assign({},field,{props: Object.assign({},props,{editable: false}) } ))
					//else newFields.push(Object.assign({},field,{hidden_in_form: true, props: Object.assign({},props,{editable: false})}))
				//})
				//newGroup.fields = newFields
			//}
			//return newGroup
		//}) : []
		//newMeta.groups = newGroups
		////console.log('updated field meta')
		//setFieldMeta(newMeta)
	//},[props.fieldMeta,visible,discoverItem])
	
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField} = useLocalForageAndRestEndpoint({user: props.user, modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: 50, autoRefresh: false })
	
	
	useEffect(function() {
		if (props.user && props.user._id) {
			//console.log('search progress')
			//props.reviewApi.db.userquestionprogresses.searchItemsNow({user: props.user._id},function(searchResults) {
				updateDiscoverList()
			//})
			
		}
		localStorage.setItem('questionsCategorySearchFilter',topic)
		scrollToTop()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[topic,props.user])
	
	//function updateProgress() {
		////console.log(['SET PROGRESS ??',props.reviewApi,item])
		//if (props.reviewApi && props.reviewApi.questionProgress && discoverItem && discoverItem._id) {
			////console.log(['SET PROGRESS real ??',props.reviewApi,item])
			//props.reviewApi.questionProgress(discoverItem).then(function(res) {
				////console.log(['SET PROGRESS',res])
				//setProgress(res)
			//}) 
		//}
	//}
	
	//function updateDiscoverItem(list) {
		//var useList = list ? list : discoverList
		//console.log('update discoverList item')
		//if (useList.length > 0) {
			//getItem(useList[0],function(item) {
				//console.log(['updated discoverList item',item])
				//setDiscoverItem(item)
				////updateProgress()
			//})
		//} else {
			//setDiscoverItem(null)
			////setProgress(null)
		//}
	//}
	
		
	function nextDiscoverListItem() {
		console.log('next review item')
		if (props.user && props.user._id) {
			console.log('next review item user')
			if (Array.isArray(discoverList) && discoverList.length > 0) {
				var newList = discoverList.slice(0)
				console.log('next review item have list',JSON.stringify(newList))
				newList.shift()
				setTotalCount(newList.length)
				console.log('next review item ushifted',JSON.stringify(newList))
				//setTotalCount(list[0])
				//progressSearchResults.sort(function(a,b) {return (a && b && a.seen < b.seen) ? -1 : 1})
				//const questionList = progressSearchResults.map(function(ps) {return ps ? ps.question : null})
				setDiscoverList(newList)
				if (newList.length > 0) {
					setDiscoverItem(newList[0])
				} else {
					updateDiscoverList()
				}
				scrollToTop()
				//updateReviewItem(newList)
				//setVisible(initVisible(newList[0]))
			} else {
				updateDiscoverList()
				scrollToTop()
			} 
			
		}
	}
	
	function updateDiscoverList() {
		console.log('update discoverList item',topic)
		if (props.startWaiting) props.startWaiting()
		if (props.user && props.user._id) {
			//props.reviewApi.db.userquestionprogresses.searchItems({user: props.user._id},function(searchResult) { 
				props.reviewApi.getDiscoverList(topic).then(function(list) {
					console.log('update discoverList  ss item',list)
		
					var questionList = list[1]
					questionList.sort(function(a,b) {return a && b && a.sort < b.sort ? 1 : -1})
					//props.reviewApi.db.userquestionprogresses.loadSearchItems(list[1],function(progressSearchResults) {
					////loadSearchItems(list,function(searchResults) {
					setTotalCount(list[0])
					//progressSearchResults.sort(function(a,b) {return (a && b && a.seen < b.seen) ? -1 : 1})
					//const questionList = progressSearchResults.map(function(ps) {return ps ? ps.question : null})
					setDiscoverList(questionList)
					if (list[1].length > 0) {
						var itemNumber = 0; //parseInt(Math.random()*questionList.length)
						setDiscoverItem(list[1][itemNumber])
					} else {
						setDiscoverItem(null)
					}
						////console.log(['updated review list',questionList,progressSearchResults])
						//updateDiscoverItem(questionList)
					//})
					if (props.stopWaiting) props.stopWaiting()
				})	
			//})
		}
	}
	
	//useEffect(function() {
		//updateDiscoverList()
		////console.log('updated review list')
		////setReviewList(props.reviewApi.getReviewList(topic))
	//},[topic, props.user])
	
	
	//useEffect(function() {
		//updatediscoverItem()
	//},[reviewList,JSON.stringify(visible)])
	
	
	//useEffect(function() {
		//updateProgress()
		
	//},[discoverItem,props.user])
	
	
	//const questionText = []
	//if (discoverItem && discoverItem.pre) questionText.push(discoverItem.pre)
	//if (discoverItem && discoverItem.interrogative) questionText.push(discoverItem.interrogative)
	//if (discoverItem && discoverItem.question) questionText.push(discoverItem.question)
	//if (discoverItem && discoverItem.post) questionText.push(discoverItem.post)
	
	function doSaveField(field,value,item,key) {
		return new Promise(function(resolve,reject) {
			console.log(['dosavefield',field,value,item,key])
			saveField(field,value,item,key).then(function(newItem) {
				setDiscoverItem(newItem)
				resolve()
			})
		})
	}
	var fm = props.fieldMeta(props)
	fm.groups.unshift({key:'g22',title:'', fields:[
		{
			field:'tags',
			label:'',
			//width: '3',
			component:TagsComponent  ,
			props:{float:'right',suggestions: Array.isArray(props.tags) ? props.tags.map(function(tag) { return tag}) : []}
		}
	]},)
	const formProps = Object.assign({},props,{
		item: discoverItem,
		//visible: visible,
		saveField: doSaveField,
		//refreshItem: refreshItem,
		fieldMeta: Object.assign({},fm,{groups: fm.groups.slice(3)}),
		//categoryOptions: props.tags,
		//isEditable: props.isEditable
		isEditable : function() {return false}
	})
	console.log(['FORMPROPS',formProps,fm])
	//{JSON.stringify(visible)}
					//{JSON.stringify(progress)}
    return  <div style={{width:'100%'}}>   
  			<div className="" style={{height: '4em'}} ></div>	
  			
  			{discoverItem && discoverItem._id && isEditable(discoverItem,props.user) && <Link to={'/search/' +discoverItem._id} ><Button title="Edit"  style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
			
  			
  			{<span style={{float:'left'}} >
				<DropDownComponent value={topic} variant={'info'} onChange={setTopic} options={Array.isArray(props.topics) ? props.topics : []} />
				&nbsp;&nbsp;<b>{totalCount} items remaining</b>
			</span>}
  			
  			{discoverItem && <div style={{clear:'both', paddingTop:'1em'}} >
				<h4>
				
				
				{discoverItem.question_full}</h4>
			<hr/>		
					<div><ItemForm {...formProps} editable={false} /></div>
			<hr/>
				<div style={{position: 'fixed', bottom: 0, left: 0, width:'100%'}} >
					{(discoverItem && discoverItem._id) && <Row>
						<Col className='xs-2' >
							
						</Col>
						
						
						<Col className='xs-8' style={{minWidth: '10em'}} >
							<span style={{width:'100%'}} >
								<Button onClick={function(e) {props.reviewApi.block(props.user,discoverItem).then(function() {nextDiscoverListItem()})} } style={{display:'inline', height:'3.5em', width:'3.5em', marginRight:'1em'}}  variant="danger" title="Not Interested" >{thumbDownIcon}</Button>
								<Button onClick={function(e) {props.reviewApi.seen(props.user,discoverItem).then(function() {nextDiscoverListItem()})} } style={{display:'inline', height:'3.5em', width:'3.5em'}}    variant="success" title="Add to my review list" >{thumbUpIcon}</Button>
							</span>
						</Col>
						<Col className='xs-2' >
							
						</Col>
					</Row>}
				</div>
			</div>}
  			
			<br/>
			<br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
        
}
    
      //
         
