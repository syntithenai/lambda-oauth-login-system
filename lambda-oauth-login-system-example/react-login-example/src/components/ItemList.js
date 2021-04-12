import React,{useState,useEffect, useRef}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable, getDistinct, scrollToTop} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'
import DropDownComponent from './DropDownComponent'
import DropDownSelectorComponent from './DropDownSelectorComponent'
import { createRef, Fragment, PureComponent } from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import SortDropDown from './SortDropDown'
const LOADING = 1;
const LOADED = 2;
var itemStatusMap = {};
	
class Row extends PureComponent {
  render() {
    const { index, style , data} = this.props;
    let label;
    
    var item = data && data.items && data.items[index]? data.items[index] : null
    const formProps = Object.assign({},data,{
		//isLoggedIn: data.isLoggedIn,
		//lookups: data.lookups,
		//setLookups: data.setLookups,
		//axiosClient: data.axiosClient, 
		//user: data.user,
		item: item ,
		//saveField: data.saveField,
		itemkey: index,
		//fieldMeta: data.fieldMeta
	})
    const editable = true //isEditable(item,data.user)
			
    return (
      <div className="ListItem" style={style}>
      		{(item && item._id) ? <div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}>
				
					{editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) data.deleteItem(item._id,index)} } >Delete</Button>}
					
					{editable && <Link to={data.matchUrl +item._id} ><Button style={{float:'right'}} variant="success" >Edit</Button></Link>}
					{(item && item._id) && <div>
					 
					 <ItemForm  {...formProps} />
					 
					 </div>}
				</div> : null}
				
				
      </div>
    );
  }
}
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
	

	var listRef = null;
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, deleteItem, searchItems, items, setItems, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, setItemCount, isItemLoaded, sort, setSort, hasNextPage, dispatch} = useLocalForageAndRestEndpoint({modelType:props.modelType,axiosClient:axiosClient,restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, populate: props.populate, useCategorySearch: props.useCategorySearch, minimumBatchSize : (props.minimumBatchSize ? props.minimumBatchSize : 50), defaultSort: props.defaultSort, defaultSortLabel: props.defaultSortLabel})
	
	//const [unfilteredItems, setUnfilteredItems] = useState([])
	//const [collatedItems, setCollatedItems] = useState([])
	const [categoryOptions, setCategoryOptions] = useState([])
	useEffect(function() {
		setCategoryOptions(props.topics)
	},[props.topics])
	
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
		searchItems(getSearchFilter(),function(iitems) {
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
	
	useEffect(function() {
		if (props.items) {
			setItems(props.items)
			setItemCount(props.items.length)
		} else {
			searchItemsEvent()		
		}
		//	
	},[props.items]) 
	
	function lsetSort(val) {
		setSort(val)
		scrollToTop()
	}
	
	if (false && !props.isLoggedIn()) {
		return <div style={{width:'100%'}}>    </div>
	} else {
		return <div style={{width:'100%'}}>   
		    <div style={{zIndex:990, backgroundColor: 'white', position: 'fixed', top: 67, left: 0, width: '100%'}} >
				
				<Link style={{float:'right'}}  to={props.match.url + "/new/"+categorySearchFilter} ><Button variant="success"  >+</Button></Link>
		    
				<form onSubmit={searchItemsEvent} >
					{props.useCategorySearch && <span style={{float:'left'}} ><DropDownComponent value={categorySearchFilter} variant={'info'} onChange={setCategorySearchFilterEvent} options={Array.isArray(categoryOptions) ? categoryOptions : []} /></span>}
					<span style={{float:'left', border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
						<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={searchFilter} onChange={setSearchFilterEvent} />
						<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {setSearchFilter('')}} title="Clear">&times;</span>
					</span>
					&nbsp;
					<Button style={{float:'left', marginLeft:'0.2em'}} onClick={searchItemsEvent} variant={'info'} >Search</Button>
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
					listRef = ref
				  return <List
					className="List"
					height={props.height ? props.height : window.outerHeight - window.outerHeight*0.3}
					itemData={Object.assign({},props,{
						items: (props.liveSearchFilter 
							? items.map(function(item,ik) {
								//console.log(['chgeck',item])
								if (searchFilter.trim().length === 0 || props.liveSearchFilter(searchFilter,item)) {
									console.log(['chgeck NOT HIDDEN',item])
									return item
								} else {
									console.log(['chgeck HIDDEN',item])
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
						saveField: saveField,
						deleteItem: deleteItem,
						searchFilter: searchFilter,
						//setCollatedItems: setCollatedItems,
						fieldMeta: props.fieldMeta(props),
						matchUrl: props.match.url+"/"
					})}
					itemCount={itemCount}
				
					itemSize={function(key) {
						console.log('SIZE',key)
						var hh = 0
						var fh = 400
						if (props.itemSize) {
							if (typeof props.itemSize === "function") {
								if (items[key] && !items[key].hidden_in_list) { 
									return props.itemSize(key,items,searchFilter)
								} else  {
									return hh
								}
							} else {
								if (items[key] && !items[key].hidden_in_list) { 
									return props.itemSize
								} else {
									return hh
								}
							} 
						} else {
							if (items[key] && !items[key].hidden_in_list) { 
								return fh
							} else {
								return hh
							}
						}
					}}
					onItemsRendered={onItemsRendered}
					ref={ref}
					width={props.width ? props.width : '100%'}
				  >
					{Row}
				  </List>
				}}
			 </InfiniteLoader>
			
        </div>
     }   

}
         
