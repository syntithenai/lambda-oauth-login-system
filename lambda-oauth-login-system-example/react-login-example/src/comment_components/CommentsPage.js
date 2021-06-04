import React,{useState,useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link, useParams, useHistory} from 'react-router-dom'
import {getAxiosClient, scrollToTop, getDistinct} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
//import ItemForm from './ItemForm'
import DropDownComponent from '../form_field_components/DropDownComponent'
//import DropDownSelectorComponent from './DropDownSelectorComponent'
//import { Fragment, PureComponent } from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import SortDropDown from '../components/SortDropDown'
//import AutoSizer from 'react-virtualized-auto-sizer'
//import CheckboxComponent from './CheckboxComponent'
//import TagsComponent from './TagsComponent'
//import MediaEditorComponent from './MediaEditorComponent'
//import RatingsComponent from './RatingsComponent'
//import DropDownComponent from './DropDownComponent'
//import TextComponent from './TextComponent'
//import TextareaComponent from './TextareaComponent'
//import SelectComponent from './SelectComponent'
//import ItemListComponent from './ItemListComponent'
import CommentListRow from '../comment_components/CommentListRow'
import { addLeadingZeros} from '../helpers'  
import commentsMeta from '../formMeta/commentsMeta'
import icons from '../icons'
const {viewIcon, replyIcon, searchIcon} = icons

const localForage = require('localforage')

