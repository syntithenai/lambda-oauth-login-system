import React,{useState, useEffect} from 'react';
import {HashRouter as  Router, Route  , Switch, Link} from 'react-router-dom'
import {ExternalLogin, LoginSystem, waitingImage} from 'lambda-oauth-login-system-react-components'
import NavbarComponent from './NavbarComponent'
import ReviewApi from './ReviewApi'
import ReviewPage from './ReviewPage'
import DiscoverPage from './DiscoverPage'
import FeedPage from './FeedPage'
import CommentsPage from './comment_components/CommentsPage'
import QuestionList from './question_components/QuestionList'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Badge} from 'react-bootstrap'

import ItemSingle from './components/ItemSingle'
import ItemList from './components/ItemList'
//import questionsMeta from './formMeta/questionsMeta'
import questionProps from './props/questionProps'
import commentProps from './props/commentProps'
//import questionsMiniMeta from './formMeta/questionsMiniMeta'
import {getAxiosClient, getDistinct,analyticsEvent, addLeadingZeros} from './helpers'  
import ReactGA from 'react-ga';
import useTopicsAndTags from './useTopicsAndTags'
import icons from './icons'
const {starOffIcon, blockOnIcon, blockOffIcon, viewIcon, replyIcon} = icons
 
const RESTURL='/dev/handler/rest/api/v1/'
const autoRefresh = false 
const autoSaveDelay = 3000 	

