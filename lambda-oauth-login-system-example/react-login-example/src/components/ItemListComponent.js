import React,{useEffect, useState} from 'react'; //, {Fragment, useState}
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

//const LOADING = 1;
//const LOADED = 2;
//var itemStatusMap = {};

const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>


const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
export default function ItemListComponent(props) {

//console.log('ITLC')	
//console.log(props)	
	

	//var listRef = null;
	const axiosClient = props.user && props.user.token && props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField,saveItemNow, deleteItem} = useLocalForageAndRestEndpoint({user: props.user, modelType:props.modelType,axiosClient:axiosClient,restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, populate: props.populate, useCategorySearch: props.useCategorySearch, minimumBatchSize : (props.minimumBatchSize ? props.minimumBatchSize : 50), defaultSort: props.defaultSort, defaultSortLabel: props.defaultSortLabel})
	
	
	//useEffect(function() {
		//if (Array.isArray(props.value)) {
			//setItems(props.value)
		//}	
	//},[props.value]) 
	//console.log(['FM',fieldMeta])		
	
	const [sortedList, setSortedList] = useState(null)
	
	useEffect(function() {
		var sorted = Array.isArray(props.value) ? props.value : []
		sorted.sort(function(a,b) {
			//console.log(['test',a && b && a.sort < b.sort,a,b])
			if (a && b && a.sort < b.sort) {
				return -1
			} else {
				return 1
			}
		}) 
		//console.log(['sorted list',sorted])		
		setSortedList(sorted)
	},[props.value])	
	
	
	function createNew(item,index) {
		console.log(['create new list item',index,item])
		var createItem = props.createItem ? props.createItem(item,index) : {}
		console.log(['created new list item',createItem])
		if (props.parentField && props.parentValue) {
			createItem[props.parentField] = props.parentValue
			//console.log(['save new list item',createItem])
			
			var minSort = 0
			if (Array.isArray(props.value)) {
				props.value.forEach(function(theValue) {
					if (theValue && theValue.sort && theValue.sort < minSort) {
						minSort = theValue.sort
					}
				})
			}
			createItem.sort = minSort - 1000
			
			if (index > 0) {
				if (Array.isArray(props.value) && props.value.length >= index && props.value[index -1]) {
					var sort = props.value[index -1].sort ? props.value[index -1].sort : 0
					createItem.sort = sort + 10
					console.log(['create new list item index',index,createItem.sort])
				}
			} 
			
			saveItemNow(createItem).then(function(newItem) {
				console.log(['created new list item',newItem])
				const newItems = Array.isArray(props.value) ? props.value.slice(0) : []
				newItems.unshift(newItem)
				//console.log(['update new list',newItems])
				props.onChange(newItems) 
			})
		}
	}
	
	
	var formProps = Object.assign({},{
		//isLoggedIn: props.isLoggedIn,
		//lookups: props.lookups,
		//setLookups: props.setLookups,
		//axiosClient: props.axiosClient, 
		//user: props.user,
		saveField: function(field, value, item, key, delay) {
			const newItems = Array.isArray(props.value) ? props.value.slice(0) : []
			if (item && item._id && newItems[key]) {
				newItems[key] = item
				newItems[key][field] = value
			}
			 //else {
				//newItems.unshift(newItem)
			//}
			//saveQueue()
			props.onChange(newItems) 
			//console.log(['save field in item list',field, value, item, key, delay])
			saveField(field, value, item, key, props.autoSaveDelay).then(function(newItem) { 
				//console.log('saved field in item list')
				//console.log(newItem)
			})
		},
		autoSaveDelay: props.autoSaveDelay, 
		startWaiting:props.startWaiting,
		stopWaiting: props.stopWaiting,
		onItemQueued: props.onItemQueued,
		onStartSaveQueue: props.onStartSaveQueue,
		onFinishSaveQueue: props.onFinishSaveQueue,
		tags: props.tags,
		topics: props.topics,
		reviewApi: props.reviewApi,
		createNew: createNew
	})
	var fieldMeta = props.fieldMeta(formProps)	
	
	//console.log(props)
	formProps.fieldMeta = fieldMeta	
	//console.log(formProps)
	function doDeleteItem (id,key = -1) {
		deleteItem(id, key).then(function() {
			const newItems = Array.isArray(props.value) ? props.value.slice(0) : []
			newItems.splice(key,1)
			props.onChange(newItems) 
		})
	}
	
    const editable = true //isEditable(item,data.user)
	//return []
		//const fieldMeta = props.fieldMeta(props)
		//console.log(fieldMeta)
	//console.log(['BUTTONS',props])
		return <div style={{width:'100%'}}>   
		    <div style={{ width: '100%'}} >
				
				{(editable) && <Button variant="success"  style={{float:'right', marginTop:-40}} onClick={function(e) {console.log('CN'); createNew(props.parent ? props.parent : {},0)}} >+</Button>}
				
				
				{Array.isArray(props.buttons) ? <>{props.buttons.map(function(button,bkey) {
					
						if (typeof button === 'function' ) {
							var thisButton = button(Object.assign({},props.value,{itemkey: bkey, createNew: createNew}),function(e) {
								console.log('click listrow')
								//clickFunction(e)
								//that.updateProgress()
							})
							return thisButton
						} else {
							return button
						}
					})}</> : null }	
						
				<div className="List" >
				{(sortedList && Array.isArray(sortedList)) && sortedList.map(function(item,index) {
					 const editable = props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
					 return <div className="List-Item" >
							{(item && item._id) && 
								<div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}><div style={{clear:'both'}} >
									
									{editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) doDeleteItem(item._id,index)} } >{deleteIcon}</Button>}
								
									{(editable && props.editUrl) && <Link to={props.editUrl +item._id} ><Button style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
									
									{Array.isArray(props.itemButtons) ? <>{props.itemButtons.map(function(button,bkey) {
						
										if (typeof button === 'function' ) {
											var thisButton = button(Object.assign({},item,{itemkey: index, createNew: createNew}),function(e) {
												console.log('click listrow')
												//clickFunction(e)
												//that.updateProgress()
											})
											return thisButton
										} else {
											return button
										}
									})}</> : null }	
								</div>
								<div style={{clear:'both', width:'100%'}}>
									<ItemForm editable={isEditable(item,props.user)} item={item} itemkey={index} {...formProps} />
								</div>
							</div>
							}	
								
					  </div>
					
				})}
				</div>
        </div>
        
	</div>
}
         
