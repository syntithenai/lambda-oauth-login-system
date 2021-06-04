import React,{useState,useEffect}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, scrollToTop} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
//import ItemForm from './ItemForm'
import ItemListHeader from './ItemListHeader'
import DropDownComponent from '../form_field_components/DropDownComponent'
//import DropDownSelectorComponent from './DropDownSelectorComponent'
//import { Fragment, PureComponent } from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import SortDropDown from './SortDropDown'
import ItemListRow from './ItemListRow'
import icons from '../icons'
const {searchIcon} = icons

export default function ItemList(props) {

//console.log(props)	
	

	var listRef = React.useRef(null);
	//const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, deleteItem, searchItems, items, collatedItems, setItems, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, setItemCount, isItemLoaded, setSort, dispatch, refreshItem} = props.endpoint
	
	const [categoryOptions, setCategoryOptions] = useState([])
	// category selector options (plus Notes)
	useEffect(function() {
		var topics = Array.isArray(props.topics) ? props.topics.slice(0) : []	
		if (props.user && props.user._id) topics.push(props.user.avatar + "'s Notes")
		setCategoryOptions(topics)
	},[props.topics,props.user])
	
	
	const minimumBatchSize = props.minimumBatchSize ? props.minimumBatchSize : 50

	function searchItemsEvent(e) {
		if (e) e.preventDefault()
		// default search allow all
		//setCollatedItems([])
		console.log('searchitemsevent')
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		//if (searchFilter || categorySearchFilter) {
			searchItems(getSearchFilter(),function(iitems) {
				//setUnfilteredItems(items)	
				//( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
				setItemCount( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
			},(minimumBatchSize))
		//}
	}
	
	function searchItemsNow(filter) {
		// default search allow all
		//setCollatedItems([])
		console.log('searchitemsnow')
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		searchItems(getSearchFilter(categorySearchFilter,filter),function(iitems) {
			//setUnfilteredItems(items)	
			//setItemCount( iitems.length   + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
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
			//setItemCount( iitems.length + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
			if (props.stopWaiting) props.stopWaiting()
			if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
			//setCollatedItems(items)	
		},(minimumBatchSize))
	}
	
	function getItemSize(key,items,fieldMeta) {
		// TODO
		// switch on window width
		//return 100
		//console.log('SIZE',key,items,fieldMeta)
		var size = 0
		const lineHeight = 50 
		// empty 
		//if ( !Array.isArray(items) || !items[key]) {
			////console.log(['SIZE empty',key,items])
			////return 0
		//}
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
		console.log('change item or user')
		//if (props.items) {
			//setItems(props.items)
			//setItemCount(props.items.length)
		//} else {
			searchItemsEvent()		
		//}
		//	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.items,props.user]) 
	
	//useEffect(function() {
		//if (collatedItems) setItemCount(collatedItems.length)
	//},[collatedItems])
	
	function lsetSort(val) {
		dispatch({type:'replaceall', items: []})
		scrollToTop()	  
		if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		setSort(val)
	}
	
	//if (false && !props.isLoggedIn()) {
		//return <div style={{width:'100%'}}>    </div>
	//} else {
	
		var headerProps = {
			categorySearchFilter,
			setCategorySearchFilterEvent,
			categoryOptions,
			searchFilter,
			setSearchFilterEvent,
			setSearchFilter,
			searchItemsNow,
			lsetSort,
			sortOptions: props.sortOptions,
			match: props.match,
			useCategorySearch: props.useCategorySearch
		}
	
		var UseItemListHeaderComponent = props.itemListHeaderComponent ? props.itemListHeaderComponent : ItemListHeader
	
		return <div style={{width:'95%', marginLeft:'1em'}}>   
		   
				<UseItemListHeaderComponent {...headerProps} />
				<InfiniteLoader
					isItemLoaded={isItemLoaded}
					itemCount={itemCount}
					loadMoreItems={loadMoreItems}
					minimumBatchSize={props.minimumBatchSize ? props.minimumBatchSize : 50}
					threshold={props.threshold ? props.threshold : 5}
				  >
					{({ onItemsRendered, ref }) => {
					  return <List
						ref={listRef}
						className="List"
						height={props.height ? props.height : (window.outerHeight - window.outerHeight*0.1)} 
						itemData={Object.assign({},props,{
							items: (props.liveSearchFilter 
								? collatedItems.map(function(item,ik) {
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
							//axiosClient: props.axiosClient, 
							//user: props.user,
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
							matchUrl: props.matchUrl ? props.matchUrl+"/" : props.match.url+"/",
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
