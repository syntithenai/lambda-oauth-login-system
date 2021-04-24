import React,{useState, useEffect} from 'react';
import {HashRouter as  Router, Route  , Switch} from 'react-router-dom'
import {ExternalLogin, LoginSystem, waitingImage} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
//import QuestionsEditor from './QuestionsEditor'
//import QuestionEditor from './QuestionEditor'
import ReviewApi from './ReviewApi'
import ReviewPage from './ReviewPage'
import DiscoverPage from './DiscoverPage'
import FeedPage from './FeedPage'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Badge} from 'react-bootstrap'

//import CheckboxComponent from './components/CheckboxComponent'
//import TagsComponent from './components/TagsComponent'
//import MediaEditorComponent from './components/MediaEditorComponent'
//import RatingsComponent from './components/RatingsComponent'
//import DropDownComponent from './components/DropDownComponent'
//import TextComponent from './components/TextComponent'
//import TextareaComponent from './components/TextareaComponent'

import ItemSingle from './components/ItemSingle'
import ItemList from './components/ItemList'
import questionsMeta from './formMeta/questionsMeta'
import commentsMeta from './formMeta/commentsMeta'

import questionsMiniMeta from './formMeta/questionsMiniMeta'
//import questionMnemonicMeta from './formMeta/questionMnemonicMeta'

//import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
import {getAxiosClient, getDistinct,analyticsEvent} from './helpers'  
//import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
//import useMnemoReviewTools from './useMnemoReviewTools'
import ReactGA from 'react-ga';
 
const localForage = require('localforage')

 
//const starOnIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
  //<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
//</svg>

const starOffIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg> 

const blockOnIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-fill" viewBox="0 0 16 16">
  <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
</svg>

const blockOffIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
</svg>
 
 
const RESTURL='/dev/handler/rest/api/v1/'
function App(props) {
	   
	//useEffect(function() {
		//if (process.env.REACT_APP_ANALYTICS_KEY) {
			//ReactGA.initialize(process.env.REACT_APP_ANALYTICS_KEY);
			//analyticsEvent('Init')
		//}
	//})
	
    
	 var loginServer = (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer
	 const [waiting,setWaiting] = useState(false)
	 const [queueActive,setQueueActive] = useState(false)
	 const [itemsQueued, setItemsQueued] = useState(false)
	 const autoRefresh = false 
     const autoSaveDelay = 3000 
	const [tags,setTags] = useState([])
	const [topics,setTopics] = useState([])
	const axiosClient = getAxiosClient()
	var localForageLookups = localForage.createInstance({name:'lookups',storeName:'items'});
	//var reviewTools = useMnemoReviewTools()
	const [savedOnline,setSavedOnline] = useState(true)
	useEffect(function() {
		if (savedOnline) {
			window.onbeforeunload = null 
		} else {
			window.onbeforeunload = function (e) {
				e.preventDefault()
				e.returnValue = 'what';
                return "show warning";
            }
		}
	},[savedOnline])
	
	function updateLookups() {
		localForageLookups.getItem('tags').then(function(t) {
			setTags(t)
			if (!Array.isArray(t) || autoRefresh) {
				getDistinct(axiosClient,RESTURL,'questions','tags').then(function(t) {
					console.log('APPDISTINCT TAGS')
					setTags(t)
					localForageLookups.setItem('tags',t)
				})
			}
		})
		localForageLookups.getItem('topics').then(function(t) {
			setTopics(t)
			if (!Array.isArray(t) || autoRefresh) {
				getDistinct(axiosClient,RESTURL,'questions','quiz').then(function(t) {
					console.log('APPDISTINCT TOPICS')
					setTopics(t)
					localForageLookups.setItem('topics',t)
				})
			}
		}) 
	}
	
	
	function addTag(tag) {
		localForageLookups.getItem('tags').then(function(t) {
			var newT = t
			newT.push(tag)
			setTags(newT)
			localForageLookups.setItem('tags',newT)
		})
	}
	
	function addTopic(topic) {
		localForageLookups.getItem('topics').then(function(t) {
			var newT = t
			newT.push(topic)
			setTopics(newT)
			localForageLookups.setItem('topics',newT)
		})
	}
			
	//const tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//const topicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	useEffect(function() {
		updateLookups()
		
		//tagsDB.searchItemsNow({},function(tags) {
			//console.log(['LOADEDTAGS',tags])
		//},400,0,{title:1})
		//topicsDB.searchItemsNow({},null,400,0,{topic:1})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	



	 function startWaiting() {
		  setWaiting(true)
	  }
	  
	 function stopWaiting() {
		  setWaiting(false)
	  }
	  
	  function onItemQueued() {
		  //console.log('queued')
		  setItemsQueued(true)
		  setSavedOnline(false)
	  }
	  
	  function onStartSaveQueue() {
		  setQueueActive(true)	  
	  }
	  
	 function onFinishSaveQueue() {
		 //console.log('saved')
		  setItemsQueued(false)
		  setQueueActive(false)
		  setSavedOnline(true)
	  }
	 //var startWaiting  = null, stopWaiting = null
	
	
	 //function getColor(value){
		////value from 0 to 1
		//var hue=((value)*120).toString(10);
		//return ["hsl(",hue,",100%,50%)"].join("");
	//}
	 
	 return (
		 <ExternalLogin  
				loginServer={loginServer}
				loginRedirect={'/test'}	
				logoutRedirect={'/'}
				buttons={['google','twitter','facebook','github','amazon']}
				refreshInterval={6000000}
				startWaiting={startWaiting} stopWaiting={stopWaiting}
				>{(loginContext) => {
					 return  <React.Fragment>
					  <ReviewApi {...loginContext} >
						{(reviewApi) => {
							//console.log(reviewApi)
							const editorProps = Object.assign({},loginContext,{
								 autoSaveDelay: autoSaveDelay,
								 itemsQueued: itemsQueued,
								 onItemQueued: onItemQueued,
								 onStartSaveQueue: onStartSaveQueue,
								 onFinishSaveQueue: onFinishSaveQueue,
								 startWaiting: startWaiting,
								 stopWaiting: stopWaiting,
								 tags: tags,
								 topics: topics,
								 setTags: setTags,
								 setTopics: setTopics,
								 autoRefresh: autoRefresh,
								 reviewApi: reviewApi,
								 addTag: addTag,
								 addTopic: addTopic,
							 })
							 var populate = [{"path":"mnemonics"},{"path":"comments"},{"path":"multipleChoiceQuestions"}]
							 //if (loginContext.user && loginContext.user._id) populate.push({"path": "userquestionprogresses", "match":{"user":{"$eq":loginContext.user._id}}}) 
							 const questionSingleProps = Object.assign({},editorProps, {
								 modelType: 'questions', 
								 populate: populate, 
								 fieldMeta: questionsMeta,
								 createItem: function(item,key) {
									 console.log('createIteddm')
									console.log(item)
									var value = item.topic
									// filter allowable values by user
									var newValue = (value && loginContext.user && (loginContext.user.is_admin || (loginContext.user.avatar && value.indexOf(loginContext.user.avatar+"'s") === 0))) ? value : '';
									//console.log([newValue,loginContext.user.avatar])
									// empty then default notes
									if (!newValue && loginContext.user && loginContext.user._id && loginContext.user.avatar) {
										newValue =  loginContext.user.avatar+"'s Notes" 
									} 
									return {quiz: newValue, access:'private', discoverable:'yes'} 
								 },
								 //backgroundColor: getColor(item.progress.successRate > 0 ? item.progress.successRate * 2: 0), 
								 buttons:[
									 function(item, callback) { 
										 //console.log(['BC',item,item ? item.itemkey : 'none'])
										 if (item && item.progress && item.progress._id ) {
											 if (item.progress.block) {
												 return <Button key={item.itemkey} onClick={function(e) {reviewApi.unblock(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Blocked'} variant="danger" >{blockOnIcon}</Button> 
											 } else { 	
												return  <span key={item.itemkey} >
													<Button key="block" variant="secondary" onClick={function(e) {reviewApi.block(loginContext.user,item).then(function() {callback()})}} style={{float:'left', marginRight:'0.2em'}} title={ 'Block'} >{blockOffIcon}</Button> 
													<Button key="stats"  variant="success" style={{float:'left'}} title={'Under Review'} ><Badge>{item.progress.successTally > 0 ? item.progress.successTally : 0}/{item.progress.seenTally > 0 ? item.progress.seenTally : 0}</Badge></Button> 
													{(loginContext.user && loginContext.user.is_admin ) && <Button key="seen" variant="primary" onClick={function(e) {reviewApi.seen(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Seen'} >Seen</Button> }
													{(loginContext.user && loginContext.user.is_admin ) && <Button key="success" variant="success" onClick={function(e) {reviewApi.success(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Success'} >Success</Button> }
												</span>
											}
										 } else {
											 return <span key={item.itemkey} >
													<Button key="block" variant="secondary" onClick={function(e) {reviewApi.block(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Block'} >{blockOffIcon}</Button> 
													<Button key="seen" variant="secondary" style={{float:'left', marginLeft:'0.2em'}} onClick={function(e) {reviewApi.seen(loginContext.user,item).then(function() {callback()})}} title={ 'Add to Review'} >{starOffIcon}</Button></span>
										 }
									}
								]
							 })
							 const questionListProps = Object.assign({},questionSingleProps,{
								itemSize: function(key,items,searchFilter) {return 200},
								useCategorySearch: "quiz",
								 fieldMeta: questionsMiniMeta,
								//categoryOptions: topics,
								sortOptions: {_id: 'ID', question: 'Question', answer: 'Answer',updated_date: 'Updated Date',difficulty:'Difficulty'},
								defaultSort: {updated_date:-1},
								minimumBatchSize: 20000,
								height:window.innerHeight * 0.85,
							 })
							 //const questionListMiniProps = Object.assign({},questionListProps,{
								//fieldMeta: questionsMiniMeta
							 //})
							 //const questionSingleMiniProps = Object.assign({},questionSingleProps,{
								//fieldMeta: questionsMiniMeta
							 //})
							const reviewPageProps = {
								reviewApi: reviewApi, 
								categoryOptions: topics,
								user: loginContext.user,
								isLoggedIn:loginContext.isLoggedIn,
								fieldMeta: questionsMeta,
								autoSaveDelay: autoSaveDelay,
								 itemsQueued: itemsQueued,
								 onItemQueued: onItemQueued,
								 onStartSaveQueue: onStartSaveQueue,
								 onFinishSaveQueue: onFinishSaveQueue,
								 startWaiting: startWaiting,
								 stopWaiting: stopWaiting,
								 tags: tags,
								 topics: topics,
								 setTags: setTags,
								 setTopics: setTopics,
								 autoRefresh: autoRefresh,
								 
							}
							const discoverPageProps = reviewPageProps
							const feedPageProps = {}
							const commentsProps = Object.assign({},editorProps, {
								 modelType: 'comments', 
								 populate: [], 
								 useCategorySearch: 'topic',
								 fieldMeta: commentsMeta,
								 createItem: function(item,key) {
									console.log('createIteddm')
									console.log(item)
									//var value = item.topic
									//// filter allowable values by user
									//var newValue = (value && loginContext.user && (loginContext.user.is_admin || (loginContext.user.avatar && value.indexOf(loginContext.user.avatar+"'s") === 0))) ? value : '';
									////console.log([newValue,loginContext.user.avatar])
									//// empty then default notes
									//if (!newValue && loginContext.user && loginContext.user._id && loginContext.user.avatar) {
										//newValue =  loginContext.user.avatar+"'s Notes" 
									//} 
									//return {quiz: newValue, access:'private', discoverable:'yes'} 
									return {}
								  }
								 								
							})
							
							//console.log(reviewApi)
						  return <Router >
							
							{(waiting) && <div className="overlay" style={{zIndex:999, position:'fixed', top: 0, left:0, width:'100%', height:'100%', opacity: 0.5, backgroundColor:'grey'}} onClick={stopWaiting} ><img alt="waiting" style={{position: 'fixed' ,top: '100px', left: '100px', width: '100px', height: '100px'}} src={waitingImage} onClick={stopWaiting} /></div>}
						   
							<NavbarComponent loginCheckActive={loginContext.loginCheckActive} itemsQueued={itemsQueued}  user={loginContext.user} queueActive={queueActive} isLoggedIn={loginContext.isLoggedIn}   />
							
							<Switch>
								<Route  path={`/login`}  render={(props) => <LoginSystem  {...loginContext} hideButtons={true}  match={props.match}  history={props.history}  location={props.location}  />}  />
								
								<Route  path={`/search/new/:topic`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/search/new`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/search/:id`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/search`}  render={(props) => <ItemList  {...questionListProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
									
								<Route  path={`/review/:topic`}  render={(props) => <ReviewPage  {...reviewPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								<Route  path={`/review`}  render={(props) => <ReviewPage  {...reviewPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								<Route  path={`/discover/:topic`}  render={(props) => <DiscoverPage  {...discoverPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								<Route  path={`/discover`}  render={(props) => <DiscoverPage  {...discoverPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								
								
								<Route  path={`/comments/new/:topic`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/comments/new`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/comments/:id`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/comments`}  render={(props) => <ItemList  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								
								
								<Route  path={`/feed`}  render={(props) => <FeedPage  {...feedPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								  
								
								<Route  path={`/loggedin`} component={function(props) {return <b>{loginContext.isLoggedIn() && <b>Logged In => {JSON.stringify(loginContext.user)}</b>}{!loginContext.isLoggedIn() && <b>NOT Logged In</b>}</b>   }} />
							</Switch>
							</Router>
						  }}
						</ReviewApi>
					  </React.Fragment>
				}}
		 </ExternalLogin>         
	  );

}

export default App;
//dliveSearchFilter={function(value,item) {
										//if (item) {
											//if (item.question && item.question.indexOf(value) !== -1) {
												//return true
											//} else if (item.answer && item.answer.indexOf(value) !== -1) {
												//return true
											//} else if (item.feedback && item.feedback.indexOf(value) !== -1) {
												//return true
											//}
										//}
										


							//<Route  path={`/editor/new/:topic`}  render={(props) => <QuestionEditor  {...editorProps}  match={props.match}  history={props.history}  location={props.location}  />}  />
							
							//<Route  path={`/editor/new`}  render={(props) => <QuestionEditor  {...editorProps}  match={props.match}  history={props.history}  location={props.location}  />}  />
							
							//<Route  path={`/editor/:id`}  render={(props) => <QuestionEditor  {...editorProps}  match={props.match}  history={props.history}  location={props.location}  />}  />
							
							//<Route  path={`/editor`}  render={(props) => <QuestionsEditor  {...editorProps}  match={props.match}  history={props.history}  location={props.location}  />}

//startWaiting={startWaiting} stopWaiting={stopWaiting}
//
  //ditems={[
									//{quiz:"stuff" ,question:'aaaa',answer:'walk',_id:'5be3cf1ff8ab4600852a6742'}, 
									//{quiz:"stuff" ,question:'ddd',answer:'swim',_id:'5be3cf1ff8ab4600852a6740'},
									//{quiz:"stuff" ,question:'cccc',answer:'fun',_id:'5be3cf1ff8ab4600852a1742'}, 
									//{quiz:"stuff" ,question:'ffff',answer:'sleep',_id:'5be3cf1ff8ab4600852a6730'}
								//]} 
								//ditemSize={function(key,items,searchFilter) {
									//var size=1050
									//console.log(['appi size',key,items,searchFilter])
									//var item = items && items.length > key && items[key]._id ? items[key] : null
									//if (item) {
										//if (item.question && item.question.indexOf(searchFilter) !== -1) {
											//return size
										////}
										 ////else if (item.answer && item.answer.indexOf(searchFilter) !== -1) {
											////return size
										////} else if (item.feedback && item.feedback.indexOf(searchFilter) !== -1) {
											////return size
										//} else {
											//return 1;
										//}
									//} else {
										//return 1
									//}
								//} }
								
								//ddefaultSortLabel="Question Asc" 
								//dliveSearchFilter={function(value,item) {
									//if (item) {
										//if (item.question && item.question.indexOf(value) !== -1) {
											//return true
										//} else if (item.answer && item.answer.indexOf(value) !== -1) {
											//return true
										//} else if (item.feedback && item.feedback.indexOf(value) !== -1) {
											//return true
										//}
									//}
									//return false 
								//}}              
