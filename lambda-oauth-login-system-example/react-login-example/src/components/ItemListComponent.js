import React,{useEffect, useState} from 'react'; //, {Fragment, useState}
import {Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAxiosClient, isEditable} from '../helpers'  
import useLocalForageAndRestEndpoint from '../useLocalForageAndRestEndpoint'
import ItemForm from './ItemForm'

//const LOADING = 1;
//const LOADED = 2;
//var itemStatusMap = {};

import icons from '../icons'
const {deleteIcon, editIcon} = icons

function ItemListComponentRow(props) {
	return <div className="List-Item" >
		{(props.item && props.item._id) && 
			<div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (props.index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={props.item._id}><div style={{clear:'both'}} >
				
				{props.editable && <Button style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) props.doDeleteItem(props.item,props.index)} } >{deleteIcon}</Button>}
			
				{(props.editable && props.editUrl) && <Link to={props.editUrl +props.item._id} ><Button style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
				
				{Array.isArray(props.itemButtons) ? <>{props.itemButtons.map(function(button,bkey) {
	
					if (typeof button === 'function' ) {
						var thisButton = button(Object.assign({},props.item,{itemkey: props.index, createNew: props.createNew, createNewFromSibling: props.createNewFromSibling}),function(e) {
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
				<ItemForm editable={isEditable(props.item,props.user)} item={props.item} itemkey={props.index} {...props} />
			</div>
		</div>
		}	
			
  </div>
}

const ItemListNewDialog = function(props) {
	const [newItem, setNewItem] = useState({})
	const [changed, setChanged] = useState(new Date().getTime())
	console.log(newItem)
	// saveField in props to set localItem

	
	function saveField(field, value, item, key, delay) {
		return new Promise(function(resolve,reject) {
			var  uitem = newItem //item ? item : {}
			if (field) uitem[field] = value
			setNewItem(uitem)
			setChanged(new Date().getTime())
			resolve()
		})
	}
	
	return <span style={{position:'relative'}}>
				{<Modal dialogClassName="modal-90w"  
				  show={true} onHide={function(e) {console.log('FS off'); props.setShowNewItemModal(false)}}  >
					<Modal.Header closeButton>&nbsp;
						<Button variant={'success'} onClick={function() {props.createNew(newItem); props.setShowNewItemModal(false)}}>Save</Button>&nbsp;&nbsp;&nbsp;
						<Button variant={'danger'} onClick={function() {props.setShowNewItemModal(false)}}>Cancel</Button>
					</Modal.Header>
				
					<Modal.Body  >
					
					<div style={{clear:'both', width:'100%'}}>
						<ItemForm editable={true} item={newItem} {...props} saveField={saveField} />
					</div> 		
					 </Modal.Body>
				</Modal>}
				
			</span>
			
}

export default function ItemListComponent(props) {

console.log('ITLC')	
console.log(props)	
	

	//var listRef = null;
	//const axiosClient = props.user && props.user.token && props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	const {saveField,saveItemLocal, deleteItemLocal, saveItemNow, deleteItem, setItems, localForages, getItemsFromIndexValues, getIndexValues, items, collatedItems} = useLocalForageAndRestEndpoint(Object.assign({},props,{
		//axiosClient:axiosClient,
		//restUrl:props.restUrl ? props.restUrl : '/dev/handler/rest/api/v1/',
	}))
	const [listHash,setListHash] = useState(null)
	function getListHash(items) {
		return JSON.stringify(items)
	} 
	const [showNewItemModal, setShowNewItemModal] = useState(false)
	
	//useEffect(function() {
		//console.log(['LOGINCHECK',props.loginCheckActive,props.user])
	//},[props.loginCheckActive])
	
	useEffect(function() {
		// assume that child value is up to date  (from rest virtual field )
		// item exists in values but not index, create it
		// item exists in index but not values, delete it
		
		const valueHash = getListHash(props.value)
		console.log(['TRY load from parent result '+props.modelType,props.value]) //, props.value, valueHash, listHash)
		if (props.value && valueHash != listHash && !props.loginCheckActive) {
			console.log('TRY load from parent result CHANGED')
			if (Array.isArray(props.value)) {
				var saveItems = []
				var deleteItems = []
				console.log('load from parent result '+props.modelType)
				//setSortedList(props.value)
				setItems(props.value)
				setListHash(valueHash)
				console.log(['Itemlist props',props.parentField,props.parent,props.value])
				// index needs to have same name as parentField
				console.log(['aa',props.parentField,props.parent._id]) //, value[props.parentField]])
				getIndexValues(props.parentField,props.parent._id).then(function(indexValues) {
					
					var indexValueIds = Array.isArray(indexValues) ? indexValues.map(function(value) { return value ? value._id : null}) : []
					var ids = {}
					props.value.forEach(function(value) {
						if (value && value._id) {
							ids[value._id] = value
							if (indexValueIds.indexOf(value._id) === -1) {
								saveItems.push(value)
							} 
						}
					})
					const idKeys = Object.keys(ids)

					console.log(indexValues)
					// add or remove from index as required
					if (Array.isArray(indexValues)) {
						indexValues.forEach(function(item) {
							if (item && item._id) {
								if (idKeys.indexOf(item._id)  !== -1) {
									// index item found in value - ok keep it
								} else {
									// remove from index
									deleteItems.push(item)
								}
							}
						})
					}
					deleteItems.forEach(function(item) {
						deleteItemLocal(item)
					})
					saveItems.forEach(function(item) {
						saveItemLocal(item)
					})
					
				})
			
				
				// ensure items exist locally and update
				//props.value.forEach(function(value) {
					////if (value && value._id) localForages[props.modelType].localForageItems.setItem(value._id,value)
				//})
				// delete any local matches not in value
				// update items from local search
			} else {
				// load from local storage
				console.log(['load from local storage B',props.modelType, props.user, props.parentField,props.parent._id,props])
				getItemsFromIndexValues(props.parentField,props.parent._id).then(function(items) {
					console.log(['loaded from local storage B',props.modelType, props.user, items])
					setItems(items)
					//setSortedList(items)
				})
			}
		} else {
			// load from local storage
			console.log(['load from local storage A',props.modelType, props.user,props.parentField,props.parent._id,props])
			getItemsFromIndexValues(props.parentField,props.parent._id).then(function(items) {
				console.log(['loaded from local storage A',props.modelType, props.user,items])
				setItems(items)
				//setSortedList(items)
			})
		}
	},[props.value]) 
	//console.log(['FM',fieldMeta])		
	
	const [sortedList, setSortedList] = useState(null)
	
	//useEffect(function() {
		//var sorted = Array.isArray(props.value) ? props.value : []
		//sorted.sort(function(a,b) {
			////console.log(['test',a && b && a.sort < b.sort,a,b])
			//if (a && b && a.sort < b.sort) {
				//return -1
			//} else {
				//return 1
			//}
		//}) 
		////console.log(['sorted list',sorted])		
		//setSortedList(sorted)
		//console.log('itemlist val update')
	//},[props.value])	
	
	
	//function collateItems(items) {
		//if (Array.isArray(props.value)) {
			//var newItems = {}
			//var itemIndex = {}
			//var children = {}
			//var parentIds = []
			//// index by id and collate parentIds
			//props.value.forEach(function(item,valueKey) {
				//itemIndex[item._id] = Object.assign({},item,{itemkey: valueKey, sortField: item.updated_date})
				//if (item && item._id) {
					//children[item._id] = []
					//parentIds.push(item._id)
				//}
			//})
			//// iterate values, collating children
			//props.value.forEach(function(item,valueKey) {
				//// collate children where parent is in list
				////console.log(['COLLATED ITEM'])
				//if (Array.isArray(parentIds) && item && item._id && item.hasOwnProperty(props.collateOn) && item[props.collateOn] &&  Array.isArray(children[item[props.collateOn]]) && parentIds.indexOf(item[props.collateOn]) != -1) {
					//children[item[props.collateOn]].push(Object.assign({},item,{itemkey: valueKey}))
					////itemIndex[item._id].sortField = child.updated_date > item.updated_date ? child.updated_date : item.updated_date
					//delete itemIndex[item._id]
				//}
			//})
			//// assign children back to indexed List
			//Object.keys(children).forEach(function(key) {
				//var childs = children[key]
				//var mostRecent = 0
				//if (childs && childs.length > 0) {
					//childs.forEach(function(childItem)  {
						//if (mostRecent < childItem.updated_date) {
							//mostRecent = childItem.updated_date
						//}
					//})
					//if (itemIndex[key].updated_date < mostRecent) {
						//itemIndex[key].sortField = mostRecent
					//} 
					//itemIndex[key].children = childs
				//}
			//})
			//// sort
			//var collatedArray = Object.values(itemIndex)
			//collatedArray.sort(function(a,b) {
				//if (a && b && a.sortField < b.sortField) {
					//return 1
				//} else {
					//return -1
				//}
				
			//})
			////setSortedList(collatedArray)
			//console.log('COLLATED')
			//console.log(collatedArray)
			//return collatedArray
		//}
	//}
	
	////const [collatedItems,setCollatedItems] = useState([])
	//useEffect(function() {
		//if (props.collateOn) { 
			//if (items && items.length > 0 ) { 	
				
				//setSortedList(collateItems(items))
			//}
			
		//} else {
			//var sorted = Array.isArray(props.value) ? props.value : []
			//sorted.sort(function(a,b) {
				////console.log(['test',a && b && a.sort < b.sort,a,b])
				//if (a && b && a.updated_date < b.updated_date) {
					//return -1
				//} else {
					//return 1
				//}
			//}) 
			////console.log(['sorted list',sorted])		
			//setSortedList(sorted)
			////console.log('itemlist val update')
		//}
	//},[items])
	
	
	
	function createNew(item,index) {
		console.log(['create new list item',index,item])
		var createItem = props.createItem ? props.createItem(item,index) : {}
		console.log(['created new list item',createItem])
		if (props.parentField && props.parentValue) {
			createItem[props.parentField] = props.parentValue
			//console.log(['save new list item',createItem])
			createItem['_id'] = null
			//var minSort = 0
			//if (Array.isArray(props.value)) {
				//props.value.forEach(function(theValue) {
					//if (theValue && theValue.sort && theValue.sort < minSort) {
						//minSort = theValue.sort
					//}
				//})
			//}
			//createItem.sort = minSort - 1000
			
			//if (index > 0) {
				//if (Array.isArray(props.value) && props.value.length >= index && props.value[index -1]) {
					//var sort = props.value[index -1].sort ? props.value[index -1].sort : 0
					//createItem.sort = sort + 10
					//console.log(['create new list item index',index,createItem.sort])
				//}
			//} 
			
			saveItemNow(createItem).then(function(newItem) {
				console.log(['created new list item',newItem])
				const newItems = Array.isArray(items) ? items.slice(0) : []
				newItems.unshift(newItem)
				//console.log(['update new list',newItems])
				//props.onChange(newItems) 
				setItems(newItems)
				//collateItems()
			})
		}
	}
	
	
	function createNewFromSibling(item) {
		console.log(['create new list item from sibling',item])
		var createItem = props.createItemFromSibling ? props.createItemFromSibling(item,item) : item
		console.log(['created new list item',createItem])
		createItem['_id'] = null
		saveItemNow(createItem).then(function(newItem) {
			console.log(['created new list item',newItem])
			const newItems = Array.isArray(items) ? items.slice(0) : []
			newItems.unshift(newItem)
			//console.log(['update new list',newItems])
			//props.onChange(newItems) 
			setItems(newItems)
			////collateItems()
		})
	}
	
	function doDeleteItem (item,key = -1) {
		deleteItem(item, key).then(function() {
			//const newItems = Array.isArray(props.value) ? props.value.slice(0) : []
			//newItems.splice(key,1)
			//setItems(newItems)
			//props.onChange(newItems) 
			//collateItems()
		})
	}
	
	var formProps = Object.assign({},props,{
		//isLoggedIn: props.isLoggedIn,
		////lookups: props.lookups,
		////setLookups: props.setLookups,
		////axiosClient: props.axiosClient, 
		//user: props.user,
		
		saveField: function(field, value, item, key, delay) {
			console.log(['save field in item list',field, value, item, key, delay])
			const newItems = Array.isArray(props.value) ? props.value.slice(0) : []
			if (item && item._id && newItems[key]) {
				newItems[key] = item
				newItems[key][field] = value
			}
			//saveQueue()
			//props.onChange(newItems) 
			//collateItems()
			//console.log(['save field in item list',field, value, item, key, delay])
			return saveField(field, value, item, key, delay ? delay : props.autoSaveDelay).then(function(newItem) { 
				//console.log('saved field in item list')
				//console.log(newItem)
			})
		},
		createNew: createNew,
		createNewFromSibling: createNewFromSibling,
		doDeleteItem: doDeleteItem
	})
	//console.log(props)
	var fieldMeta = props.fieldMeta(formProps)	
	
	formProps.fieldMeta = fieldMeta	
	//console.log(formProps)
	
    const editable = true //isEditable(item,data.user)
	//return []
		//const fieldMeta = props.fieldMeta(props)
		//console.log(fieldMeta)
	//console.log(['BUTTONS',props])
	//console.log([props])
	//createNew(props.parent ? props.parent : {},0)
		return showNewItemModal ? <ItemListNewDialog {...formProps} setShowNewItemModal={setShowNewItemModal} /> : <div style={{width:'100%'}}>   
		    <div style={{ width: '100%'}} >
				{(editable) && <Button variant="success"  style={{float:'right', marginTop:-40}} onClick={function(e) {
					setShowNewItemModal(true)
				}} >+</Button>}
				
				
				{Array.isArray(props.buttons) ? <>{props.buttons.map(function(button,bkey) {
					
						if (typeof button === 'function' ) {
							var thisButton = button(Object.assign({},props.value,{itemkey: bkey, createNew: createNew, createNewFromSibling: createNewFromSibling, setShowNewItemModal: setShowNewItemModal}),function(e) {
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
				{(collatedItems && Array.isArray(collatedItems)) && collatedItems.map(function(item,index) {
					 const editable = props.isEditable ? props.isEditable(item,props.user) : isEditable(item,props.user)
					 const useProps = Object.assign({},formProps, {
						item: item,
						index: index,
						editable: editable
					 })
					 const ListItemComponent = props.listItemComponent
					 return ListItemComponent ? <ListItemComponent {...useProps} /> :  <ItemListComponentRow {...useProps}  />
					
				})}
				</div>
        </div>
        
	</div>
}
         
