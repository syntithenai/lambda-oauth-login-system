import React,{useState,useEffect, useRef}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
import QuestionForm from './QuestionForm'
import DropDownComponent from './components/DropDownComponent'
import { createRef, Fragment, PureComponent } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const LOADING = 1;
const LOADED = 2;
var itemStatusMap = {};
	
class Row extends PureComponent {
  render() {
    const { index, style , data} = this.props;
    let label;
    
    var item = data && data.items && data.items[index]? data.items[index] : null
    const formProps = {
		isLoggedIn: data.isLoggedIn,
		tags: data.tags,
		topics: data.topics,
		setTags: data.setTags,
		setTopics: data.setTopics,
		axiosClient: data.axiosClient, 
		user: data.user,
		item: item ,
		saveField: data.saveField,
		itemkey: index
	}
    const editable = isEditable(item,data.user)
				
    return (
      <div className="ListItem" style={style}>
      		{(item && item._id) ? <div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}>
				
					{editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) data.deleteItem(item._id,index).then(function() {
						data.setCollatedItems(data.items.splice(index,1))
					})} } >Delete</Button>}
					
					{editable && <Link to={'/editor/'+item._id} ><Button style={{float:'right'}} variant="success" >Edit</Button></Link>}
					{(item && item._id) && <div>
					 
					 <QuestionForm  {...formProps} />
					 
					 </div>}
				</div> : null}
				
				
      </div>
    );
  }
}

function getSearchFilter(topicSearchFilter,searchFilter) {
	var filter = {}
	if (topicSearchFilter) {
		if (searchFilter) {
			filter = {"$and":[{"$text":{"$search":searchFilter}},{"quiz":topicSearchFilter}]}
		} else {
			filter = {"quiz":topicSearchFilter}
		}
	} else {
		if (searchFilter) {
			filter = {"$text":{"$search":searchFilter}}
		} else {
			filter = {}
		}
	}
	return filter
}

export default function QuestionsEditor(props) {
	const listRef = useRef();
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	
	const {saveField, deleteItem, searchItems, items} = useLocalForageAndRestEndpoint({modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay})
	
	const [collatedItems, setCollatedItems] = useState([])
	//useEffect(function() {
		//setCollatedItems(collatedItems.concat(items))
	//},[items])
	
	const [searchFilter,setSearchFilter] = useState(localStorage.getItem('questionsSearchFilter'))
   // var createInterval = null
	const [topicSearchFilter,setTopicSearchFilter] = useState(localStorage.getItem('questionsTopicSearchFilter'))
	
	
	  // Are there more items to load?
	  // (This information comes from the most recent API request.)
	  var hasNextPage = true

	  // Are we currently loading a page of items?
	  // (This may be an in-flight flag in your Redux store for example.)
	  var isNextPageLoading = false

	  // If there are more items to be loaded then add extra rows to hold a loading indicator.
	  const itemCount = collatedItems.length + (hasNextPage ? 100 : 0);

	// Every row is loaded except for our loading indicator row.
	//const isItemLoaded = index => !hasNextPage || index < items.length;
	const isItemLoaded = index => collatedItems[index] && collatedItems[index]._id;
	const loadMoreItems = (startIndex, stopIndex) => {
		console.log('loadMore')
		if (!isNextPageLoading && hasNextPage) {
			console.log('loadMore real')
		  isNextPageLoading = true
			
		  //for (let index = startIndex; index <= stopIndex; index++) {
			//itemStatusMap[index] = LOADING;
		  //}
		  return new Promise(resolve => {
			  
				searchItems(getSearchFilter(topicSearchFilter,searchFilter),function(items) {
				  //for (let index = startIndex; index <= stopIndex; index++) {
					//itemStatusMap[index] = LOADED;
				  //}
				  isNextPageLoading = false
				  if (items && items.length > 0) hasNextPage = true
				  else hasNextPage = false
				  var newCollatedItems = Array(stopIndex)
				  collatedItems.forEach(function(item,key) {
					  newCollatedItems[key] = item
				  })
				  items.map(function(item,k) {
					  newCollatedItems[startIndex + k] = item
				  })
				  setCollatedItems(newCollatedItems)
				  resolve();
				},stopIndex - startIndex + 1, startIndex)
			
		  });
	   }
	};



	function searchItemsEvent(e) {
		if (e) e.preventDefault()
		// default search allow all
		setCollatedItems([])
		searchItems(getSearchFilter(topicSearchFilter,searchFilter),function(items) {
			setCollatedItems(items)	
			if (listRef && listRef.current) listRef.current.scrollToItem(0, "top");
		})
	}
	
	function setSearchFilterEvent(e) {
		if (localStorage) localStorage.setItem('questionsSearchFilter',e.target.value)
		setSearchFilter(e.target.value)
	}
	
	function setTopicSearchFilterEvent(e) {
		if (localStorage) localStorage.setItem('questionsTopicSearchFilter',e)
		setTopicSearchFilter(e)
		searchItems(getSearchFilter(e,searchFilter),function(items) {
			setCollatedItems(items)	
		})
	}
	
	//useEffect(function() {
		////searchItemsEvent()	
			
	//},[]) 
	
	if (!props.isLoggedIn()) {
		return <div style={{width:'100%'}}>    </div>
	} else {
		return <div style={{width:'100%'}}>   
		    <div style={{zIndex:990, backgroundColor: 'white', position: 'fixed', top: 67, left: 0, width: '100%'}} >
				<Link style={{float:'right'}}  to={"/editor/new/"+topicSearchFilter} ><Button variant="success"  >Create New</Button></Link>
		    
				
				<form onSubmit={searchItemsEvent} >
					<DropDownComponent value={topicSearchFilter} variant={'info'} onChange={setTopicSearchFilterEvent} options={Array.isArray(props.topics) ? props.topics : []} />
					<span style={{border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
						<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={searchFilter} onChange={setSearchFilterEvent} />
						<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {if (localStorage) localStorage.setItem('questionsSearchFilter',''); setSearchFilter('')}} title="Clear">&times;</span>
					</span>
					
					<Button  variant="primary" onClick={searchItemsEvent} variant={'info'} >Search</Button>
					{false && collatedItems.length && <b>&nbsp;&nbsp;{collatedItems.length} match{collatedItems.length > 1 ? 'es' : ''}</b>}
				</form>
				

				
			</div>
			<InfiniteLoader
				isItemLoaded={isItemLoaded}
				itemCount={itemCount}
				loadMoreItems={loadMoreItems}
				minimumBatchSize={100}
			  >
				{({ onItemsRendered, ref }) => (
				  <List
					className="List"
					height={window.outerHeight - window.outerHeight*0.3}
					itemData={{
						items:collatedItems,
						isLoggedIn: props.isLoggedIn,
						tags: props.tags,
						topics: props.topics,
						setTags: props.setTags,
						setTopics: props.setTopics,
						axiosClient: axiosClient, 
						user: props.user,
						saveField: saveField,
						deleteItem: deleteItem,
						searchFilter: searchFilter,
						setCollatedItems: setCollatedItems
					}}
					itemCount={itemCount}
					itemSize={1100}
					onItemsRendered={onItemsRendered}
					ref={listRef}
					width={'100%'}
				  >
					{Row}
				  </List>
				)}
			 </InfiniteLoader>
			
        </div>
     }   

}
         
