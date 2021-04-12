import React,{useState,useEffect, useRef}  from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable, getDistinct, scrollToTop} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

const LOADING = 1;
const LOADED = 2;
var itemStatusMap = {};

export default function ItemListComponent(props) {

//console.log('ITLC')	
//console.log(props)	
	

	var listRef = null;
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField,saveItem, deleteItem, searchItems, items, setItems, searchFilter,setSearchFilter, categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, itemCount, setItemCount, isItemLoaded, sort, setSort, hasNextPage, dispatch} = useLocalForageAndRestEndpoint({modelType:props.modelType,axiosClient:axiosClient,restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, populate: props.populate, useCategorySearch: props.useCategorySearch, minimumBatchSize : (props.minimumBatchSize ? props.minimumBatchSize : 50), defaultSort: props.defaultSort, defaultSortLabel: props.defaultSortLabel})
	
	
	//useEffect(function() {
		//if (Array.isArray(props.value)) {
			//setItems(props.value)
		//}	
	//},[props.value]) 

					
	const formProps = Object.assign({},props,{
		//isLoggedIn: props.isLoggedIn,
		//lookups: props.lookups,
		//setLookups: props.setLookups,
		//axiosClient: props.axiosClient, 
		//user: props.user,
		saveField: function(field, value, item, key, delay) {
			console.log(['save field in item list',field, value, item, key, delay])
			//saveField(field, value, item, key, delay).then(function(newItem) { 
				//console.log('saved field in item list')
				//console.log(newItem)
				//const newItems = props.value.slice(0)
				//newItems.unshift(newItem)
				//props.onChange(newItems) 
			//})
		}
		
		//fieldMeta: props.fieldMeta
	})
		
	function doDeleteItem (id,key = -1) {
		deleteItem(id, key).then(function() {
			const newItems = props.value.slice(0)
			newItems.splice(key,1)
			props.onChange(newItems) 
		})
	}
	
	function createNew() {
		console.log('create new list item')
		var createItem = {}
		if (props.parentField && props.parentValue) {
			createItem[props.parentField] = props.parentValue
		} 
		saveItem(createItem).then(function(newItem) {
			console.log(['created new list item',newItem])
			const newItems = props.value.slice(0)
			newItems.unshift(newItem)
			console.log(['update new list',newItems])
			props.onChange(newItems) 
			
		})
	}
	
    const editable = true //isEditable(item,data.user)
	
		return <div style={{width:'100%'}}>   
		    <div style={{zIndex:990, backgroundColor: 'white', top: 67, left: 0, width: '100%'}} >
				
				{(editable) && <Button variant="success"  style={{float:'right'}} onClick={function(e) {console.log('CN'); createNew()}} >Create New</Button>}
					dd{JSON.stringify(props.value)}dd
						
				<div className="List" >
				{(props.value && Array.isArray(props.value)) && props.value.map(function(item,index) {
					return <div className="List-Item" >
							{(item && item._id) && 
								<div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}>
								
								{editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) doDeleteItem(item._id,index)} } >Delete</Button>}
							
								{(editable && props.editUrl) && <Link to={props.editUrl +item._id} ><Button style={{float:'right'}} variant="success" >Edit</Button></Link>}
								
								
								
								<ItemForm  item={item} itemkey={index} {...formProps} />
								</div>
							}	
								
					  </div>
					
				})}
				</div>
        </div>
        
	</div>
}
         
