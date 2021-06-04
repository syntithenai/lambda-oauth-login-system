import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button, Navbar, Dropdown} from 'react-bootstrap'
import {Link, useLocation} from 'react-router-dom'
import {getAxiosClient} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
import CountDownTimerComponent from './components/CountDownTimerComponent'

import icons from './icons'
const {grabIcon,lightningIcon} = icons



export default function NavbarComponent(props) {
	
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveItem,saveQueue} = useLocalForageAndRestEndpoint({user: props.user, modelType:'grabs',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, autoRefresh: props.autoRefresh ? true : false })
	
	const [textSelected,setTextSelected] = useState(false)
	const [selectedText,setSelectedText] = useState('')
	
	
	useEffect(function() {
		props.reviewApi.getStreak().then(function(days) {props.setStats(Object.assign({},props.stats,{streak:days}))})
		
		window.onmouseup = function(e) {
			//console.log(['sel',e,'' + document.getSelection()])
			var selected = '' + document.getSelection()
			setTextSelected(selected ? true : false)
			setSelectedText(selected)
		}
	},[])
	
	function sendGrab(text) {
		var params = {
			url : window.location.href,
			text : selectedText,
		}
		console.log(params)
		saveItem(params).then(function() {
			saveQueue()
			document.getSelection().empty()
			setTextSelected(false)
			setSelectedText('')
			
		})
	}
	
	const location = useLocation();
  //console.log(location); 
	const pathParts = location.pathname.split('/')
	const path = pathParts.length > 1 ? pathParts[1] : ''
	const pageTitle = path.length > 0 ? path[0].toUpperCase() + path.slice(1) : ''
	var filter = ''
	if (pathParts.length > 2 && pathParts[1] === "review") {
		filter = pathParts[2]
	} else if (pathParts.length > 2 && pathParts[1] === "discover") {
		filter = pathParts[2]
	} if (pathParts.length > 3 && pathParts[1] === "discuss" && pathParts[2] === "topic") {
		filter = pathParts[3]
	} if (pathParts.length > 3 && pathParts[1] === "search" && pathParts[2] === "topic") {
		filter = pathParts[3]
	}
	console.log([pathParts,filter]); 
	//localStorage.getItem('questionsCategorySearchFilter')
	const pageParam = filter ? '/' + filter : ''
	//.pathParts.length > 2 ? '/' + pathParts[2] : ''
//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	
	///discuss/topic/:topic
	///search/topic/:topic
	///review/:topic
	///discover/:topic
	
	//const [pageTitle, setPageTitle] = useState('')
						
    return <Navbar  bg="dark" variant="dark"  style={{zIndex: 9999, width:'100%', border:'', position: 'fixed', top: 0, left: 0}} >
      <div style={{width:'100%'}}>   
            <React.Fragment>
				<img alt="Mnemos' Library" src="/mnemoicon-100.png" style={{float: 'left', clear: 'right', height: '2.6em', marginRight: '1em'}} />
				
				{props.loginCheckActive && <span><Link to="/login/login" ><Button style={{float:'right'}} variant="warning"  >{'Checking Login'}</Button></Link></span>}
				
				{<Dropdown variant="info"  style={{zIndex:9999, float:'left'}}>
				  <Dropdown.Toggle style={{zIndex:9999}}  variant="info" id="dropdown-basic">
					<span>{pageTitle}</span>
				  </Dropdown.Toggle>

				  <Dropdown.Menu style={{zIndex:9999}} >
					<Dropdown.Item href={"#/search/topic"+pageParam}>Search</Dropdown.Item>
					<Dropdown.Item href={"#/discuss/topic"+pageParam}>Discuss</Dropdown.Item>
					<Dropdown.Item href={"#/discover"+pageParam}>Discover</Dropdown.Item>
					<Dropdown.Item href={"#/review"+pageParam}>Review</Dropdown.Item>
					<Dropdown.Item href={"#/feed"+pageParam}>Feed</Dropdown.Item>
					<Dropdown.Item href={"#/login/profile"}>Profile</Dropdown.Item>
					
				  </Dropdown.Menu>
				</Dropdown>}
				
				
				{(!props.loginCheckActive && props.isLoggedIn()) && 
					<span>
						
						
						{props.queueActive && <Button   variant="disabled" >Saving</Button>}
						{(props.itemsQueued && !props.queueActive) && <Button   variant="disabled" >Changed</Button>}
						<Link to="/login/logout" ><Button  style={{float:'right'}} variant="danger"  >{'Logout'}</Button></Link>
						<Link to="/login/profile" ><Button style={{float:'right'}} variant="primary"  >{'Profile'}</Button></Link>
					</span>
				}
				{(!props.loginCheckActive && !props.isLoggedIn()) && 
					<Link to="/login/login" ><Button  style={{float:'right'}}  variant="success"  >{'Login'}</Button></Link>
				}
				
				
				<span style={{float:'right', marginRight:'1em'}}><CountDownTimerComponent onFinishTimer={props.onFinishTimer} /></span>
				
				{(props.stats.streak > 0) && <Button style={{float:'right', marginRight:'1em'}} >{lightningIcon}&nbsp;{props.stats && props.stats.streak}</Button>}
				
				{props.user && props.user._id && textSelected && <Button onClick={sendGrab} style={{float:'right', marginRight:'1em'}}  variant="success" >{grabIcon}</Button>}
				
			</React.Fragment>
		
        </div>
        
    </Navbar>

}
         
