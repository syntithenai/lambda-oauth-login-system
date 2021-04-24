import React,{useState, useEffect}  from 'react'; 
//, {Fragment, useState}
import {Button,Row, Col} from 'react-bootstrap'
//Badge, Navbar, Dropdown, 
import {Link, useParams, useHistory} from 'react-router-dom'
import DropDownComponent from './components/DropDownComponent'
//import DropDownSelectorComponent from './components/DropDownSelectorComponent'
import ItemForm from './components/ItemForm'
import {getAxiosClient, isEditable} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'

const thumbDownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
  <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
</svg>

const thumbUpIcon = <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
</svg>

//const viewIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  //<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  //<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
//</svg>


//const blockOnIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-fill" viewBox="0 0 16 16">
  //<path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
//</svg>

const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>

export default function DiscoverPage(props) {

//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	var history = useHistory()
	
	const {topic} = useParams()
	function setTopic(topic) {
		history.push("/discover/"+topic)
	} 
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
	
	function updateDiscoverList() {
		console.log('update discoverList item',topic)
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
	
	
	const questionText = []
	if (discoverItem && discoverItem.pre) questionText.push(discoverItem.pre)
	if (discoverItem && discoverItem.interrogative) questionText.push(discoverItem.interrogative)
	if (discoverItem && discoverItem.question) questionText.push(discoverItem.question)
	if (discoverItem && discoverItem.post) questionText.push(discoverItem.post)
	
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
	const formProps = Object.assign({},props,{
		item: discoverItem,
		//visible: visible,
		saveField: doSaveField,
		//refreshItem: refreshItem,
		fieldMeta: Object.assign({},fm,{groups: fm.groups.slice(1)}),
		//categoryOptions: props.tags,
		//isEditable: props.isEditable
		isEditable : function() {return false}
	})
	//console.log(['FORMPROPS',formProps])
	//{JSON.stringify(visible)}
					//{JSON.stringify(progress)}
    return  <div style={{width:'100%'}}>   
  			<div className="" style={{height: '4em'}} ></div>	
  			
  			{discoverItem && discoverItem._id && isEditable(discoverItem,props.user) && <Link to={'/search/' +discoverItem._id} ><Button title="Edit"  style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
			
  			
  			{<span style={{float:'left'}} >
				<DropDownComponent value={topic} variant={'info'} onChange={setTopic} options={Array.isArray(props.categoryOptions) ? props.categoryOptions : []} />
				&nbsp;&nbsp;<b>{totalCount} items remaining</b>
			</span>}
  			
  			{discoverItem && <div style={{clear:'both', paddingTop:'1em'}} >
				<h4>
				
				
				{questionText.join(' ')}</h4>
			<hr/>		
					<div><ItemForm {...formProps} editable={false} /></div>
			<hr/>
				<div style={{position: 'fixed', bottom: 0, left: 0, width:'100%'}} >
					<Row>
						<Col className='xs-2' >
							
						</Col>
						
						
						<Col className='xs-8' style={{minWidth: '10em'}} >
							<span style={{width:'100%'}} >
								<Button onClick={function(e) {props.reviewApi.block(props.user,discoverItem).then(function() {updateDiscoverList()})} } style={{display:'inline', height:'3.5em', width:'3.5em', marginRight:'1em'}}  variant="danger" title="Not Interested" >{thumbDownIcon}</Button>
								<Button onClick={function(e) {props.reviewApi.seen(props.user,discoverItem).then(function() {updateDiscoverList()})} } style={{display:'inline', height:'3.5em', width:'3.5em'}}    variant="success" title="Add to my review list" >{thumbUpIcon}</Button>
							</span>
						</Col>
						<Col className='xs-2' >
							
						</Col>
					</Row>
				</div>
			</div>}
  			
			<br/>
			<br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
        
}
    
      //
         