export default function CommentsPage(props) {
	const commentsProps = props
	
	var listRef = React.useRef(null);
	const axiosClient = commentsProps.isLoggedIn() ? getAxiosClient(commentsProps.user.token.access_token) : getAxiosClient()
	const {saveField, deleteItem, searchItems, items, setItems, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, setItemCount, isItemLoaded, setSort, dispatch, refreshItem, collatedItems} =       useLocalForageAndRestEndpoint(Object.assign({},props,{
		axiosClient:axiosClient,
		restUrl:commentsProps.restUrl ? commentsProps.restUrl : '/dev/handler/rest/api/v1/',
	}))
	var history = useHistory()
	const {topic} = useParams('')
	function setTopic(topic) {
		history.push("/discuss/topic/"+(topic ? topic : ''))
	} 
	
	//useEffect(function() {
		//setCategorySearchFilter(topic)
	//},[topic])
	
	//console.log(props)
	
	//const [unfilteredItems, setUnfilteredItems] = useState([])
	//const [collatedItems, setCollatedItems] = useState([])
	//const [categoryOptions, setCategoryOptions] = useState([])
	var localForageLookups = localForage.createInstance({name:'lookups',storeName:'items'});
	const [topics,setTopics] = useState([])
	useEffect(function() {
		//var topics = props.topics.slice(0)
		//if (props.user && props.user._id) topics.push(props.user.avatar + "'s Notes")
		//setCategoryOptions(topics)
		localForageLookups.getItem('commenttopics').then(function(t) {
			setTopics(t)
			if (!Array.isArray(t) || commentsProps.autoRefresh) {
				getDistinct(axiosClient,'/dev/handler/rest/api/v1/','comments','questionTopic').then(function(t) {
					console.log('APPDISTINCT TAGS')
					setTopics(t)
					localForageLookups.setItem('commenttopics',t)
				})
			}
		})	
		//var filter = localStorage.getItem('questionsCategorySearchFilter')
		////console.log(['DISCOINIT',filter,categorySearchFilter])
		//if (filter.trim()) {
			//setCategorySearchFilter(filter)
		//}
	},[])
	
	//const [collatedItems,setCollatedItems] = useState([])
	//useEffect(function() {
		////if (Array.isArray(items)) {
			////var newItems = {}
			////var itemIndex = {}
			////var children = {}
			////var parentIds = []
			////items.forEach(function(item) {
				////if (item && item._id) {
					////itemIndex[item._id] = item
					////children[item._id] = []
					////parentIds.push(item._id)
				////}
			////})
			////items.forEach(function(item) {
				////// collate children where parent is in list
				////console.log(['COLLATED ITEM'])
				////if (Array.isArray(parentIds) && item && item._id && item.parentComment && Array.isArray(children[item.parentComment]) && parentIds.indexOf(item.parentComment) != -1) {
					////children[item.parentComment].push(item)
					////delete itemIndex[item._id]
					//////console.log('COLLATED CHILD')
					//////var newItem = newItems[item._id]
					//////var children = Array.isArray(newItem.children) ? newItem.children : []
					//////children.push(item)
					//////newItem.children = children
					//////if (newItem.updated_date < item.updated_date)  newItem.updated_date = newItem.updated_date
					//////newItems[item._id] = newItem
					//////var children = Array.isArray(children[item._id]) ? children[item._id] : []
					//////newItems[item._id] = Object.assign({},item,{children:children})
				////} else {
					
					//////if (item && item._id) 
					//////newItems[item._id] = item
				////}
			////})
			////Object.keys(children).forEach(function(key) {
				////var childs = children[key]
				////if (childs && childs.length > 0) {
					////itemIndex[key].children = childs
				////}
			////})
			
			
			////var collatedArray = Object.values(itemIndex)
			////collatedArray.sort(function(a,b) {
				////if (a && b && a.updated_date < b.updated_date) {
					////return 1
				////} else {
					////return -1
				////}
				
			////})
			////setCollatedItems(collatedArray)
			////console.log('COLLATED')
			////console.log(collatedArray)
		////}
		//setCollatedItems(items)
	//},[items])
	
	//var localForageLookups = localForage.createInstance({name:'lookups',storeName:'items'});
		

	//useEffect(function() {
		//if ((!categoryOptions || !Array.isArray(categoryOptions)) && props.useCategorySearch) {
			//console.log('LISTDISTINCT TAGS '+props.modelType)
			//getDistinct(axiosClient, (props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/'), props.modelType, props.useCategorySearch).then(function(list) {
				//setCategoryOptions(list)
			//})
		//}
	//},[])
	//useEffect(function() {
		//setCollatedItems(collatedItems.concat(items))
	//},[items])
	
   // var createInterval = null
	const minimumBatchSize = commentsProps.minimumBatchSize ? commentsProps.minimumBatchSize : 50

	function searchItemsEvent(e) {
		if (e) e.preventDefault()
		console.log(['SEARCH',categorySearchFilter,searchFilter])
		// default search allow all
		//setCollatedItems([])
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		//if (searchFilter || categorySearchFilter) {
			console.log(['SEARCHFILTER',getSearchFilter()])
			searchItems(getSearchFilter(),function(iitems) {
				console.log(['SEARCH res',iitems])
				//setUnfilteredItems(items)	
				setItemCount( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
				
			},(minimumBatchSize))
		//}
	}
	
	function searchItemsNow(filter) {
		// default search allow all
		//setCollatedItems([])
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		searchItems(getSearchFilter(categorySearchFilter,filter),function(iitems) {
			//setUnfilteredItems(items)	
			setItemCount( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
			
		},(minimumBatchSize))
	}
	
	
	
	
	function setSearchFilterEvent(e) {
		setSearchFilter(e.target.value)
	}
	
	function setCategorySearchFilterEvent(e) {
		setTopic(e)
		if (props.startWaiting) props.startWaiting()
		dispatch({type:'replaceall', items: []})
		searchItems(getSearchFilter(e,searchFilter),function(iitems) {
			setItemCount( iitems.length + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
			if (props.stopWaiting) props.stopWaiting()
			if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
			//setCollatedItems(items)	
		},(commentsProps.minimumBatchSize ? commentsProps.minimumBatchSize : 50))
	}
	
	
	//itemSize: function(key,items,searchFilter) {
			//if (items && key && items[key]) {
				//var comment = (items[key].comment) ? items[key].comment : ''
				////console.log([comment,comment.length, (parseInt(comment.length / 45) * 10)] )
				//return 200 + (parseInt(comment.length / 45) * 10)
			//} else {
				//return 200
			//}
		 //}
	function getItemSize(key,items,fieldMeta) {
		// TODO
		// switch on window width
		//return 100
		//console.log(['SIZE',key,items,fieldMeta,items[key]])
		var size = 0
		const lineHeight = 50 
		
		// empty 
		//if ( !Array.isArray(items) || !items[key]) {
			////console.log(['SIZE empty',key,items])
			////return 0
		//}
		if (items && key && items[key]) {
			var childBoost = 0
			if (Array.isArray(items[key].children))  {
				childBoost = items[key].children * 100
			}
			var comment = (items[key].comment) ? items[key].comment : ''
			//console.log([comment,comment.length, (parseInt(comment.length / 45) * 10)] )
			return childBoost + 400 + (parseInt(comment.length / 45) * 10)
		} else {
			return 400
		}
		
	}
	
	useEffect(function() {
		if (commentsProps.items) {
			setItems(commentsProps.items)
			setItemCount(commentsProps.items.length)
		} else {
			searchItemsEvent()		
		}
		//	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[commentsProps.items,commentsProps.user]) 
	
	function lsetSort(val) {
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		setSort(val)
		
	}
	
	//if (false && !props.isLoggedIn()) {
		//return <div style={{width:'100%'}}>    </div>
	//} else {
		return <div style={{width:'100%'}}>   
		    <div style={{zIndex:990, backgroundColor: 'white', position: 'fixed', top: 67, left: 0, width: '100%'}} >
				<form onSubmit={searchItemsEvent} >
					{commentsProps.useCategorySearch && <span style={{float:'left'}} ><DropDownComponent value={topic} variant={'info'} onChange={setCategorySearchFilterEvent} options={Array.isArray(topics) ? topics : []} /></span>}
					<span style={{float:'left', border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
						<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={searchFilter} onChange={setSearchFilterEvent} />
						<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {setSearchFilter(''); searchItemsNow(' ') }} title="Clear">&times;</span>
					</span>
					&nbsp;
					<Button style={{float:'left', marginLeft:'0.2em'}} onClick={searchItemsEvent} variant={'info'} >{searchIcon}</Button>
					&nbsp;
					
					{typeof commentsProps.sortOptions === "object" && <span style={{float:'left', marginLeft:'0.2em'}} ><SortDropDown setSort={lsetSort} options={commentsProps.sortOptions} /></span>}
				</form>
			</div>
			<div style={{height: '6em'}} ></div>
			<div className="d-none d-md-block d-lg-none" style={{ height:'2em'}}  ></div>	
			<div className="d-none d-sm-block d-md-none" style={{height: '3em'}} ></div>	
			<div className="d-block d-sm-none" style={{height: '4em'}} ></div>	
				
				<InfiniteLoader
					isItemLoaded={isItemLoaded}
					itemCount={itemCount}
					loadMoreItems={loadMoreItems}
					minimumBatchSize={commentsProps.minimumBatchSize ? commentsProps.minimumBatchSize : 50}
					threshold={commentsProps.threshold ? commentsProps.threshold : 5}
				  >
					{({ onItemsRendered, ref }) => {
					  return <List
						ref={listRef}
						className="List"
						height={commentsProps.height ? commentsProps.height : (window.outerHeight - window.outerHeight*0.1)} 
						itemData={Object.assign({},commentsProps,{
							items: (commentsProps.liveSearchFilter 
								? collatedItems.map(function(item,ik) {
									//console.log(['chgeck',item])
									if (searchFilter.trim().length === 0 || commentsProps.liveSearchFilter(searchFilter,item)) {
										//console.log(['chgeck NOT HIDDEN',item])
										return item
									} else {
										//console.log(['chgeck HIDDEN',item])
										// itemkey is index in unfiltered parent list
										return Object.assign({},item,{itemkey: ik, hidden_in_list:true})
									} 
								}) 
								: collatedItems),
							//isLoggedIn: props.isLoggedIn,
							//lookups: props.lookups,
							//setLookups: props.setLookups,
							axiosClient: axiosClient, 
							user: commentsProps.user,
							//isEditable: props.isEditable,
							//buttons: props.buttons,
							saveField: function (field, value, item, key, delay) {
								return new Promise(function(resolve,reject) {
									saveField(field, value, item, key, delay).then(function(res) {
										//onItemsRendered()
										//console.log(['resetindex',listRef, listRef && listRef.current ? listRef.current.resetAfterIndex : null, listRef.current])
										if (listRef && listRef.current && listRef.current.resetAfterIndex) listRef.current.resetAfterIndex(key ) 
										resolve(res)
									})
								})
							},
							refreshItem: commentsProps.showRefreshButton ? refreshItem : null ,
							deleteItem: deleteItem,
							searchFilter: searchFilter,
							//setCollatedItems: setCollatedItems,
							fieldMeta: commentsProps.fieldMeta(commentsProps),
							matchUrl: commentsProps.match.url+"/",
							//reviewApi: props.reviewApi
						})}
						itemCount={itemCount}
					
						itemSize={function(key) {
							//return 400
							return getItemSize(key,collatedItems,commentsProps.fieldMeta(props))
						}}
						onItemsRendered={onItemsRendered}
						width={commentsProps.width ? commentsProps.width : '100%'}
					  >
						{commentsProps.itemListRowComponent ? commentsProps.itemListRowComponent : CommentListRow}
					  </List>
					}}
				 </InfiniteLoader>
        </div>
     //}   

}


	

   //props.height ? props.height : window.outerHeight - window.outerHeight*0.3}      
