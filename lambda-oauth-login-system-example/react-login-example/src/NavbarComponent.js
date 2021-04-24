import React,{useState, useEffect}  from 'react'; //, {Fragment, useState}
import {Button, Navbar, Dropdown} from 'react-bootstrap'
import {Link, useLocation} from 'react-router-dom'
import {getAxiosClient} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'

const grabIcon = <svg  height='1.3em' style={{color:'white'}}  width='2em' focusable="false"  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-hand-rock fa-w-16 fa-2x"><path fill="currentColor" d="M464.8 80c-26.9-.4-48.8 21.2-48.8 48h-8V96.8c0-26.3-20.9-48.3-47.2-48.8-26.9-.4-48.8 21.2-48.8 48v32h-8V80.8c0-26.3-20.9-48.3-47.2-48.8-26.9-.4-48.8 21.2-48.8 48v48h-8V96.8c0-26.3-20.9-48.3-47.2-48.8-26.9-.4-48.8 21.2-48.8 48v136l-8-7.1v-48.1c0-26.3-20.9-48.3-47.2-48.8C21.9 127.6 0 149.2 0 176v66.4c0 27.4 11.7 53.5 32.2 71.8l111.7 99.3c10.2 9.1 16.1 22.2 16.1 35.9v6.7c0 13.3 10.7 24 24 24h240c13.3 0 24-10.7 24-24v-2.9c0-12.8 2.6-25.5 7.5-37.3l49-116.3c5-11.8 7.5-24.5 7.5-37.3V128.8c0-26.3-20.9-48.4-47.2-48.8z" ></path></svg>

const stopwatchIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch" viewBox="0 0 16 16">
  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/>
  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"/>
</svg>

const pauseIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>

const stopIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stop-fill" viewBox="0 0 16 16">
  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
</svg>

export default function NavbarComponent(props) {
	
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveItem,saveQueue} = useLocalForageAndRestEndpoint({user: props.user, modelType:'grabs',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, autoRefresh: props.autoRefresh ? true : false })
	
	const [textSelected,setTextSelected] = useState(false)
	const [selectedText,setSelectedText] = useState('')
	
	//const [timeToEnd,setTimeToEnd] = useState(0)
	//var timer = null
	
	
	useEffect(function() {
		window.onmouseup = function(e) {
			//console.log(['sel',e,'' + document.getSelection()])
			var selected = '' + document.getSelection()
			setTextSelected(selected ? true : false)
			setSelectedText(selected)
		}
	})
	
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
	var filter = localStorage.getItem('questionsCategorySearchFilter')
	const pageParam = filter ? '/' + filter : ''
	//.pathParts.length > 2 ? '/' + pathParts[2] : ''
//<Link to="/editor" ><Button  variant="primary"  >{'Editor'}</Button></Link>
	
	
	
	//const [pageTitle, setPageTitle] = useState('')
						
    return <Navbar  bg="dark" variant="dark"  style={{zIndex: 9999, width:'100%', border:'', position: 'fixed', top: 0, left: 0}} >
      <div style={{width:'100%'}}>   
            <React.Fragment>
				<img alt="Mnemos' Library" src="/mnemoicon-100.png" style={{float: 'left', clear: 'right', height: '2.6em', marginRight: '1em'}} />
				
				{props.loginCheckActive && <span><Link to="/login/login" ><Button style={{float:'right'}} variant="warning"  >{'Checking Login'}</Button></Link></span>}
				
				{<Dropdown style={{zIndex:9999, float:'left'}}>
				  <Dropdown.Toggle style={{zIndex:9999}}  variant="success" id="dropdown-basic">
					<span>{pageTitle}</span>
				  </Dropdown.Toggle>

				  <Dropdown.Menu style={{zIndex:9999}} >
					<Dropdown.Item href={"#/search"}>Search</Dropdown.Item>
					<Dropdown.Item href={"#/comments"}>Discuss</Dropdown.Item>
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
				
				{props.user && props.user._id && textSelected && <Button onClick={sendGrab} style={{float:'right', marginRight:'1em'}}  variant="success" >{grabIcon}</Button>}
				
			</React.Fragment>
		
        </div>
        
    </Navbar>

}
         
