import React,{useState,useEffect, useRef}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable, getDistinct} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'
import DropDownComponent from './DropDownComponent'
import { createRef, Fragment, PureComponent } from "react";
import { VariableSizeList as List } from "react-window";
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
		lookups: data.lookups,
		setLookups: data.setLookups,
		axiosClient: data.axiosClient, 
		user: data.user,
		item: item ,
		saveField: data.saveField,
		itemkey: index,
		fieldMeta: data.fieldMeta
	}
    const editable = isEditable(item,data.user)
				
    return (
      <div className="ListItem" style={style}>
      		{(item && item._id) ? <div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}>
				
					{editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) data.deleteItem(item._id,index)} } >Delete</Button>}
					
					{editable && <Link to={'/editor/'+item._id} ><Button style={{float:'right'}} variant="success" >Edit</Button></Link>}
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
					//})

export default function ItemList(props) {


	

	const listRef = useRef();
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField, deleteItem, searchItems, items, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, isItemLoaded, sort, setSort} = useLocalForageAndRestEndpoint({modelType:props.modelType,axiosClient:axiosClient,restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, populate: props.populate, useCategorySearch: props.useCategorySearch})
	
	//const [collatedItems, setCollatedItems] = useState([])
	const [categoryOptions, setCategoryOptions] = useState(props.categoryOptions)
	useEffect(function() {
		if ((!categoryOptions || !Array.isArray(categoryOptions)) && props.useCategorySearch) {
			getDistinct(axiosClient, (props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/'), props.modelType, props.useCategorySearch).then(function(list) {
				setCategoryOptions(list)
			})
		}
	},[])
	//useEffect(function() {
		//setCollatedItems(collatedItems.concat(items))
	//},[items])
	
   // var createInterval = null

	function searchItemsEvent(e) {
		if (e) e.preventDefault()
		// default search allow all
		//setCollatedItems([])
		searchItems(getSearchFilter(categorySearchFilter,searchFilter),function(items) {
			//setCollatedItems(items)	
			//if (listRef && listRef.current) listRef.current.scrollToItem(0, "start");
		})
	}
	
	function setSearchFilterEvent(e) {
		setSearchFilter(e.target.value)
	}
	
	function setCategorySearchFilterEvent(e) {
		setCategorySearchFilter(e)
		searchItems(getSearchFilter(e,searchFilter),function(items) {
			//setCollatedItems(items)	
		})
	}
	
	useEffect(function() {
		//searchItemsEvent()			
	},[]) 
	
	if (!props.isLoggedIn()) {
		return <div style={{width:'100%'}}>    </div>
	} else {
		return <div style={{width:'100%'}}>   
		    <div style={{zIndex:990, backgroundColor: 'white', position: 'fixed', top: 67, left: 0, width: '100%'}} >
				
				<Link style={{float:'right'}}  to={"/editor/new/"+categorySearchFilter} ><Button variant="success"  >Create New</Button></Link>
		    
				
				<form onSubmit={searchItemsEvent} >
					{props.useCategorySearch && <DropDownComponent value={categorySearchFilter} variant={'info'} onChange={setCategorySearchFilterEvent} options={Array.isArray(categoryOptions) ? categoryOptions : []} />}
					<span style={{border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
						<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={searchFilter} onChange={setSearchFilterEvent} />
						<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {setSearchFilter('')}} title="Clear">&times;</span>
					</span>
					
					<Button  variant="primary" onClick={searchItemsEvent} variant={'info'} >Search</Button>
				</form>
				
				{itemCount}-{items.length}-
			</div>
			<InfiniteLoader
				isItemLoaded={isItemLoaded}
				itemCount={itemCount}
				loadMoreItems={loadMoreItems}
				minimumBatchSize={props.minimumBatchSize ? props.minimumBatchSize : 50}
				threshhold={props.threshhold ? props.threshhold : 15}
			  >
				{({ onItemsRendered, ref }) => (
				  <List
					className="List"
					height={props.height ? props.height : window.outerHeight - window.outerHeight*0.3}
					itemData={{
						items:items,
						isLoggedIn: props.isLoggedIn,
						lookups: props.lookups,
						setLookups: props.setLookups,
						axiosClient: axiosClient, 
						user: props.user,
						saveField: saveField,
						deleteItem: deleteItem,
						searchFilter: searchFilter,
						//setCollatedItems: setCollatedItems,
						fieldMeta: props.fieldMeta
					}}
					itemCount={itemCount}
				
					itemSize={props.itemSize ? (typeof props.itemSize === "function" ? function(key) { return props.itemSize(key,items) } : function(key) { return  props.itemSize}) : function(key) { return 200}}
					onItemsRendered={onItemsRendered}
					ref={ref}
					width={props.width ? props.width : '100%'}
				  >
					{Row}
				  </List>
				)}
			 </InfiniteLoader>
			
        </div>
     }   

}
         
