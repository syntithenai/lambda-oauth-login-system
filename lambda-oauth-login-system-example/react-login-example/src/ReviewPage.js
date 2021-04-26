import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button,Badge, Row, Col} from 'react-bootstrap'
import {Link, useParams, useHistory} from 'react-router-dom'
import DropDownComponent from './components/DropDownComponent'
import DropDownSelectorComponent from './components/DropDownSelectorComponent'
import ItemForm from './components/ItemForm'
import {getAxiosClient, isEditable} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
//const changesets = require('diff-json')

const thumbDownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
  <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
</svg>

const thumbUpIcon = <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
</svg>

const viewIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg>


const blockOnIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-fill" viewBox="0 0 16 16">
  <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
</svg>

const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>

export default function ReviewPage(props) {

//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	var history = useHistory()
	const allFields = ['answer','mnemonics','images','media','tags','link','comments','multiplechoicequestions']
	const {topic} = useParams()
	function setTopic(topic) {
		history.push("/review/"+topic)
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
	
	useEffect(function() {
		window.onkeypress = function(key) {
			console.log([key,key.key])
			if (key.key === "<" || key.key === ",") {
				console.log(props.reviewApi)
				props.reviewApi.seen(props.user,reviewItem).then(function() {updateReviewList()})
			} else if (key.key === ">" || key.key === ".") {
				props.reviewApi.success(props.user,reviewItem).then(function() {updateReviewList()})
			} else if (key.key === "i" || key.key === "I" || key.key === "a" || key.key === "A") {
				console.log('shjow all fields')
				showFields(allFields)
			} else if (key.key === "c" || key.key === "C") {
				console.log('shjow all mnem')
				showFields(['mnemonics'])
			}
									 
			
		}
	})
	
	const [fieldMeta, setFieldMeta]= useState({})
	
	const [reviewList , setReviewList] = useState([])
	const [reviewItem , setReviewItem] = useState({})
	const [progress, setProgress] = useState(null)
	
	function itemHasAutoplay(field,item) {
		var found = false
		if (item && item[field] && Array.isArray(item[field])) {
			item[field].forEach(function(image) {
				if (image.autoplay === 'yes') {
					found = true
				}
			})
		}
		return found
	}
	
	var initVisible = function(reviewItem) { return { images: itemHasAutoplay('images',reviewItem), medias: itemHasAutoplay('medias',reviewItem)}}
	const [visible, setVisible]= useState(initVisible(reviewItem))
	
	
	function showField(field) {
		if (field) {
			var newVis = visible
			newVis[field] = true
			//console.log(['SF',newVis])
			setVisible(newVis)
		}
	}
	
	function showFields(fields) {
		if (Array.isArray(fields)) {
			var newVis = visible
			fields.forEach(function(field) {
				newVis[field] = true
			})
			//console.log(['SF',newVis])
			setVisible(newVis)
		}
	}
	
	
	//function hideField(field) {
		//if (field) {
			//var newVis = visible
			//newVis[field] = 0
			//setVisible(newVis)
		//}
	//}
	
	useEffect(function() {
		// filter meta based on visible fields
		var newMeta = props.fieldMeta(props)
		//var newGroups = newMeta.groups
		//var newGroups = 
		if (Array.isArray(newMeta.groups)) {
			 newMeta.groups.forEach(function(group,groupKey) {
				//var newGroup = group
				if (group && Array.isArray(group.fields)) {
					//console.log(['newgroup',group.fields])
					//var newFields = []
					group.fields.forEach(function(field,fieldKey) {
						if (field.field && visible[field.field] === true) {
							
						} else {
							newMeta.groups[groupKey].fields[fieldKey].props.hidden_in_view = true
							newMeta.groups[groupKey].fields[fieldKey].props.hidden_in_form = true
						}
						//newFields.push(Object.assign({},field,{props: Object.assign({},props,{editable: false}) } ))
						//else newFields.push(Object.assign({},field,{hidden_in_form: true,hidden_in_view: true,  props: Object.assign({},props,{editable: false})}))
					})
					//newGroup.fields = newFields
				}
			//return newGroup
			})
		}
		//newMeta.groups = newGroups
	//	console.log('updated field meta',changesets.diff(newMeta.groups,props.fieldMeta(props).groups))
		setFieldMeta(newMeta)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.fieldMeta,visible,reviewItem])
	
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField,  getItem} = useLocalForageAndRestEndpoint({user: props.user, modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: 5000, autoRefresh: false })
	
	
	useEffect(function() {
		if (props.user && props.user._id) {
			//console.log('search progress')
			//props.reviewApi.db.userquestionprogresses.searchItemsNow({user: props.user._id},function(searchResults) {
				updateReviewList()
			//})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[topic,props.user])
	
	//useEffect(function() {
		//updateReviewList()
		////console.log('updated review list')
		////setReviewList(props.reviewApi.getReviewList(topic))
	//// eslint-disable-next-line react-hooks/exhaustive-deps
	//},[topic, props.user])
	
	
	function updateProgress() {
		//console.log(['SET PROGRESS ??',props.reviewApi,item])
		if (props.reviewApi && props.reviewApi.questionProgress && reviewItem && reviewItem._id) {
			//console.log(['SET PROGRESS real ??',props.reviewApi,item])
			props.reviewApi.questionProgress(reviewItem).then(function(res) {
				//console.log(['SET PROGRESS',res])
				setProgress(res)
			}) 
		}
	}
	
	function updateReviewItem(list) {
		var useList = list ? list : reviewList
		//console.log('update review item')
		if (useList.length > 0) {
			getItem(useList[0],function(item) {
				//console.log(['updated review item',item])
				setReviewItem(item)
				updateProgress()
			})
		} else {
			setReviewItem(null)
			setProgress(null)
		}
	}
	
	function updateReviewList(baseList) {
		if (props.user && props.user._id) {
			//props.reviewApi.db.userquestionprogresses.searchItems({user: props.user._id},function(searchResult) { 
			props.reviewApi.getReviewList(topic).then(function(list) {
				props.reviewApi.db.userquestionprogresses.loadSearchItems(list,function(progressSearchResults) {
				//loadSearchItems(list,function(searchResults) {
					progressSearchResults.sort(function(a,b) {return (a && b && a.seen < b.seen) ? -1 : 1})
					const questionList = progressSearchResults.map(function(ps) {return ps ? ps.question : null})
					setReviewList(questionList)
				    //console.log(['updated review list',questionList,progressSearchResults])
				    setVisible(initVisible(questionList[0]))
					updateReviewItem(questionList)
				    
				},true)
				
			})
		}
	}
	

	//useEffect(function() {
		//updateReviewItem()
	//},[reviewList,JSON.stringify(visible)])
	
	
	//useEffect(function() {
		//updateProgress()
		
	//},[reviewItem,props.user])
	
	
	const questionText = []
	if (reviewItem && reviewItem.pre) questionText.push(reviewItem.pre)
	if (reviewItem && reviewItem.interrogative) questionText.push(reviewItem.interrogative)
	if (reviewItem && reviewItem.question) questionText.push(reviewItem.question)
	if (reviewItem && reviewItem.post) questionText.push(reviewItem.post)
	
	function doSaveField(field,value,item,key) {
		return new Promise(function(resolve,reject) {
			console.log(['dosavefield',field,value,item,key])
			saveField(field,value,item,key).then(function(newItem) {
				setReviewItem(newItem)
				resolve()
			})
		})
	}
	
	const formProps = Object.assign({},props,{
		item: reviewItem,
		visible: visible,
		saveField: doSaveField,
		//refreshItem: refreshItem,
		fieldMeta: fieldMeta,
		//categoryOptions: props.tags,
		//isEditable: props.isEditable
	})
	//console.log(['FORMPROPS',formProps])
	//console.log(['FORMPROPS item',reviewItem])
	
	//{JSON.stringify(visible)}
					//{JSON.stringify(progress)}
	
	var viewOptions = ['Answer']				
	if (reviewItem && Array.isArray(reviewItem.mnemonics) && reviewItem.mnemonics.length > 0) {
		//console.log(reviewItem)
		viewOptions = ['Clues','Answer']
	} 
    return  <div style={{width:'100%'}}>   
  			<div className="" style={{height: '4em'}} ></div>	
  			
  			{reviewItem && reviewItem._id && isEditable(reviewItem,props.user) && <Link to={'/search/' +reviewItem._id} ><Button title="Edit"  style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
			
  			
  			{<span style={{float:'left'}} >
				<DropDownComponent value={topic} variant={'info'} onChange={setTopic} options={Array.isArray(props.categoryOptions) ? props.categoryOptions : []} />
				&nbsp;&nbsp;<b>{reviewList.length} items remaining</b>
			</span>}
  			{reviewItem && <div style={{clear:'both', paddingTop:'1em'}} >
				<h4>
				<Badge variant="info" style={{marginRight:'1em'}}>{progress && progress.successTally > 0 ? progress.successTally : 0}/{progress && progress.seenTally > 0 ? progress.seenTally : 0}</Badge>
					{questionText.join(' ')}</h4>
			<hr/>		
					<div><ItemForm {...formProps}  editable={false}/></div>
			<hr/>
				<div style={{position: 'fixed', bottom: 0, left: 0, width:'100%'}} >
					{reviewItem && <Row>
						<Col className='xs-2' >
							<DropDownSelectorComponent variant="info" title={'Show'} buttonContent={viewIcon} value={''} options={viewOptions} onChange={function(value) {
							   switch(value) {
								   case 'Clues':
									 showField('mnemonics')
									 updateReviewItem()
									 break;
								   //case 'Image':
									 //showField('images')
									 //updateReviewItem()
									 //break;
								   case 'Answer':
								   console.log('showanswer')
									 showFields(allFields)
									 updateReviewItem()
									 break;
								   //case 'More Info':
									 //showField('link')
									 //updateReviewItem()
									 //break;
								   
								   default:
								     break;
							   }	
							}} />
						</Col>
						
						
						<Col className='xs-8' style={{minWidth: '10em'}} >
							<span style={{width:'100%'}} >
								<Button onClick={function(e) {props.reviewApi.seen(props.user,reviewItem).then(function() {updateReviewList()})} } style={{display:'inline', height:'3.5em', width:'3.5em', marginRight:'1em'}}  variant="primary" title="More Review Needed" >{thumbDownIcon}</Button>
								<Button onClick={function(e) {props.reviewApi.success(props.user,reviewItem).then(function() {updateReviewList()})} } style={{display:'inline', height:'3.5em', width:'3.5em'}}    variant="success" title="Enough Review For Now" >{thumbUpIcon}</Button>
							</span>
						</Col>
						<Col className='xs-2' >
							<Button onClick={function(e) {if (window.confirm('Block this question from your review list ?')) props.reviewApi.block(props.user,reviewItem).then(function() {updateReviewList()})} }   style={{float:'right', marginRight:'2em'}} variant="danger" title="Block" >{blockOnIcon}</Button>
						</Col>
					</Row>}
				</div>
			</div>}
  			
			<br/>
			<br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
        
}
    
      //
         
