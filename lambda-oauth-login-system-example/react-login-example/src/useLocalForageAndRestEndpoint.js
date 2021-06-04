import {useReducer, useState, useEffect} from 'react';

const localForage = require('localforage')
const reducer = require('./reducer')
			
export default function useLocalForageAndRestEndpoint(options) {
   //console.log(['new localforagerestendoint',options])
    const {axiosClient,restUrl,autoSaveDelay,startWaiting,stopWaiting,onItemQueued,onStartSaveQueue,onFinishSaveQueue, modelType, populate, useCategorySearch, minimumBatchSize, defaultSort, autoRefresh, user, createIndexes} = options
    var useCreateIndexes = options.createIndexes ? options.createIndexes : {}
    // auto add index for parent field
    //console.log(['ADD INDEX ?',options.modelType, options, options.parentField , useCreateIndexes[options.parentField]])
	
    if (options.parentField && typeof useCreateIndexes[options.parentField] !== "function") {
		useCreateIndexes[options.parentField] = function(item) {
			if (item && item[options.parentField] && item._id) return [item[options.parentField], item._id]
			else return []
		}
		//console.log(['yes ADD INDEX', useCreateIndexes])	
	}
	var localForages = {}
	const [items, dispatch] = useReducer(reducer,[]);
	//const [autoSaveTimeoutTimeout, setAutoSaveTimeoutTimeout] = useState(null)
	//const [queueActive,setQueueActive] = useState(false)
	const [searchFilter,setSearchFilterI] = useState('') //localStorage ? localStorage.getItem(modelType + 'SearchFilter') : '')
	const [categorySearchFilter,setCategorySearchFilterI] = useState(options.categorySearchFilter ? options.categorySearchFilter  : '') //localStorage ? localStorage.getItem(modelType + 'CategorySearchFilter') : '')
	const [sort,setSortInner] = useState(defaultSort ? defaultSort : {'_id': -1})
	//const [sortLabel, setSortLabel] = useState(defaultSortLabel ? defaultSortLabel : '')
	const [hasNextPage,setHasNextPage] = useState(true)
	const [itemCount,setItemCount] = useState(0)
	
	useEffect(function() {
		setCategorySearchFilter(options.categorySearchFilter)
	},[options.categorySearchFilter])
	
	// strip populated fields
	function cleanItem(item) {
		//console.log(['clean',options.modelType,populate,item])
		var newItem = Object.assign({},item)
		if (Array.isArray(populate)) {
			populate.forEach(function(pop) {
				if (pop && pop.path && newItem.hasOwnProperty(pop.path)) {
					delete newItem[pop.path]
				}
			})
		}
		return newItem
	}
	
	function setLocalIndex(index, indexKey, indexValues) {
		if (useCreateIndexes && index && useCreateIndexes[index] && indexKey && indexValues) {
			var localForageIndexes = localForage.createInstance({name:modelType,storeName:'index-'+ index + (user && user._id ? '-'+user._id : '')});
			localForageIndexes.setItem(String(indexKey),indexValues)
		}
	}
	
	function addArrayToLocalIndexes(items) {
		console.log(['add array to local indexes',useCreateIndexes,items])
		if (useCreateIndexes) {
			Object.keys(useCreateIndexes).forEach(function(key) {
				var indexToCreate = useCreateIndexes[key]
				var localForageIndexes = localForage.createInstance({name:modelType,storeName:'index-'+ key + (user && user._id ? '-'+user._id : '')});
							
				if (typeof indexToCreate === "function" && Array.isArray(items)) {
					var itemsIndex = {}
					items.forEach(function(item) {
						var [indexKey,indexValue] = indexToCreate(item)
						if (indexKey && indexValue) {
							var indexValues = itemsIndex[String(indexKey)] ? itemsIndex[String(indexKey)] : []
							indexValues.push(indexValue)
							itemsIndex[String(indexKey)] = indexValues
						}
					})
					//console.log(itemsIndex)
					Object.keys(itemsIndex).forEach(function(indexKey) {
						localForageIndexes.getItem(String(indexKey)).then(function(indexValuesSaved) {
							var indexValues = Array.isArray(indexValuesSaved) ? indexValuesSaved : []
							itemsIndex[indexKey].forEach(function(indexValue) {
								if (indexValues.indexOf(indexValue) === -1) {
									indexValues.push(indexValue)
									//console.log(['add to local indexes set item',indexValues,indexKey])
									localForageIndexes.setItem(String(indexKey),indexValues)
								}
							})
						})
					})
				}
			})
		}
	}						
	
	function addToLocalIndexes(item) {
		console.log(['add to local indexes',useCreateIndexes,item])
		if (useCreateIndexes) {
			Object.keys(useCreateIndexes).forEach(function(key) {
				var indexToCreate = useCreateIndexes[key]
				var localForageIndexes = localForage.createInstance({name:modelType,storeName:'index-'+ key + (user && user._id ? '-'+user._id : '')});
							
				if (typeof indexToCreate === "function") {
					//var itemsToAdd = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems]
					//var itemsIndex = {}
					//itemsToAdd.forEach(function(item) {
						//var [indexKey,indexValue] = indexToCreate(item)
						//if (indexKey && indexValue) {
							//var indexValues = itemsIndex[String(indexKey)] ? itemsIndex[String(indexKey)] : []
							//indexValues.push(indexValue)
							//itemsIndex[String(indexKey)] = indexValues
						//}
					//})
					//console.log(itemsIndex)
					//Object.keys(itemsIndex).forEach(function(indexKey) {
					var [indexKey,indexValue] = indexToCreate(item)
					localForageIndexes.getItem(String(indexKey)).then(function(indexValuesSaved) {
						var indexValues = Array.isArray(indexValuesSaved) ? indexValuesSaved : []
						//itemsIndex[indexKey].forEach(function(indexValue) {
							if (indexValues.indexOf(indexValue) === -1) {
								indexValues.push(indexValue)
								//console.log(['add to local indexes set item',indexValues,indexKey])
								localForageIndexes.setItem(String(indexKey),indexValues)
							}
						//})
					})
					//})
						
						
							//console.log(['add to local indexes',indexKey, indexValue])
							//if (Array.isArray(itemsIndex[String(indexKey)])) {
								//var indexValues = itemsIndex[String(indexKey)]
								////itemsIndex[String(indexKey)] = indexValues
								//console.log(['add to local indexes GOT ITME loc',indexValues])
								//if (Array.isArray(indexValues)) {
									//if (indexValues.indexOf(indexValue) === -1) {
										//indexValues.push(indexValue)
										//console.log(['add to local indexes set item',indexValues,indexKey])
										//localForageIndexes.setItem(String(indexKey),indexValues)
									//}
								//} else {
									//console.log(['add to local indexes set first item',[indexValue],indexKey])
									//localForageIndexes.setItem(String(indexKey),[indexValue])
								//}
							//} else {
								//localForageIndexes.getItem(String(indexKey)).then(function(indexValues) {
									//itemsIndex[String(indexKey)] = indexValues
									//console.log(['add to local indexes GOT ITME',indexValues])
									//if (Array.isArray(indexValues)) {
										//if (indexValues.indexOf(indexValue) === -1) {
											//indexValues.push(indexValue)
											//console.log(['add to local indexes set item',indexValues,indexKey])
											//localForageIndexes.setItem(String(indexKey),indexValues)
										//}
									//} else {
										//console.log(['add to local indexes set first item',[indexValue],indexKey])
										//localForageIndexes.setItem(String(indexKey),[indexValue])
									//}
								//})
							//}
						//}
					//})
				}
			})
		}
	}
	
	function removeFromLocalIndexes(item) {
		console.log(['remove from local index',useCreateIndexes,item])
		if (useCreateIndexes) {
			Object.keys(useCreateIndexes).forEach(function(key) {
				var indexToCreate = useCreateIndexes[key]
				if (typeof indexToCreate === "function") {
					var [indexKey,indexValue] = indexToCreate(item)
					if (indexKey && indexValue) {
						var localForageIndexes = localForage.createInstance({name:modelType,storeName:'index-'+ key + (user && user._id ? '-'+user._id : '')});
						//localForageIndexes.removeItem(indexValue)
						localForageIndexes.getItem(String(indexKey)).then(function(indexValues) {
							if (Array.isArray(indexValues)) {
								if (indexValues.indexOf(indexValue) !== -1) {
									indexValues.splice(indexValues.indexOf(indexValue),1)
									console.log(['removed',indexValues])
									localForageIndexes.setItem(String(indexKey), indexValues)
								}
							} 
						})
					}
				}
			})
		}
	}
	
	
	
	function getIndexValues(index, indexKey) {
		//console.log(['get index values',index,indexKey,user?user._id:null])
		const {localForageItems} = initLocalForage(modelType)
		return new Promise(function(resolve, reject) {
			if (useCreateIndexes && index && useCreateIndexes[index] && indexKey) {
				var localForageIndexes = localForage.createInstance({name:modelType,storeName:'index-'+ index + (user && user._id ? '-'+user._id : '')});
				localForageIndexes.getItem(String(indexKey)).then(function(results) {
					if (results) {
						//console.log(['got index values',results])
						resolve(results)
					} else {
						resolve(null)
					}
				})
			} else {
				resolve(null)
			}
		})
	}
	
	function getItemsFromIndexValues(index, indexKey) {
		//console.log(['get items from index values',index,indexKey,user?user._id:null])
		return new Promise(function(resolve, reject) {
			getIndexValues(index, indexKey).then(function(itemIds) {
				var promises =[]
				const {localForageItems} = initLocalForage(modelType)
		
				if (Array.isArray(itemIds)) {
					itemIds.forEach(function(id) {
						promises.push(localForageItems.getItem(id))
					})
				}
				Promise.all(promises).then(function(finalItems) {
					resolve(finalItems)
				})
			})
		})
	}
	
	function getFirstItemFromIndexValues(index, indexKey) {
		//console.log(['get first item from index values',index,indexKey,user?user._id:null])
		return new Promise(function(resolve, reject) {
			getIndexValues(index, indexKey).then(function(itemIds) {
				var promises =[]
				const {localForageItems} = initLocalForage(modelType)
				if (Array.isArray(itemIds) && itemIds.length > 0) {
					localForageItems.getItem(itemIds[0]).then(function(item) {
						resolve(item)
					})
				} else {
					resolve(null)
				}
			})
		})
	}
	
	/**
	 * Find items in local storage
	 * filter supports 
	 * - field match (regex or complete)
	 * - some ops $eq, $ne, $gt, $lt, ..
	 * - indexes
	 */
	//function findItems(filter) {
		
	//}
	
	
	function collateItems(items) {
		//console.log('collate',options.modelType, options.collateOn, items)
		if (Array.isArray(items)) {
			var newItems = {}
			var itemIndex = {}
			var children = {}
			var parentIds = []
			// index by id and collate parentIds
			items.forEach(function(item,valueKey) {
				if (item && item._id) {
					itemIndex[item._id] = Object.assign({},item,{itemkey: valueKey, sortField: item.updated_date})
					children[item._id] = []
					parentIds.push(item._id)
				}
			})
			// iterate values, collating children
			items.forEach(function(item,valueKey) {
				// collate children where parent is in list
				//console.log(['COLLATED ITEM'])
				if (Array.isArray(parentIds) && item && item._id && item.hasOwnProperty(options.collateOn) && item[options.collateOn] &&  Array.isArray(children[item[options.collateOn]]) && parentIds.indexOf(item[options.collateOn]) != -1) {
					children[item[options.collateOn]].push(Object.assign({},item,{itemkey: valueKey}))
					//itemIndex[item._id].sortField = child.updated_date > item.updated_date ? child.updated_date : item.updated_date
					delete itemIndex[item._id]
				}
			})
			// assign children back to indexed List
			Object.keys(children).forEach(function(key) {
				var childs = children[key]
				var mostRecent = 0
				if (childs && childs.length > 0) {
					childs.forEach(function(childItem)  {
						if (mostRecent < childItem.updated_date) {
							mostRecent = childItem.updated_date
						}
					})
					if (itemIndex[key].updated_date < mostRecent) {
						itemIndex[key].sortField = mostRecent
					} 
					itemIndex[key].children = childs
				}
			})
			// sort
			var collatedArray = Object.values(itemIndex)
			collatedArray.sort(function(a,b) {
				if (a && b && a.sortField < b.sortField) {
					return 1
				} else {
					return -1
				}
				
			})
			//setItems(collatedArray)
			console.log('COLLATED')
			console.log(collatedArray)
			return collatedArray
		}
	}
	
	const [collatedItems,setCollatedItems] = useState(null)
	useEffect(function() {
		//setCollatedItems(items)
		//return
		console.log(['items change',items])		
		if (options.collateOn) { 
			console.log(['items change collateOn',options.collateOn,items])		
			if (Array.isArray(items) && items.length > 0 ) { 	
				console.log(['set items change collateOn',options.collateOn,items])		
			
				setCollatedItems(collateItems(items))
			}
			
		} else {
			var sorted = Array.isArray(items) ? items : []
			sorted.sort(function(a,b) {
				//console.log(['test',a && b && a.sort < b.sort,a,b])
				if (a && b && a.updated_date < b.updated_date) {
					return -1
				} else {
					return 1
				}
			}) 
			console.log(['sorted list',sorted])		
			setCollatedItems(sorted)
			//console.log('itemlist val update')
		}
	},[items])
	
	
	
	function setSort(sort) {
		setSortInner(sort)
		//console.log(['SETSORT',JSON.stringify(sort)])
		//if (startWaiting) startWaiting()
		//searchItems(getSearchFilter(), function(iitems) {
			//if (stopWaiting) stopWaiting()
			//setItemCount(iitems.length + ((iitems && iitems.length === minimumBatchSize) ? 1 : 0))
		//},minimumBatchSize,0,sort)
		var newItems = items.slice(0)
		Object.keys(sort).forEach(function(key) {
			const sortDirection = sort[key] > 0 ? 1 : -1
			//console.log(['SETSORT on ',key])
			newItems.sort(function(a,b) {
				//console.log(['SETSORT test ',a[key],b[key]])
				if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && a[key] < b[key])  {
					return -1 * sortDirection
				} else {
					return 1 * sortDirection
				}
			})
		})
		//console.log(['SETSORT on ',newItems])
		setItems(newItems)
	}
	
	function setCategorySearchFilter(value) {
		console.log(['set cat search',options.setCategorySearchFilter,value])
		if (options.setCategorySearchFilter) {
			options.setCategorySearchFilter(value)
		}
		setCategorySearchFilterI(value)
		setSearchFilter('')
		//if (localStorage) localStorage.setItem(modelType + 'CategorySearchFilter',value)
	}

	function setSearchFilter(value) {
		setSearchFilterI(value)
		//if (localStorage) localStorage.setItem(modelType + 'SearchFilter',value)
	}

	
	function initLocalForage(collection='default') {
		//const userId = (user && user._id) ? user._id : ''
		if (!localForages[collection]) {
			var localForageItems = localForage.createInstance({name:modelType,storeName:'items'+(user && user._id ? '-'+user._id : '')});
			var localForageSearches = localForage.createInstance({name:modelType,storeName:'searches'+(user && user._id ? '-'+user._id : '')});
			var localForagePatches = localForage.createInstance({name:modelType,storeName:'patches'+(user && user._id ? '-'+user._id : '')});
			localForages[collection] = {localForageItems, localForageSearches, localForagePatches}
		}
		return localForages[collection]
	}
   
    function getSearchFilter(categorySearchFilterI=null,searchFilterI=null) {
		var filter = {}
		// from params or state
		const asearchFilter = searchFilterI ? searchFilterI.trim() : searchFilter
		const acategorySearchFilter = categorySearchFilterI ? categorySearchFilterI : categorySearchFilter
		if (useCategorySearch && acategorySearchFilter) {
			if (asearchFilter) {
				var catfilter = {}
				catfilter[useCategorySearch] = acategorySearchFilter
				filter = {"$and":[{"$text":{"$search":asearchFilter}},catfilter]}
			} else {
				filter = {}
				filter[useCategorySearch] = acategorySearchFilter
			}
		} else {
			if (asearchFilter) {
				filter = {"$text":{"$search":asearchFilter}}
			} else {
				filter = {}
			}
		}
		return filter
	}
	
	
	
	
   
    // to  endpoint root
    function doPost(data) {
        //console.log(['POST', modelType, data, restUrl])  
        return new Promise(function(resolve,reject) {
            if (modelType && data) {
                axiosClient.post(restUrl+modelType,
                  data,
                  {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                  }
                ).then(function(res) {
                  resolve(res)
                }).catch(function(res) {
                  reject({error:'Invalid request error'})
                })
            } else {
                reject({error:'Invalid request'})
            }
        })
    }
    
    // to  endpoint with id
    function doPut(data) {
        //console.log(['PUT', modelType, data, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (modelType && data && data._id) {
                axiosClient.put(restUrl+modelType+"/"+data._id,
                  data,
                  {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                  }
                ).then(function(res) {
                  //console.log(res)  
                  resolve(res)
                }).catch(function(res) {
                  reject({error:'Invalid request error'})
                })
            } else {
                reject({error:'Invalid request'})
            }
        })
    }
    
    
  
    
    
    // to  endpoint with id
    function doPatch(data) {
        //console.log(['PATCH', modelType, data, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (modelType && data && data._id && data._id.trim()) {
                axiosClient.patch(restUrl+modelType+"/"+data._id,
                  data,
                  {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                  }
                ).then(function(res) {
                      //console.log(['update',res])  
                      resolve(res)
                }).catch(function(res) {
                  reject({error:'Invalid request error'})
                })
            } else {
                reject({error:'Invalid request'})
            }
        })
    }
    
    // EXPOSED METHODS
    function saveField(field, value, item, key, delay=null) {
		return new Promise(function (resolve,reject) {
			if (modelType && field && item && item._id) {
				//console.log(['savefield saveitem',field, value, item, key, delay])
				var data = {_id:item._id}
				data[field] = value
				//console.log(['savefield saveitem data',data])
				saveItem(data,key, delay).then(function(newItem) {
					//console.log(['savefield saved',newItem])
					resolve(newItem)
				})
			} else {
				resolve(Object.assign({},item,data))
			}
		})
	} 
    
    var autoSaveTimeoutTimeout = null
    
    function saveItem(data, key=-1, delay=null) {
		const {localForageItems, localForagePatches} = initLocalForage(modelType)
		console.log(['save',modelType, data])
		// first up, merge fields update into UI items data
		if (key >= 0) {
			console.log(['merge',key])
			dispatch({type:'merge',index:key,item:data})
		}	
		if (autoSaveTimeoutTimeout) clearTimeout(autoSaveTimeoutTimeout)
															
		return new Promise(function(resolve,reject) {
			if (data && data._id)  {
				//console.log(['save do update',data._id])
				// save changes to localForage patches collection for upload later
				localForagePatches.getItem(data._id).then(function(patch) {
					if (typeof patch !== "object" || patch === null || patch === undefined) patch = {} 
					//console.log(patch,data)
					if (!patch._id) patch._id = data._id
					patch = Object.assign({},patch,data)
					localForagePatches.setItem(data._id,patch).then(function() {
						if (onItemQueued) onItemQueued()
						//console.log('saved patch')
						localForageItems.getItem(data._id).then(function(item) {
							if (!item || typeof item !== "object") item = {} 
							if (!item._id) item._id = data._id
							item = Object.assign({},item,data)
							// save changes to localForage items
							localForageItems.setItem(data._id,cleanItem(item)).then(function() {
								//console.log(['AAA saved item',item,autoSaveDelay, delay])
								addToLocalIndexes(item)
								// trigger upload queue
								var d = delay !== null ? delay : (autoSaveDelay > 0 ? autoSaveDelay : 0)
								if (d > 0) {
									//console.log(['timeout ?',d])
									//setQueueActive(true)
									clearTimeout(autoSaveTimeoutTimeout)
									autoSaveTimeoutTimeout = setTimeout(function() {
										//console.log('AAAautosave')
										saveQueue().then(function() {
											//console.log('saveQ done')
											//setQueueActive(false)
										})
									},autoSaveDelay)
								}
								resolve(item)
							})
							
						})
						//resolve(data)
					})
					
				})
			} else {
				//console.log(['save new',data])
				delete data._id 
				// new records need to be saved directly to db to create _id
				return doPost(data).then(function(res) {
					//console.log(['post',res])
					if (res && res.data && res.data._id) {
						//console.log(['patch do locasl'])
						// save changes to localForage items
						localForageItems.setItem(res.data._id,cleanItem(res.data)).then(function(value) {
								addToLocalIndexes(res.data)
								//console.log(['patch locasl',value])
								// now delete from state
								//if (stopWaiting) stopWaiting()
								if (key >= 0) {
									dispatch({type:'insert',index:key,item:res.data})
								} else {
									dispatch({type:'prepend',data:res.data})
								}
								resolve(res.data)  
						})
					} else {
						//if (stopWaiting) stopWaiting()
						reject(res)  
					}
				})
			}
		})
	}
	
	function saveItemLocal(item) {
		const {localForageItems} = initLocalForage(modelType)
		//console.log(['save',modelType, data])
		// first up, merge fields update into UI items data
		return new Promise(function(resolve,reject) {
			if (item && item._id) {
				var clean = cleanItem(item)
				localForageItems.setItem(item._id,clean)
				addToLocalIndexes(clean)
			}
			resolve(clean)
		})
	}
	
	//function saveQueue() {
		//console.log('saveQ')
		//console.log(queueActive)
		//if (!queueActive) {
			//console.log('saveQ real')
		
			//setQueueActive(true)
			////queueTimeout = setTimeout(function() {
			//doSaveQueue().then(function() {
				//console.log('saveQ done')
				//setQueueActive(false)
			//})
			////},1000)
		//}
	//}
	 
	function saveQueue() {
		//console.log('dosaveQ '+modelType)
		const {localForagePatches} = initLocalForage(modelType)
		if (onStartSaveQueue) onStartSaveQueue() 
		return new Promise(function(resolve,reject) {
			localForagePatches.keys().then(function(patchKeys) {
				if (patchKeys && Array.isArray(patchKeys) && patchKeys.length > 0)  {
					var promises = []
					patchKeys.forEach(function(patchKey) {
						promises.push(localForagePatches.getItem(patchKey))
					})
					Promise.all(promises).then(function(data) {
						var urlParts = restUrl.split("/rest/api/")
						var url = urlParts[0] + "/rest/bulk/"
						//console.log(['RURL',url])
						if (data && data.length > 0) {
							axiosClient.patch(url+modelType,
							  data,
							  {
								headers: {
									'Content-Type': 'application/json'
								  },
							  }
							).then(function(res) {
								//console.log(['done psot',res])
								if (res && res.data && res.status === 200) { //Array.isArray(res.data) && res.data.length === data.length) {
									var ipromises = []
									patchKeys.forEach(function(patchKey) {
										ipromises.push(localForagePatches.removeItem(patchKey))
									})
									Promise.all(ipromises).then(function() {
										//console.log(['cleared patches',res.data]) 
										if (onFinishSaveQueue) onFinishSaveQueue() 
										resolve(res.data)
									})
								} else {
									if (onFinishSaveQueue) onFinishSaveQueue() 
									resolve({})
								}
							  //console.log(res)
							}).catch(function(res) {
							  //console.log(res)
							  if (onFinishSaveQueue) onFinishSaveQueue() 
							  resolve({})
							})			
						} else {
							if (onFinishSaveQueue) onFinishSaveQueue() 
							resolve({})
						}		
					})
				} else {
					if (onFinishSaveQueue) onFinishSaveQueue() 
					resolve({})
				}
			})			
		})
	}


    function saveItemNow(data, key=-1, patch=true) {
		const {localForageItems} = initLocalForage(modelType)
		//if (startWaiting) startWaiting()
		//console.log(['save',modelType, data, patch])

		return new Promise(function(resolve,reject) {
			if (data._id && data._id)  {
				if (patch) {
					if (key >= 0) {
						dispatch({type:'update',index:key,item:data})
					}
					return doPatch(data).then(function(res) {
						//console.log(['patch',res.data])
						if (res && res.data && res.data._id) {
							//console.log(['patch do locasl'])
							localForageItems.setItem(res.data._id,cleanItem(res.data)).then(function(value) {
									addToLocalIndexes(res.data)
									//console.log(['patch locasl',value])
									if (stopWaiting) stopWaiting()
									
									resolve(res.data)  
							})
						} else {
							if (stopWaiting) stopWaiting()
							reject()
						}
					})
				} else {
					if (key >= 0) {
						dispatch({type:'update',index:key,item:data})
					}
					return doPut(data).then(function(res) {
						//console.log(['put',res])
						if (res && res.data && res.data._id) {
							//console.log(['patch do locasl'])
							localForageItems.setItem(res.data._id,cleanItem(res.data)).then(function(value) {
									addToLocalIndexes(res.data)
									//console.log(['patch locasl',value])
									if (stopWaiting) stopWaiting()
									resolve(res.data)  
							})
						} else {
							if (stopWaiting) stopWaiting()
							reject()
						}
					})
				}
			} else {
				delete data._id 
				return doPost(data).then(function(res) {
					//console.log(['post',res])
					if (res && res.data && res.data._id) {
						//console.log(['patch do locasl'])
						localForageItems.setItem(res.data._id,cleanItem(res.data)).then(function(value) {
								addToLocalIndexes(res.data)
								//console.log(['patch locasl',value])
								// now delete from state
								if (stopWaiting) stopWaiting()
								if (key >= 0) {
									dispatch({type:'insert',index:key,item:res.data})
								} else {
									dispatch({type:'prepend',data:res.data})
								}
								resolve(res.data)  
						})
					} else {
						if (stopWaiting) stopWaiting()
						reject(res)  
					}
				})
			}
		})
    }
    
    
    
    
	function deleteItem(item, key = -1) {
		console.log(['DELETdddd',item,key])
		const {localForageItems} = initLocalForage(modelType)
		if (startWaiting) startWaiting()
        
        if (key >= 0) {
			console.log(['DELETE dispathc',item,key])
			dispatch({type:'remove',index:key})
		} else {
			console.log(['DELETE no dispatchdispathc',item,key])
		}
        //console.log(['DELETE', modelType, id, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (item && item._id && item._id.trim()) {
                return axiosClient.delete(restUrl+modelType+"/"+item._id,
                  {
                  },
                  {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  }
                ).then(function(res) {
					localForageItems.removeItem(item._id).then(function(value) {
						removeFromLocalIndexes(item)
						//if (key >= 0) {
							//dispatch({type:'remove',index:key})
						//}
					})
					if (stopWaiting) stopWaiting()
                    resolve(res)
                }).catch(function(res) {
					localForageItems.removeItem(item._id).then(function(value) {
						removeFromLocalIndexes(item)
					})
					if (stopWaiting) stopWaiting()
                    reject({error: 'Invalid request error'})
                })
            } else {
				if (stopWaiting) stopWaiting()
                 reject({error: 'Invalid request'})
            }
        })
    }
    
    
     
	function deleteItemLocal(item, key = -1) {
		const {localForageItems} = initLocalForage(modelType)
		if (startWaiting) startWaiting()
        
        if (key >= 0) {
			dispatch({type:'remove',index:key})
		}
        //console.log(['DELETE', modelType, id, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (item && item._id && item._id.trim()) {
                localForageItems.removeItem(item._id).then(function(value) {
						removeFromLocalIndexes(item)
						if (key >= 0) {
							dispatch({type:'remove',index:key})
						}
						//setCollatedItems(collateItems(items))
				})
				if (stopWaiting) stopWaiting()
				resolve()			
            } else {
				if (stopWaiting) stopWaiting()
                 reject({error: 'Invalid request'})
            }
        })
    }
    
    
    function refreshItem(id,key) {
		console.log(['refre',id,key])
		const {localForageItems} = initLocalForage(modelType)
		return new Promise(function(resolve,reject) {
			axiosClient.get(restUrl+modelType+"/"+id + (populate ? '?populate='+encodeURIComponent(JSON.stringify(populate)) : ''),
			  {},{
				headers: {
					'Content-Type': 'application/json'
				  },
			  }
			).then(function(res) {
				if (res && res.data) {
					console.log(['check online update res ',id,cleanItem(res.data),res.data])
					localForageItems.setItem(id,cleanItem(res.data)).then(function(value) {
						dispatch({type:'update', index: key , item: res.data})
						addToLocalIndexes(res.data)
						console.log(['dispatched',res.data])
						resolve(res.data)
					
					})
					//console.log(['gotitme',item])
				} else {
					//console.log(['gotitme nodata'])
					resolve(null)
				} 
			}).catch(function(res) {
				//console.log(['gotitme err',res])
				resolve(null)
			  //reject({error:'Invalid request error'})
			})
			
		})
	}
    
	function getItem(id, callback) {
        //console.log(['GET', modelType, id, restUrl]) 
        const {localForageItems} = initLocalForage(modelType)
        if (startWaiting) startWaiting()
        //return new Promise(function(resolve,reject) {
            if (id) {
				//console.log(['GEThave id']) 
				// try for local first
				localForageItems.getItem(id).then(function(value) {
					//console.log(['GET got value',value]) 
					if (value) {
						if (stopWaiting) stopWaiting()
						//console.log(['GET got local', value]) 
						if (callback) callback(value)
						// now check online for update  
						//
						if (autoRefresh) { 
							//console.log('check online update')
							//console.log(JSON.stringify(JSON.stringify({"$and":[{"_id":"ObjectId("+id+")"},{"updated_date":{"$gt":value && value.updated_date > 0 ? parseInt(value.updated_date) : 0}}]})))
							axiosClient.get(restUrl+modelType+'/?query='+encodeURIComponent(JSON.stringify({"$and":[{"_id":id},{"updated_date":{"$gt":value && value.updated_date > 0 ? parseInt(value.updated_date) : 0}}]})) + (populate ? '&populate='+encodeURIComponent(JSON.stringify(populate)) : ''),
			
							//+'&select=id,updated_date',
							  {},{
								headers: {
									'Content-Type': 'application/json'
								  },
							  }
							).then(function(res) {
								if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
									//console.log(['check online update res ',res.data])
									localForageItems.setItem(id,cleanItem(res.data[0])).then(function(value) {
										addToLocalIndexes(res.data[0])
										//console.log(['GET got online', res.data[0]]) 
										if (callback) callback(res.data[0])
									})
								} 
							}).catch(function(res) {
							  //reject({error:'Invalid request error'})
							})
						}
					} else {
						// fallback to online
						axiosClient.get(restUrl+modelType+"/"+id,
						  {},{
							headers: {
								'Content-Type': 'application/json'
							  },
						  }
						).then(function(res) {
							if (res && res.data) { 	
								localForageItems.setItem(id,cleanItem(res.data)).then(function(value) {
									addToLocalIndexes(res.data)
									if (stopWaiting) stopWaiting()
									if (callback) callback(res.data)
								})
							} else {
								if (stopWaiting) stopWaiting()
								if (callback) callback(null)
							}
						}).catch(function(res) {
						  if (stopWaiting) stopWaiting()
						  if (callback) callback(null)
						  //reject({error:'Invalid request error'})
						})
					}
				}).catch(function(err) {
					if (stopWaiting) stopWaiting()
					if (callback) callback(null)
					console.log(err);
				});
				
				
            } else {
				if (stopWaiting) stopWaiting()
				if (callback) callback(null)
                //reject({error:'Invalid request'})
            }
        //})
    }
    
    /**
     * Search and return an array of ids
     */
    function searchItemIds(filter, limit=20000, skip=0, sort) {
		//console.log(['searchItemIds',modelType,filter])	
		 return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify(filter)),
                'limit='+limit,
                'skip='+skip,
                'select=_id'
            ]
            //if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
            if (sort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(sort)))
            axiosClient.get(restUrl+modelType+'?'+queryParts.join("&"),
              {},{
                headers: {
                    'Content-Type': 'application/json'
                  },
              }
            ).then(function(res) {
              //console.log(['GET many',res])  
              if (res && res.data && Array.isArray(res.data)) { 	
				const theIds = res.data.map(function(item) {
					 return item._id
				 })
				 //setItemCount(theIds.length + (hasNextPage ? 1 : 0))
					
				resolve(theIds)
			  } else {
				  resolve([])
			  }
    		}).catch(function(res) {
              //console.log(res)  
              reject({error: 'Invalid request error'})
            })
        })
	}

	//function searchItemIdsWithDate(filter, limit=20, skip=0) {
		////console.log(['searchItemIds',modelType,filter])	
		 //return new Promise(function(resolve,reject) {
            //var queryParts=[
                //'query='+encodeURIComponent(JSON.stringify(filter)),
                //'limit='+limit,
                //'skip='+skip,
                //'select=_id,updated_date'
            //]
            ////if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
            //if (sort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(sort)))
            //axiosClient.get(restUrl+modelType+'?'+queryParts.join("&"),
              //{},{
                //headers: {
                    //'Content-Type': 'application/json'
                  //},
              //}
            //).then(function(res) {
              ////console.log(['GET many',res])  
              //if (res && res.data && Array.isArray(res.data)) { 	
				////setItemCount(res.data.length + (hasNextPage ? 1 : 0))
				//resolve(res.data.map(function(item) {
					 //return item._id
				 //}))
			  //} else {
				  //resolve([])
			  //}
    		//}).catch(function(res) {
              ////console.log(res)  
              //reject({error: 'Invalid request error'})
            //})
        //})
	//}
	

	
	
	function loadItemsByIds(idsArray) {
		return new Promise(function(resolve,reject) {
			var urlParts = restUrl.split("/rest/api/")
			var url = urlParts[0] + "/rest/updates/"
			axiosClient.post(url+modelType, //+'?'+ (populate ? '&populate='+encodeURIComponent(JSON.stringify(populate)) : ''),
			  {ids: idsArray, populate: populate},{
				headers: {'Content-Type': 'application/json'},
			  }
			).then(function(res) {
			  //console.log(['GET many',res])  
			  if (res && res.data && Array.isArray(res.data)) { 	
				  //res.data.forEach(function(item) {
					if (res.data.length > 0) addArrayToLocalIndexes(res.data)
				  //})
				resolve(res.data)
			  } else {
				  resolve([])
			  }
			}).catch(function(res) {
			  reject({error: 'Invalid request error'})
			})
		})
		
		//return new Promise(function(oresolve,oreject) {
		////console.log(['loadItemsByIds',modelType,idsArray,populate])	
			//var promises = []
			//// chunks to avoid exceeding url string length
			//var chunks = chunkArray(idsArray,80)
			////console.log(['loadItemsByIds chunks',chunks])
			//chunks.forEach(function(chunk) {
				////console.log(['loadItemsByIds  chunk',chunk])
				//promises.push(new Promise(function(resolve,reject) {
					//var queryParts=[
						//'query='+encodeURIComponent(JSON.stringify({_id: {"$in": chunk}})),
					//]
					////console.log(['loadItemsByIds',JSON.stringify(queryParts)])
					//// ?? TODO if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
					//axiosClient.get(restUrl+modelType+'?'+queryParts.join("&")+ (populate ? '&populate='+encodeURIComponent(JSON.stringify(populate)) : ''),
					  //{},{
						//headers: {
							//'Content-Type': 'application/json'
						  //},
					  //}
					//).then(function(res) {
					  ////console.log(['GET many',res && res.data])  
					  //if (res && res.data && Array.isArray(res.data)) { 	
						  //console.log(['GET many res',res && res.data])  
						//resolve(res.data)
					  //} else {
						  //resolve([])
					  //}
					//}).catch(function(res) {
					  ////console.log(res)  
					  //reject({error: 'Invalid request error'})
					//})
				//}))
			//})
			//var combined = []
			////console.log(promises.length + ' promises')
			//Promise.all(promises).then(function(results) {
				////console.log([' promise restuls',results])
				//results.forEach(function(result) {
					//combined = combined.concat(result)
					////console.log([' promise restuls row',combined,result])
					
				//})
				////console.log([' promise restuls final',combined])
				//oresolve(combined)
			//})
			
		//})
	}
	
	function loadUpdatedItems(idsAndUpdatedDate) {
		return new Promise(function(resolve,reject) {
			var urlParts = restUrl.split("/rest/api/")
			var url = urlParts[0] + "/rest/updates/"
			axiosClient.post(url+modelType, //+'?'+ (populate ? '&populate='+encodeURIComponent(JSON.stringify(populate)) : ''),
			  {ids: idsAndUpdatedDate, populate: populate},{
				headers: {'Content-Type': 'application/json'},
			  }
			).then(function(res) {
			  //console.log(['GET many',res])  
			  if (res && res.data && Array.isArray(res.data)) { 	
				  //res.data.forEach(function(item) {
					  if (res.data.length > 0) addArrayToLocalIndexes(res.data)
				  //})
				resolve(res.data)
			  } else {
				  resolve([])
			  }
			}).catch(function(res) {
			  reject({error: 'Invalid request error'})
			})
		})
	}
	
	function collateFinalList(ids,loadedItemsIndex,skipCheckForUpdates,callback,limit,skip) {
		var start = new Date().getTime()
		const {localForageItems} = initLocalForage(modelType)
		//console.log(['COLLATEFINALLIST',skipCheckForUpdates,modelType,ids,loadedItemsIndex])	
		return new Promise(function(resolve,reject) {
			// async load all localstorage items
			var promises = []
			//console.log(['collateFinal start',new Date().getTime() - start])
			ids.forEach(function(id) {
				if (id && !loadedItemsIndex.hasOwnProperty(id)) promises.push(localForageItems.getItem(id))
			})
			// collate lists and resolve
			function doCollate(loadedItemsIndex,localItemsIndex) {
				//console.log(['collateFinal docollate',new Date().getTime() - start])
				var finalList = []
				ids.forEach(function(id) {
					if (id && loadedItemsIndex.hasOwnProperty(id)) {
						finalList.push(loadedItemsIndex[id])
					} else  {
						finalList.push(localItemsIndex[id])
					}
			
				})
				//console.log(['COLLATED ',finalList.length,finalList])
						
				//console.log(['COLLATEFINALLIST IS',finalList])	
				//dispatch({type:'replaceall',items:finalList})
				//console.log({type:'extend',items:finalList,limit:limit,skip:skip})
				dispatch({type:'extend',items:finalList,limit:limit,skip:skip})
				if (callback) callback(finalList)
				resolve(finalList)
			}
			//console.log(['collateFinal created promises',new Date().getTime() - start])
			Promise.all(promises).then(function(localItems) {
				//console.log(['collateFinal done promises',new Date().getTime() - start])
				//console.log(['COLLATED DONE LOCAL PROMISES',localItems])
				// index local items
				var localItemsIndex = {}
				//
				if (Array.isArray(localItems)) {
					var updateCheck = []
					localItems.forEach(function(localItem) {
						if (localItem && localItem._id) {
							localItemsIndex[localItem._id] = localItem
							// collate criteria for update check
							if (!skipCheckForUpdates) {
								//updateCheck.push({'$and':[{_id:localItem._id},{"updated_date":{'$gt':localItem && localItem.updated_date > 0 ? parseInt(localItem.updated_date) : 0}}]})
								updateCheck.push([localItem._id, localItem && localItem.updated_date > 0 ? parseInt(localItem.updated_date) : 0])
							}
						}
					})
					//console.log(['collateFinal created local index',new Date().getTime() - start])
					
					if (stopWaiting) stopWaiting()
					if (updateCheck.length > 0) {
						// respond with local version
						doCollate(loadedItemsIndex,localItemsIndex)
					
						//console.log(['collateFinal do update',new Date().getTime() - start,updateCheck])
						// query for updated items using updated dates collated from local items
						loadUpdatedItems(updateCheck).then(function(results) {
							//console.log(['collateFinal done update',results,new Date().getTime() - start])
							if (results && Array.isArray(results))  {
								// update the loadedItemsIndex to include updated records
								results.forEach(function(result) {
									if (result && result._id) loadedItemsIndex[result._id] = result
									localForageItems.setItem(result._id,cleanItem(result)) // don't wait
									//addToLocalIndexes(result)
								})
								//console.log(['COLLATEFINALLIST UPDATE CHECK INTEGRATE',results,loadedItemsIndex])	
								doCollate(loadedItemsIndex,localItemsIndex)
							} else {
								//console.log(['collateFinal collate no update results',new Date().getTime() - start])
								doCollate(loadedItemsIndex,localItemsIndex)
							}
						})
					} else {
						//console.log(['collateFinal collate no update',new Date().getTime() - start])
						doCollate(loadedItemsIndex,localItemsIndex)
					}
					
				} else {
					doCollate(loadedItemsIndex,localItemsIndex)
				}
			})
			
			
		})
	}
	
	
	function loadSearchItems(ids,callback, skipCheckForUpdates, limit, skip) {
		return new Promise(function(resolve,reject) {
			//var start = new Date().getTime()
			//console.log(['loadSearchItems',modelType,ids,start])	
			//return new Promise(function(resolve,reject) {
			const {localForageItems} = initLocalForage(modelType)
			// cross reference the ids in the list of keys for local items
			// create a list of locally missing keys and load those records
			localForageItems.keys().then(function(keys) {
				 //console.log(['got all keys',new Date().getTime() - start])
				 // Index the key names.
				 var keyIndex = {}
				 keys.map(function(thekey) {
					keyIndex[thekey] = true
					return null
				 })
				 //console.log(keys);
				 
				 var missingIds = []
				 //var localIds = []
				 ids.forEach(function(id) {
					if (!keyIndex.hasOwnProperty(id)) {
						 missingIds.push(id)
					 } else {
						 //localIds.push(id)
					 }
				 })
				 //console.log(['loadSearchItems missingIds',missingIds])	
				 if (missingIds.length > 0) {
					 loadItemsByIds(missingIds).then(function(loadedItems) {
						 //console.log(['loaded missing',new Date().getTime() - start])
						 //console.log(['loadSearchItems loaded',loadedItems])	
						 // index the loaded items
						 var loadedItemsIndex = {}
						 if (Array.isArray(loadedItems)) {
							 loadedItems.forEach(function(thisItem) {
								if (thisItem && thisItem._id) {
									loadedItemsIndex[thisItem._id] = thisItem
									//console.log(['loadSearchItems LOCAL SET ITEM',thisItem])	
									localForageItems.setItem(thisItem._id,cleanItem(thisItem)).then(function() {
										//addToLocalIndexes(thisItem)
									})
								}
							 })
							 //console.log(['collated list start',new Date().getTime() - start])
							 collateFinalList(ids,loadedItemsIndex,skipCheckForUpdates,callback, limit, skip).then(function() {
								resolve()
							 })
							 //.then(function(finalList) {
								//console.log(['collated list',new Date().getTime() - start])
								//if (stopWaiting) stopWaiting()
								//callback(finalList) 
							 //})
						 }
					 })
				 } else {
						//console.log(['loadSearchItems none missing'])	
					//console.log(['collated list start',new Date().getTime() - start])
					collateFinalList(ids,{},skipCheckForUpdates,callback, limit, skip).then(function() {
						resolve()
					 })
					//.then(function() {
							//setItemCount( items.length  + 1) //(hasNextPage ? 3 : 0))
					 //})
					//.then(function(finalList) {
						 //console.log(['collated list none missing',new Date().getTime() - start])
						//if (stopWaiting) stopWaiting()
						//callback(finalList) 
					//})
				 }
			 }).catch(function(err) {
				if (stopWaiting) stopWaiting()
				console.log(err);
			 });
			
		})
			
	}
    
  
	function searchItemsNow(filter, callback, limit=20000, skip=0, isort = null) {
		//console.log(['searchItemsNow', modelType, filter, restUrl]) 
        if (startWaiting) startWaiting()
		dispatch({type:'replaceall', items: []})
		const {localForageSearches} = initLocalForage(modelType)
		//return new Promise(function(resolve,reject) {
		var queryParts=[
			'query='+encodeURIComponent(JSON.stringify(filter)),
			'limit='+limit,
			'skip='+skip,
			'select=_id'
		]
		//if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
		var useSort=isort ? isort : (sort ? sort : null)
		if (useSort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(useSort)))
		
		searchItemIds(filter, limit, skip, useSort).then(function(searchResult) {
			//console.log(['LOAD NOW primary SEARCH RESULT FROM ONLINE',searchResult])
			localForageSearches.setItem(queryParts.join("&"),searchResult)
			loadSearchItems(searchResult,callback,false,limit,skip).then(function() {
					setItemCount( items.length   + 1)
			})
		})
	}
  
    function searchItems(filter, callback, limit=20000, skip=0, isort = null) {
        //console.log(['searchItems', limit,skip, isort, modelType, JSON.stringify(filter), restUrl]) 
        const {localForageSearches} = initLocalForage(modelType)
		if (startWaiting) startWaiting()
		//return new Promise(function(resolve,reject) {
		var queryParts=[
			'query='+encodeURIComponent(JSON.stringify(filter)),
			'limit='+limit,
			'skip='+skip,
			'select=_id'
		]
		//if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
		var useSort=isort ? isort : (sort ? sort : null)
		//console.log(['param',JSON.stringify(isort),'state',JSON.stringify(sort),'use',JSON.stringify(useSort)])
		if (useSort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(useSort)))
		//console.log(['QUERYKEY',JSON.stringify(queryParts),'ppp'])
		
		localForageSearches.getItem(queryParts.join("&")).then(function(searchResult) {
			// from cached search result
			//console.log(['LOAD SEARCH RESULT FROM CACHE'])
			if (searchResult && Array.isArray(searchResult)) {
				//console.log(['LOAD SEARCH RESULT FROM CACHE',searchResult,searchResult[0]])
				// skip refresh of each item
				loadSearchItems(searchResult,callback,false,limit,skip).then(function() {
						setItemCount( items.length   + 1) //+ (hasNextPage ? 3 : 0))
					})
				//setItemCount(searchResult.length + (hasNextPage ? 3 : 0))
					
				// check for updated search results
				if (autoRefresh) {
					searchItemIds(filter, limit, skip, useSort).then(function(isearchResult) {
						//console.log(['LOAD SEARCH RESULT FROM ONLINE',isearchResult,isearchResult[0]])
						if (JSON.stringify(searchResult) !== JSON.stringify(isearchResult)) {
							//console.log(['LOAD SEARCH RESULT FROM ONLINE use updates',isearchResult,isearchResult[0]])
						
							localForageSearches.setItem(queryParts.join("&"),isearchResult)
							loadSearchItems(isearchResult,callback,!autoRefresh,limit,skip).then(function() {
								setItemCount( items.length   + 1) //+ (hasNextPage ? 3 : 0))
							})
						} else {
							//console.log(['LOAD SEARCH RESULT FROM ONLINE no updates',isearchResult,isearchResult[0]])
						
						}
						//.then(function(items) {
							//callback(items)
						//})
					})
				}
				
				//.then(function(items) {
					//callback(items)
				//})
			// search online
			} else {
				//console.log(['LOAD primary SEARCH RESULT FROM ONLINE',filter, limit, skip, useSort])
				searchItemIds(filter, limit, skip, useSort).then(function(searchResult) {
					//console.log(['LOAD primary SEARCH RESULT FROM ONLINE',searchResult,searchResult[0]])
					localForageSearches.setItem(queryParts.join("&"),searchResult)
					if (searchResult && searchResult.length > 0) setHasNextPage(true)
					else setHasNextPage(false)
					loadSearchItems(searchResult,callback,false,limit,skip).then(function() {
						setItemCount( items.length   + 1) //+ (hasNextPage ? 3 : 0))
					})
					
					//.then(function(items) {
						//callback(items)
					//})
				})
			}
		}).catch(function(e) {
			//console.log('get search res err')
			console.log(e)
		})
		
    }
    
    //const itemCount = items.length + (hasNextPage ? 100 : 0);

	var isNextPageLoading = false

	  
	// Every row is loaded except for our loading indicator row.
	//const isItemLoaded = index => !hasNextPage || index < items.length;
	const isItemLoaded = index => items[index] && items[index]._id;
	
	function loadMoreItems(startIndex, stopIndex)  {
		//console.log(['loadMores',startIndex, stopIndex, 'ISLOADING',isNextPageLoading,'HASNEXTPAGE' , hasNextPage])
		if (!isNextPageLoading && hasNextPage) { //) {
			//console.log('loadMore real')
		    isNextPageLoading = true
			
		  //for (let index = startIndex; index <= stopIndex; index++) {
			//itemStatusMap[index] = LOADING;
		  //}
		  return new Promise(resolve => {
			  
				searchItems(getSearchFilter(categorySearchFilter,searchFilter),function(loadedItems) {
				  setItemCount( stopIndex  + (minimumBatchSize ? minimumBatchSize : 1))
				  //for (let index = startIndex; index <= stopIndex; index++) {
					//itemStatusMap[index] = LOADED;
				  //}
				  isNextPageLoading = false
				  //if (loadedItems && loadedItems.length > 0) setHasNextPage(true)
				  //else setHasNextPage(false)
				  //console.log(['loaded more ',loadedItems.length])
				  resolve();
				},(stopIndex - startIndex + 1), startIndex)
			
		  });
	   }
	};
	
	function setItems(items) {
		dispatch({type:'replaceall', items: items})
	}
    
    return {saveField, saveItemNow,saveItemLocal, searchItemsNow, deleteItem, getItem, searchItems, items, saveItem, saveQueue, searchFilter,setSearchFilter,categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, isItemLoaded, itemCount, setItemCount, sort, setSort, setItems, dispatch, hasNextPage, setHasNextPage, refreshItem, loadSearchItems, localForages, getFirstItemFromIndexValues, getItemsFromIndexValues, getIndexValues, addToLocalIndexes, removeFromLocalIndexes, setLocalIndex, collatedItems}
    
}
