import React,{useState, useEffect} from 'react';
import {HashRouter as  Router, Route  , Switch} from 'react-router-dom'
import {ExternalLogin, LoginSystem, waitingImage} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
import QuestionsEditor from './QuestionsEditor'
import QuestionEditor from './QuestionEditor'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import CheckboxComponent from './components/CheckboxComponent'
import TagsComponent from './components/TagsComponent'
import MediaEditorComponent from './components/MediaEditorComponent'
import RatingsComponent from './components/RatingsComponent'
import DropDownComponent from './components/DropDownComponent'
import TextComponent from './components/TextComponent'
import TextareaComponent from './components/TextareaComponent'

import ItemSingle from './components/ItemSingle'
import ItemList from './components/ItemList'
import questionsMeta from './formMeta/questionsMeta'
import questionMnemonicMeta from './formMeta/questionMnemonicMeta'

//import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
import {getAxiosClient, getDistinct} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
const localForage = require('localforage')

const autoRefresh = false 
 
const RESTURL='/dev/handler/rest/api/v1/'
function App(props) {
	
	 var loginServer = (process.env.REACT_APP_LOGIN && process.env.REACT_APP_LOGIN.trim()) ? process.env.REACT_APP_LOGIN : window.loginServer
	 const [waiting,setWaiting] = useState(false)
	 const [queueActive,setQueueActive] = useState(false)
	 const [itemsQueued, setItemsQueued] = useState(false)
	 const autoSaveDelay = 3000 
	const [tags,setTags] = useState([])
	const [topics,setTopics] = useState([])
	const axiosClient = getAxiosClient()
	var localForageLookups = localForage.createInstance({name:'lookups',storeName:'items'});
			
	//const tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//const topicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	useEffect(function() {
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
		
		//tagsDB.searchItemsNow({},function(tags) {
			//console.log(['LOADEDTAGS',tags])
		//},400,0,{title:1})
		//topicsDB.searchItemsNow({},null,400,0,{topic:1})
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
	  }
	  
	  function onStartSaveQueue() {
		  setQueueActive(true)	  
	  }
	  
	 function onFinishSaveQueue() {
		 //console.log('saved')
		  setItemsQueued(false)
		  setQueueActive(false)
	  }
	 //var startWaiting  = null, stopWaiting = null
	
	
	 return (
		 <ExternalLogin  
				loginServer={loginServer}
				loginRedirect={'/test'}	
				logoutRedirect={'/'}
				buttons={['google','twitter','facebook','github','amazon']}
				refreshInterval={6000000}
				startWaiting={startWaiting} stopWaiting={stopWaiting}
				>{(loginContext) => {
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
						 autoRefresh: autoRefresh
					 })
					 const questionSingleProps = Object.assign({},editorProps, {
						 modelType: 'questions', 
						 populate: [{"path":"mnemonics"},{"path":"comments"},{"path":"multipleChoiceQuestions"}], 
						 fieldMeta: questionsMeta,
						 createItem: function(value) {
							 console.log('createIteddm')
							console.log(value)
				
							return {quiz: value} 
						 }
					 })
					 const questionListProps = Object.assign({},questionSingleProps,{
						itemSize: function(key,items,searchFilter) {return 1050},
						useCategorySearch: "quiz",
						//categoryOptions: topics,
						sortOptions: {_id: 'ID', question: 'Question', answer: 'Answer',updated_date: 'Updated Date'},
						defaultSort: {question:1},
						minimumBatchSize: 20
					 })
					 //const questionMnemonicSingleProps = {
						 //modelType: 'mnemonics', 
						 //fieldMeta: questionMnemonicMeta						 
					 //}
					 
					 return  <React.Fragment>
					  
					  <Router >
					    
					    {(waiting) && <div className="overlay" style={{zIndex:999, position:'fixed', top: 0, left:0, width:'100%', height:'100%', opacity: 0.5, backgroundColor:'grey'}} onClick={stopWaiting} ><img alt="waiting" style={{position: 'fixed' ,top: '100px', left: '100px', width: '100px', height: '100px'}} src={waitingImage} onClick={stopWaiting} /></div>}
                       
					    <NavbarComponent loginCheckActive={loginContext.loginCheckActive} itemsQueued={itemsQueued}  user={loginContext.user} queueActive={queueActive} isLoggedIn={loginContext.isLoggedIn}   />
					    
						<Switch>
							<Route  path={`/login`}  render={(props) => <LoginSystem  {...loginContext} hideButtons={true}  match={props.match}  history={props.history}  location={props.location}  />}  />
							
							<Route  path={`/questions/new/:topic`}  render={(props) => <ItemSingle  {...questionSingleProps} 
								match={props.match}  history={props.history}  location={props.location} 
							  />}
							/>
							<Route  path={`/questions/new`}  render={(props) => <ItemSingle  {...questionSingleProps} 
								match={props.match}  history={props.history}  location={props.location} 
							  />}
							/>
							<Route  path={`/questions/:id`}  render={(props) => <ItemSingle  {...questionSingleProps} 
								match={props.match}  history={props.history}  location={props.location} 
							  />}
							/>
							
							
							<Route  path={`/questions`}  render={(props) => <ItemList  {...questionListProps} 
								match={props.match}  history={props.history}  location={props.location} 
								dliveSearchFilter={function(value,item) {
									if (item) {
										if (item.question && item.question.indexOf(value) !== -1) {
											return true
										} else if (item.answer && item.answer.indexOf(value) !== -1) {
											return true
										} else if (item.feedback && item.feedback.indexOf(value) !== -1) {
											return true
										}
									}
									return false 
								}}
								/>}  
							/>
							
							  />
							
							<Route  path={`/loggedin`} component={function(props) {return <b>{loginContext.isLoggedIn() && <b>Logged In => {JSON.stringify(loginContext.user)}</b>}{!loginContext.isLoggedIn() && <b>NOT Logged In</b>}</b>   }} />
						</Switch>
						</Router>
					  </React.Fragment>
				}}
		 </ExternalLogin>         
	  );

}

export default App;



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
