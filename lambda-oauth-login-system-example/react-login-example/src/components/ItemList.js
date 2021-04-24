import React,{useState,useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, scrollToTop} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
//import ItemForm from './ItemForm'
import DropDownComponent from './DropDownComponent'
//import DropDownSelectorComponent from './DropDownSelectorComponent'
//import { Fragment, PureComponent } from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import SortDropDown from './SortDropDown'
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
import ItemListRow from './ItemListRow'

//const LOADING = 1;
//const LOADED = 2;
//var itemStatusMap = {};


//const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  //<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
//</svg>


//const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  //<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  //<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
//</svg>

const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>

//const refreshIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  //<path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
  //<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
//</svg>

	

//.then(function() {
						//data.setCollatedItems(data.items.splice(index,1))
					////})
//class PlainRow extends PureComponent {
  //render() {
    //const { index, style , data} = this.props;
    //let label;
    
    //var item = data && data.items && data.items[index]? data.items[index] : null
					
	//return <div className="ListItem" style={style}>
		//<b>{(item && item.updated_date) && new Date(item.updated_date).toString()} {item && item.question} </b>&nbsp;
		//<br/>{(item && item.answer) && item.answer.slice(0,10) }
		//</div>
	//}
//}

export default function ItemList(props) {

//console.log(props)	
	

	var listRef = React.useRef(null);
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, deleteItem, searchItems, items, setItems, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, setItemCount, isItemLoaded, setSort, dispatch, refreshItem} = useLocalForageAndRestEndpoint({user: props.user, modelType:props.modelType,axiosClient:axiosClient,restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, populate: props.populate, useCategorySearch: props.useCategorySearch, minimumBatchSize : (props.minimumBatchSize ? props.minimumBatchSize : 50), defaultSort: props.defaultSort, defaultSortLabel: props.defaultSortLabel, autoRefresh: props.autoRefresh ? true : false})
	
	//const [unfilteredItems, setUnfilteredItems] = useState([])
	//const [collatedItems, setCollatedItems] = useState([])
	const [categoryOptions, setCategoryOptions] = useState([])
	useEffect(function() {
		var topics = props.topics.slice(0)
		if (props.user && props.user._id) topics.push(props.user.avatar + "'s Notes")
		setCategoryOptions(topics)
	},[props.topics,props.user])
	
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
	const minimumBatchSize = props.minimumBatchSize ? props.minimumBatchSize : 50

	function searchItemsEvent(e) {
		if (e) e.preventDefault()
		// default search allow all
		//setCollatedItems([])
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		if (searchFilter || categorySearchFilter) {
			searchItems(getSearchFilter(),function(iitems) {
				//setUnfilteredItems(items)	
				setItemCount( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
				
			},(minimumBatchSize))
		}
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
		setCategorySearchFilter(e)
		if (props.startWaiting) props.startWaiting()
		dispatch({type:'replaceall', items: []})
		searchItems(getSearchFilter(e,searchFilter),function(iitems) {
			setItemCount( iitems.length + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
			if (props.stopWaiting) props.stopWaiting()
			if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
			//setCollatedItems(items)	
		},(props.minimumBatchSize ? props.minimumBatchSize : 50))
	}
	
	function getItemSize(key,items,fieldMeta) {
		// TODO
		// switch on window width
		//return 100
		//console.log('SIZE',key,items,fieldMeta)
		var size = 0
		const lineHeight = 50 
		//const hh = 0
		//const fh = 400 // default 
		//if (props.itemSize) {
			//if (typeof props.itemSize === "function") {
				//if (items[key] && !items[key].hidden_in_list) { 
					//return props.itemSize(key,items,props.fieldMeta(props))
				//} else  {
					//return hh
				//}
			//} else {
				//if (items[key] && !items[key].hidden_in_list) { 
					//return props.itemSize
				//} else {
					//return hh
				//}
			//} 
		//} else {
			//if (items[key] && !items[key].hidden_in_list) { 
				//return fh
			//} else {
				//return hh
			//}
		//}
		
		// empty 
		if ( !Array.isArray(items) || !items[key]) {
			//console.log(['SIZE empty',key,items])
			//return 0
		}
		// from props
		if (props.itemSize) {
			//console.log(['SIZE from props',props.itemSize])
			if (typeof props.itemSize === "function") {
				return props.itemSize(key,items,props.fieldMeta(props))
			} else {
				return props.itemSize
			}
		// fallback to calculate from fieldMeta
		} else {
			//console.log(['SIZE from meta'])
			if (fieldMeta && Array.isArray(fieldMeta.groups)) {
				fieldMeta.groups.forEach(function(group) {
					//size+= lineHeight
					if (group && group.title) size+= lineHeight
					var groupWidth = 0
					var groupAnyFieldHasTitle = false
					if (group && Array.isArray(group.fields)) {
						group.fields.forEach(function(field) {
							if (field.title)  groupAnyFieldHasTitle = true
							groupWidth += (field.width > 0 ? field.width : 12)
							//console.log([field.component, field.component.name, field.component ? field.component.prototype :'none'])
							// add size for extendable components 
							if (field.component.name === 'ItemListComponent') {
								//console.log(['SIZE ItemListComponent',items,field])
								// TODO need size for subcomponent
								if (items && items[key] && field && field.field && Array.isArray(items[key][field.field])) {
									var subSize = 0
									//console.log(['SIZE ItemListComponent',items[key][field.field],field.props.fieldMeta])
									items[key][field.field].forEach(function(fieldItem,k) {
										//console.log(['subSize add ',k,fieldItem,field.props])
										if (fieldItem) subSize += getItemSize(k,items[key][field.field],field.props.fieldMeta(props))
									})
									
									//console.log('subSize '+ subSize)
									size += items[key][field.field].length * subSize
								}
							} else if (field.component.name === 'MediaEditorComponent') {
								//console.log(['SIZE media boost' ,items[key]])
								if (items && items[key] && field && field.field && Array.isArray(items[key][field.field])) {
									const boost = items[key][field.field].length * lineHeight * 5
									//console.log(['SIZE media boost' ,boost])
									size += boost
								}
								
							} else if (field.component.name ===  'TagsComponent') {
								if (items && items[key] && field && field.field && Array.isArray(items[key][field.field])) {
									// 3 tags per line approx
									size += items[key][field.field].length/3 * lineHeight + 1
								}
							} 
							 else if (field.component.name ===  'TextAreaComponent') {
								if (items && items[key] && field && field.field && Array.isArray(items[key][field.field])) {
									// 3 tags per line approx
									size += lineHeight * 4
								}
							} else {
								size +=  lineHeight
							}
						})
						// approx base size for group
						const boost = (parseInt(groupWidth/12)) * (groupAnyFieldHasTitle ? 2 : 1) 
						size  += (boost * lineHeight)
						//console.log(['SIZE from meta d' ,groupWidth,boost,size])
					}
				})
			}
			//console.log(['SIZE final' ,size])
			return size
		}
	}
	
	useEffect(function() {
		if (props.items) {
			setItems(props.items)
			setItemCount(props.items.length)
		} else {
			searchItemsEvent()		
		}
		//	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.items,props.user]) 
	
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
				
				<Link style={{float:'right'}}  to={props.match.url + "/new/"+categorySearchFilter} ><Button variant="success"  >+</Button></Link>
		    
				<form onSubmit={searchItemsEvent} >
					{props.useCategorySearch && <span style={{float:'left'}} ><DropDownComponent value={categorySearchFilter} variant={'info'} onChange={setCategorySearchFilterEvent} options={Array.isArray(categoryOptions) ? categoryOptions : []} /></span>}
					<span style={{float:'left', border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
						<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={searchFilter} onChange={setSearchFilterEvent} />
						<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {setSearchFilter(''); searchItemsNow(' ') }} title="Clear">&times;</span>
					</span>
					&nbsp;
					<Button style={{float:'left', marginLeft:'0.2em'}} onClick={searchItemsEvent} variant={'info'} >{searchIcon}</Button>
					&nbsp;
					
					{typeof props.sortOptions === "object" && <span style={{float:'left', marginLeft:'0.2em'}} ><SortDropDown setSort={lsetSort} options={props.sortOptions} /></span>}
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
					minimumBatchSize={props.minimumBatchSize ? props.minimumBatchSize : 50}
					threshhold={props.threshhold ? props.threshhold : 5}
				  >
					{({ onItemsRendered, ref }) => {
					  return <List
						ref={listRef}
						className="List"
						height={props.height ? props.height : (window.outerHeight - window.outerHeight*0.1)} 
						itemData={Object.assign({},props,{
							items: (props.liveSearchFilter 
								? items.map(function(item,ik) {
									//console.log(['chgeck',item])
									if (searchFilter.trim().length === 0 || props.liveSearchFilter(searchFilter,item)) {
										//console.log(['chgeck NOT HIDDEN',item])
										return item
									} else {
										//console.log(['chgeck HIDDEN',item])
										// itemkey is index in unfiltered parent list
										return Object.assign({},item,{itemkey: ik, hidden_in_list:true})
									} 
								}) 
								: items),
							//isLoggedIn: props.isLoggedIn,
							//lookups: props.lookups,
							//setLookups: props.setLookups,
							axiosClient: axiosClient, 
							user: props.user,
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
							refreshItem: props.showRefreshButton ? refreshItem : null ,
							deleteItem: deleteItem,
							searchFilter: searchFilter,
							//setCollatedItems: setCollatedItems,
							fieldMeta: props.fieldMeta(props),
							matchUrl: props.match.url+"/",
							//reviewApi: props.reviewApi
						})}
						itemCount={itemCount}
					
						itemSize={function(key) {
							return getItemSize(key,items,props.fieldMeta(props))
						}}
						onItemsRendered={onItemsRendered}
						width={props.width ? props.width : '100%'}
					  >
						{props.itemListRowComponent ? props.itemListRowComponent : ItemListRow}
					  </List>
					}}
				 </InfiniteLoader>
			
        </div>
     //}   

}
   //props.height ? props.height : window.outerHeight - window.outerHeight*0.3}      