function App(props) {
	 
	// analytics   
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
	
	// user progress stats in app state 
	const [stats,setStats]= useState({streak: 0})
	//const [onFinishTimer, setOnFinishTimer] = useState(function(a) {console.log('fin tim '+a)})
	
	// callbacks for timer finished and set function to run on timer finish
	var onFinishTimer = function(a) {
		var seconds = parseInt((new Date().getTime()/1000 - a))
		alert('Finished '+seconds+' second timer')
	}
	function setOnFinishTimer(fn) {
		onFinishTimer = fn
	}
	
	//const [axiosClient,setAxiosClient] = useState()
	const axiosClient = getAxiosClient()
	const {tags, topics, setTags, setTopics, addTag, addTopic} = useTopicsAndTags({axiosClient, restUrl: RESTURL, autoRefresh: autoRefresh})
    
    
     
    // warning on window unload if still saving queue
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
	
	
	// notifications from nested components
	 function startWaiting() {
		  setWaiting(true)
	  }
	  function stopWaiting() {
		  setWaiting(false)
	  }
	  function onItemQueued() {
		  setItemsQueued(true)
		  setSavedOnline(false)
	  }
	  function onStartSaveQueue() {
		  setQueueActive(true)	  
	  }
	  function onFinishSaveQueue() {
		  setItemsQueued(false)
		  setQueueActive(false)
		  setSavedOnline(true)
	  }
	  
	 function onLogin(user) {
		  console.log('APLOGIN')
		  if (user && user._id) {
			  axiosClient = getAxiosClient(props.user.token.access_token)
			//getAxiosClient(props.user.token.access_token).then(function(res) {setAxiosClient(res) })
	      } else {
			  axiosClient = getAxiosClient()
		  	//getAxiosClient().then(function(res) {setAxiosClient(res) })
		  }
		  
		  //setAxiosClient(user && user._id ? getAxiosClient(props.user.token.access_token) : getAxiosClient())
	  }
	  
	  function onLogout() {
		  console.log('APLOGOUT')
		  axiosClient = getAxiosClient()
		  //getAxiosClient().then(function(res) {setAxiosClient(res) })
	  }
	 
	 
	 const appProps = {
		autoSaveDelay: autoSaveDelay,
		autoRefresh: autoRefresh,
		restUrl: RESTURL,
		axiosClient: axiosClient,
		setOnFinishTimer: setOnFinishTimer,
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
		addTag: addTag,
		addTopic: addTopic,
	 }
	 //loginRedirect={'/discover'}	
				//logoutRedirect={'/'}
	 return (
		 <ExternalLogin  
				onLogin={onLogin}
				onLogout={onLogout}
				loginServer={loginServer}
				buttons={['google','twitter','facebook','github','amazon']}
				refreshInterval={6000000}
				startWaiting={startWaiting} stopWaiting={stopWaiting}
				>{(loginContext) => {
					 return  <React.Fragment>
					  <ReviewApi {...appProps} {...loginContext} >
						{(reviewApi) => {
							const editorProps = Object.assign({},loginContext,{
								buttons: null, // clear from loginsystem
								reviewApi: reviewApi,
								//user: loginContext.user,
								//isLoggedIn:loginContext.isLoggedIn,
							 },appProps)
							 //var populate = [{"path":"mnemonics"},{"path":"comments"},{"path":"multipleChoiceQuestions"}]
							 //if (loginContext.user && loginContext.user._id) populate.push({"path": "userquestionprogresses", "match":{"user":{"$eq":loginContext.user._id}}}) 
							 const questionSingleProps = Object.assign({},editorProps,questionProps(loginContext, reviewApi).single)
							 const questionListProps = Object.assign({},editorProps,questionProps(loginContext, reviewApi).list)
							 const reviewPageProps = questionSingleProps
							 const discoverPageProps = questionSingleProps
							 const feedPageProps = questionSingleProps
							
							const commentsProps = Object.assign({},editorProps, commentProps(loginContext))
							
							//console.log(['COMMENT PROPS',commentsProps])
						  return <Router >
							
							{(waiting) && <div className="overlay" style={{zIndex:999, position:'fixed', top: 0, left:0, width:'100%', height:'100%', opacity: 0.5, backgroundColor:'grey'}} onClick={stopWaiting} ><img alt="waiting" style={{position: 'fixed' ,top: '100px', left: '100px', width: '100px', height: '100px'}} src={waitingImage} onClick={stopWaiting} /></div>}
						   
							<NavbarComponent onFinishTimer={onFinishTimer} loginCheckActive={loginContext.loginCheckActive} itemsQueued={itemsQueued}  user={loginContext.user} queueActive={queueActive} isLoggedIn={loginContext.isLoggedIn} reviewApi={reviewApi} stats={stats} setStats={setStats} />
							
							{!loginContext.loginCheckActive && <Switch>
								<Route  path={`/login`}  render={(props) => <LoginSystem  {...loginContext} hideButtons={true}  match={props.match}  history={props.history}  location={props.location}  />}  />
								
								<Route  path={`/search/new/:topic`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/search/new`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/search/topic/:topic`}  render={(props) => <QuestionList  {...questionListProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/><Route  path={`/search/topic`}  render={(props) => <QuestionList  {...questionListProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/search/:id`}  render={(props) => <ItemSingle  {...questionSingleProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/search`}  render={(props) => <QuestionList  {...questionListProps} 
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
								
								<Route  path={`/discuss/new/:topic`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/discuss/topic/:topic`}  render={(props) => <CommentsPage  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/discuss/topic`}  render={(props) => <CommentsPage  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/discuss/new`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								<Route  path={`/discuss/:id`}  render={(props) => <ItemSingle  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
								  />}
								/>
								
								<Route  path={`/discuss`}  render={(props) => <CommentsPage  {...commentsProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								
								<Route  path={`/feed`}  render={(props) => <FeedPage  {...feedPageProps} 
									match={props.match}  history={props.history}  location={props.location} 
									/>}  
								/>	
								 
								<Route  path={`/loggedin`} component={function(props) {return <b>{loginContext.isLoggedIn() && <b>Logged In => {JSON.stringify(loginContext.user)}</b>}{!loginContext.isLoggedIn() && <b>NOT Logged In</b>}</b>   }} />
							</Switch>}
							</Router>
						  }}
						</ReviewApi>
					  </React.Fragment>
				}}
		 </ExternalLogin>         
	  );

}

export default App;
