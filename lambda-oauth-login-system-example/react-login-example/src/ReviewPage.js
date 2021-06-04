import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button,Badge, Row, Col} from 'react-bootstrap'
import {Link, useParams, useHistory} from 'react-router-dom'
import DropDownComponent from './form_field_components/DropDownComponent'
import DropDownSelectorComponent from './form_field_components/DropDownSelectorComponent'
import ItemForm from './components/ItemForm'
import {getAxiosClient, isEditable, scrollToTop} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
//const changesets = require('diff-json')
import icons from './icons'
const {infoIcon, thumbUpIcon, thumbDownIcon, viewIcon, blockOnIcon, editIcon} = icons

const QuestionView = function(props) {
	return <>
		{JSON.stringify(props.item)}
	</>
}

export default function ReviewPage(props) {

//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	var history = useHistory()
	const allFields = ['answer','mnemonics','images','media','tags','link','difficulty','comments','multiplechoicequestions']
	const {topic} = useParams('')
	function setTopic(topic) {
		history.push("/review/"+(topic ? topic : ''))
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
			} else if (key.key === "c" || key.key === "C" || key.key === "m" || key.key === "M") {
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
		console.log(['AUTOPLAY',field,item])
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
		//localStorage.setItem('questionsCategorySearchFilter',topic)
		scrollToTop()
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
	
	
	
	function nextReviewListItem(baseList) {
		console.log('next review item')
		if (props.user && props.user._id) {
			console.log('next review item user')
			if (Array.isArray(reviewList) && reviewList.length > 0) {
				var newList = reviewList.slice(0)
				console.log('next review item have list',JSON.stringify(newList))
				newList.shift()
				console.log('next review item ushifted',JSON.stringify(newList))
				setReviewList(newList)
				updateReviewItem(newList)
				setVisible(initVisible(newList[0]))
				scrollToTop()
			} else {
				updateReviewList(baseList)
				scrollToTop()
			} 
			
		}
	}
	
	function updateReviewList(baseList) {
		if (props.startWaiting) props.startWaiting()
		return new Promise(function(resolve,reject) {
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
						if (props.stopWaiting) props.stopWaiting()
						resolve()
					},true)
					
				})
			} else {
				if (props.stopWaiting) props.stopWaiting()
				resolve()
			}
		})
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
				<DropDownComponent value={topic} variant={'info'} onChange={setTopic} options={Array.isArray(props.topics) ? props.topics : []} />
				&nbsp;&nbsp;<b>{reviewList.length} items remaining</b>
			</span>}
  			{reviewItem && <div style={{clear:'both', paddingTop:'1em'}} >
				<h4>
				<Badge variant="info" style={{marginRight:'1em'}}>{progress && progress.successTally > 0 ? progress.successTally : 0}/{progress && progress.seenTally > 0 ? progress.seenTally : 0}</Badge>
					{questionText.join(' ')}</h4>
			<hr/>		
					<div>
					<ItemForm {...formProps}  editable={false}/></div>
			<hr/>
				<div style={{position: 'fixed', bottom: 0, left: 0, width:'100%'}} >
					{reviewItem && <Row>
						<Col className='xs-2' >
							{(reviewItem && Array.isArray(reviewItem.mnemonics) && reviewItem.mnemonics.length > 0) && <Button variant="info" size="sm" onClick={function(e) {
								showField('mnemonics')
								updateReviewItem()
							}} style={{display:'inline', height:'3.5em', width:'3.5em', marginRight:'1em'}}  title="Show clues" >{infoIcon}</Button>}
								
							<Button variant="warning" size="sm" onClick={function(e) {
								showFields(allFields)
								updateReviewItem()
							}} style={{display:'inline', height:'3.5em', width:'3.5em'}}   title="Show Answer" >{viewIcon}</Button>
							
						</Col>
						
						
						<Col className='xs-8' style={{minWidth: '10em'}} >
							<span style={{width:'100%'}} >
								<Button onClick={function(e) {props.reviewApi.seen(props.user,reviewItem).then(function() {nextReviewListItem()})} } style={{display:'inline', height:'3.5em', width:'3.5em', marginRight:'1em'}}  variant="primary" title="More Review Needed" >{thumbDownIcon}</Button>
								<Button onClick={function(e) {props.reviewApi.success(props.user,reviewItem).then(function() {nextReviewListItem()})} } style={{display:'inline', height:'3.5em', width:'3.5em'}}    variant="success" title="Enough Review For Now" >{thumbUpIcon}</Button>
							</span>
						</Col>
						<Col className='xs-2' >
							<Button onClick={function(e) {if (window.confirm('Block this question from your review list ?')) props.reviewApi.block(props.user,reviewItem).then(function() {nextReviewListItem()})} }   style={{float:'right', marginRight:'2em'}} variant="danger" title="Block" >{blockOnIcon}</Button>
						</Col>
					</Row>}
				</div>
			</div>}
  			
			<br/>
			<br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
        
}
    
      //
         
							//<DropDownSelectorComponent variant="info" title={'Show'} buttonContent={viewIcon} value={''} options={viewOptions} onChange={function(value) {
							   //switch(value) {
								   //case 'Clues':
									 //showField('mnemonics')
									 //updateReviewItem()
									 //break;
								   ////case 'Image':
									 ////showField('images')
									 ////updateReviewItem()
									 ////break;
								   //case 'Answer':
								   //console.log('showanswer')
									 //showFields(allFields)
									 //updateReviewItem()
									 //break;
								   ////case 'More Info':
									 ////showField('link')
									 ////updateReviewItem()
									 ////break;
								   
								   //default:
								     //break;
							   //}	
							//}} />
