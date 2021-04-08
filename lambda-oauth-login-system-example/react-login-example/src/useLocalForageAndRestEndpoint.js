import {useReducer, useState} from 'react';

const localForage = require('localforage')
const reducer = require('./reducer')
			
export default function useLocalForageAndRestEndpoint(options) {
   //console.log('new localforagerestendoint')
    const {axiosClient,restUrl,autoSaveDelay,startWaiting,stopWaiting,onItemQueued,onStartSaveQueue,onFinishSaveQueue, modelType, populate, useCategorySearch} = options
	var localForages = {}
	const [items, dispatch] = useReducer(reducer,[]);
	//const [autoSaveTimeoutTimeout, setAutoSaveTimeoutTimeout] = useState(null)
	//const [queueActive,setQueueActive] = useState(false)
	const [searchFilter,setSearchFilterI] = useState(localStorage ? localStorage.getItem(modelType + 'SearchFilter') : '')
	const [categorySearchFilter,setCategorySearchFilterI] = useState(localStorage ? localStorage.getItem(modelType + 'CategorySearchFilter') : '')
	const [sort,setSort] = useState({'_id': -1})
	
	function setCategorySearchFilter(value) {
		setCategorySearchFilterI(value)
		if (localStorage) localStorage.setItem(modelType + 'CategorySearchFilter',value)
	}

	function setSearchFilter(value) {
		setSearchFilterI(value)
		if (localStorage) localStorage.setItem(modelType + 'SearchFilter',value)
	}

	const [hasNextPage,setHasNextPage] = useState(true)
	const [itemCount,setItemCount] = useState(0)
	
	function initLocalForage(collection='default') {
		if (!Array.isArray(localForages[collection])) {
			var localForageItems = localForage.createInstance({name:modelType,storeName:'items'});
			var localForageSearches = localForage.createInstance({name:modelType,storeName:'searches'});
			var localForagePatches = localForage.createInstance({name:modelType,storeName:'patches'});
			localForages[collection] = {localForageItems, localForageSearches, localForagePatches}
		}
		return localForages[collection]
	}
   
    function getSearchFilter(categorySearchFilter,searchFilter) {
		var filter = {}
		if (useCategorySearch && categorySearchFilter) {
			if (searchFilter) {
				var catfilter = {}
				catfilter[useCategorySearch] = categorySearchFilter
				filter = {"$and":[{"$text":{"$search":searchFilter}},catfilter]}
			} else {
				filter = {}
				filter[useCategorySearch] = categorySearchFilter
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
    
    function saveField(field, value, item, key, delay) {
		return new Promise(function (resolve,reject) {
			console.log(['savefield',field, value, item, key, delay])
			if (modelType && field && item && item._id) {
				var data = {_id:item._id}
				data[field] = value
				saveItem(data,key, delay).then(function(newItem) {
					resolve(newItem)
				})
			} else {
				resolve(Object.assign({},item,data))
			}
		})
	} 
    
    function saveItem(data, key=-1, delay=0) {
		const {localForageItems, localForagePatches} = initLocalForage(modelType)
		//if (startWaiting) startWaiting()
		console.log(['save',modelType, data])
		//if (autoSaveTimeoutTimeout) clearTimeout(autoSaveTimeoutTimeout)
		if (key >= 0) {
			console.log(['merge',key])
			dispatch({type:'merge',index:key,item:data})
		}							
		return new Promise(function(resolve,reject) {
			if (data && data._id)  {
				
			
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
							

							localForageItems.setItem(data._id,item).then(function() {
								//console.log(['saved item',autoSaveDelay])
								var d = delay > 0 ? delay : (autoSaveDelay > 0 ? autoSaveDelay : 0)
								if (d > 0) {
									//console.log(['timeout ?',window.autoSaveTimeoutTimeout])
									if (window.autoSaveTimeoutTimeout) clearTimeout(window.autoSaveTimeoutTimeout)
									//setQueueActive(true)
									window.autoSaveTimeoutTimeout = setTimeout(function() {
										//console.log('AAAautosave')
										saveQueue().then(function() {
											//console.log('saveQ done')
											//setQueueActive(false)
										})
									},autoSaveDelay)
								}
								resolve(data)
							})
							
						})
						//resolve(data)
					})
					
				})
			} else {
				delete data._id 
				// new records need to be saved directly to db to create _id
				return doPost(data).then(function(res) {
					//console.log(['post',res])
					if (res && res.data && res.data._id) {
						//console.log(['patch do locasl'])
						localForageItems.setItem(res.data._id,res.data).then(function(value) {
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
		console.log('dosaveQ')
		const {localForagePatches} = initLocalForage(modelType)
		if (onStartSaveQueue) onStartSaveQueue() 
		return new Promise(function(resolve,reject) {
			localForagePatches.keys().then(function(patchKeys) {
				if (patchKeys && Array.isArray(patchKeys))  {
					var promises = []
					patchKeys.forEach(function(patchKey) {
						promises.push(localForagePatches.getItem(patchKey))
					})
					Promise.all(promises).then(function(data) {
						var urlParts = restUrl.split("/rest/api/")
						var url = urlParts[0] + "/rest/bulk/"
						//console.log(['RURL',url])
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
									console.log('cleared patches') 
									if (onFinishSaveQueue) onFinishSaveQueue() 
									resolve(res.data)
								})
							} else {
								if (onFinishSaveQueue) onFinishSaveQueue() 
								resolve({})
							}
						  //console.log(res)
						}).catch(function(res) {
						  console.log(res)
						  if (onFinishSaveQueue) onFinishSaveQueue() 
						  resolve({})
						})					
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
							localForageItems.setItem(res.data._id,res.data).then(function(value) {
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
							localForageItems.setItem(res.data._id,res.data).then(function(value) {
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
						localForageItems.setItem(res.data._id,res.data).then(function(value) {
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
    
    
    
    
	function deleteItem(id, key = -1) {
		const {localForageItems} = initLocalForage(modelType)
		if (startWaiting) startWaiting()
        
        if (key >= 0) {
			dispatch({type:'remove',index:key})
		}
        //console.log(['DELETE', modelType, id, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (id && id.trim()) {
                return axiosClient.delete(restUrl+modelType+"/"+id,
                  {
                  },
                  {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  }
                ).then(function(res) {
					localForageItems.removeItem(id).then(function(value) {
						if (key >= 0) {
							dispatch({type:'remove',index:key})
						}
					})
					if (stopWaiting) stopWaiting()
                    resolve(res)
                }).catch(function(res) {
					localForageItems.removeItem(id).then(function(value) {
						
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
    
	function getItem(id, callback) {
        //console.log(['GET', modelType, id, restUrl]) 
        const {localForageItems} = initLocalForage(modelType)
        if (startWaiting) startWaiting()
        //return new Promise(function(resolve,reject) {
            if (id) {
				// try for local first
				localForageItems.getItem(id).then(function(value) {
					if (value) {
						if (stopWaiting) stopWaiting()
						if (callback) callback(value)
						// now check online for update  
						//console.log('check online update')
						axiosClient.get(restUrl+modelType+'/?query='+encodeURIComponent(JSON.stringify({"$and":[{"_id":id},{"updated_date":{"$gt":value.updated_date}}]}))+'&select=id,updated_date',
						  {},{
							headers: {
								'Content-Type': 'application/json'
							  },
						  }
						).then(function(res) {
							if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
								//console.log(['check online update res ',res.data])
								localForageItems.setItem(id,res.data[0]).then(function(value) {
									if (callback) callback(res.data)
								})
							} 
						}).catch(function(res) {
						  //reject({error:'Invalid request error'})
						})
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
								localForageItems.setItem(id,res.data).then(function(value) {
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
    
    
    function searchItemIds(filter, limit=20, skip=0) {
		//console.log(['searchItemIds',modelType,filter])	
		 return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify(filter)),
                'limit='+limit,
                'skip='+skip,
                'select=_id'
            ]
            if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
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

	function searchItemIdsWithDate(filter, limit=20, skip=0) {
		//console.log(['searchItemIds',modelType,filter])	
		 return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify(filter)),
                'limit='+limit,
                'skip='+skip,
                'select=_id,updated_date'
            ]
            if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
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
				//setItemCount(res.data.length + (hasNextPage ? 1 : 0))
				resolve(res.data.map(function(item) {
					 return item._id
				 }))
			  } else {
				  resolve([])
			  }
    		}).catch(function(res) {
              //console.log(res)  
              reject({error: 'Invalid request error'})
            })
        })
	}
	
	function loadItemsByIds(idsArray) {
		//console.log(['loadItemsByIds',modelType,idsArray,populate])	
		return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify({_id: {"$in": idsArray}})),
            ]
            // ?? TODO if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
            axiosClient.get(restUrl+modelType+'?'+queryParts.join("&"),
              {},{
                headers: {
                    'Content-Type': 'application/json'
                  },
              }
            ).then(function(res) {
              //console.log(['GET many',res])  
              if (res && res.data && Array.isArray(res.data)) { 	
				resolve(res.data)
			  } else {
				  resolve([])
			  }
    		}).catch(function(res) {
              //console.log(res)  
              reject({error: 'Invalid request error'})
            })
        })
	}
	
	function loadUpdatedItems(idsAndUpdatedDate) {
		//console.log(['loadItemsByIds',modelType,idsAndUpdatedDate])	
		return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify({$or: idsAndUpdatedDate})),
            ]
            //console.log(queryParts)
            // ?? TODO if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
            axiosClient.get(restUrl+modelType+'?'+queryParts.join("&"),
              {},{
                headers: {
                    'Content-Type': 'application/json'
                  },
              }
            ).then(function(res) {
              //console.log(['GET many',res])  
              if (res && res.data && Array.isArray(res.data)) { 	
				resolve(res.data)
			  } else {
				  resolve([])
			  }
    		}).catch(function(res) {
              //console.log(res)  
              reject({error: 'Invalid request error'})
            })
        })
	}
	
	
	function collateFinalList(ids,loadedItemsIndex,skipCheckForUpdates,callback) {
		//var start = new Date().getTime()
		const {localForageItems} = initLocalForage(modelType)
		//console.log(['COLLATEFINALLIST',modelType,ids,loadedItemsIndex])	
		return new Promise(function(resolve,reject) {
			// async load all localstorage items
			var promises = []
			//console.log(['collateFinal start',new Date().getTime() - start])
			ids.map(function(id) {
				if (id && !loadedItemsIndex.hasOwnProperty(id)) promises.push(localForageItems.getItem(id))
				return null
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
				//console.log(['COLLATEFINALLIST IS',finalList])	
				dispatch({type:'replaceall',items:finalList})
				if (callback) callback(finalList)
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
							if (!skipCheckForUpdates) updateCheck.push({'$and':[{_id:localItem._id},{"updated_date":{'$gt':localItem.updated_date > 0 ? localItem.updated_date : 0}}]})
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
							//console.log(['collateFinal done update',new Date().getTime() - start])
							if (results && Array.isArray(results))  {
								// update the loadedItemsIndex to include updated records
								results.forEach(function(result) {
									if (result && result._id) loadedItemsIndex[result._id] = result
									localForageItems.setItem(result._id,result) // don't wait
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
	
	
	function loadSearchItems(ids,callback, skipCheckForUpdates) {
		var start = new Date().getTime()
		console.log(['loadSearchItems',modelType,ids,start])	
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
									localForageItems.setItem(thisItem._id,thisItem)
								}
							 })
							 //console.log(['collated list start',new Date().getTime() - start])
							 collateFinalList(ids,loadedItemsIndex,skipCheckForUpdates,callback)
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
					collateFinalList(ids,{},skipCheckForUpdates,callback)
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
			
		//})
		
	}
    
  
	function searchItemsNow(filter, callback, limit=20, skip=0) {
		console.log(['searchItemsNow', modelType, filter, restUrl]) 
        if (startWaiting) startWaiting()
		const {localForageSearches} = initLocalForage(modelType)
		//return new Promise(function(resolve,reject) {
		var queryParts=[
			'query='+encodeURIComponent(JSON.stringify(filter)),
			'limit='+limit,
			'skip='+skip,
			'select=_id'
		]
		if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
		if (sort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(sort)))
		
		searchItemIds(filter, limit, skip).then(function(searchResult) {
			console.log(['LOAD NOW primary SEARCH RESULT FROM ONLINE',searchResult])
			localForageSearches.setItem(queryParts.join("&"),searchResult)
			setItemCount(searchResult.length + (hasNextPage ? 1 : 0))
			loadSearchItems(searchResult,callback)
		})
	}
  
    function searchItems(filter, callback, limit=20, skip=0) {
        console.log(['searchItems', modelType, filter, restUrl]) 
        const {localForageSearches} = initLocalForage(modelType)
		if (startWaiting) startWaiting()
		//return new Promise(function(resolve,reject) {
		var queryParts=[
			'query='+encodeURIComponent(JSON.stringify(filter)),
			'limit='+limit,
			'skip='+skip,
			'select=_id'
		]
		if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
		if (sort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(sort)))
		localForageSearches.getItem(queryParts.join("&")).then(function(searchResult) {
			// from cached search result
			if (searchResult && Array.isArray(searchResult)) {
				console.log(['LOAD SEARCH RESULT FROM CACHE',searchResult])
				loadSearchItems(searchResult,callback,true)
				setItemCount(searchResult.length + (hasNextPage ? 1 : 0))
					
				// check for updated search results
				searchItemIdsWithDate(filter, limit, skip).then(function(isearchResult) {
					console.log(['LOAD SEARCH RESULT FROM ONLINE',isearchResult])
					if (JSON.stringify(searchResult) !== JSON.stringify(isearchResult)) {
						localForageSearches.setItem(queryParts.join("&"),isearchResult)
						setItemCount(isearchResult.length + (hasNextPage ? 1 : 0))
						loadSearchItems(isearchResult,callback)
					}
					//.then(function(items) {
						//callback(items)
					//})
				})
				
				
				//.then(function(items) {
					//callback(items)
				//})
			// search online
			} else {
				searchItemIds(filter, limit, skip).then(function(searchResult) {
					console.log(['LOAD primary SEARCH RESULT FROM ONLINE',searchResult])
					localForageSearches.setItem(queryParts.join("&"),searchResult)
					setItemCount(searchResult.length + (hasNextPage ? 1 : 0))
					loadSearchItems(searchResult,callback)
					
					//.then(function(items) {
						//callback(items)
					//})
				})
			}
		})
		
    }
    
    //const itemCount = items.length + (hasNextPage ? 100 : 0);

	var isNextPageLoading = false

	  
	// Every row is loaded except for our loading indicator row.
	//const isItemLoaded = index => !hasNextPage || index < items.length;
	const isItemLoaded = index => items[index] && items[index]._id;
	
	function loadMoreItems(startIndex, stopIndex)  {
		console.log('loadMore')
		if (!isNextPageLoading && hasNextPage) {
			console.log('loadMore real')
		    isNextPageLoading = true
			
		  //for (let index = startIndex; index <= stopIndex; index++) {
			//itemStatusMap[index] = LOADING;
		  //}
		  return new Promise(resolve => {
			  
				searchItems(getSearchFilter(categorySearchFilter,searchFilter),function(loadedItems) {
				  //for (let index = startIndex; index <= stopIndex; index++) {
					//itemStatusMap[index] = LOADED;
				  //}
				  isNextPageLoading = false
				  if (items && items.length > 0) setHasNextPage(true)
				  else setHasNextPage(false)
				  var newCollatedItems = Array(stopIndex)
				  items.forEach(function(item,key) {
					  newCollatedItems[key] = item
				  })
				  loadedItems.map(function(item,k) {
					  newCollatedItems[startIndex + k] = item
				  })
				  //setItems(newCollatedItems)
				  setItemCount(newCollatedItems.length + (hasNextPage ? 15 : 0))
				  dispatch({type:"replaceall",items: newCollatedItems})
				  resolve();
				},stopIndex - startIndex + 1, startIndex)
			
		  });
	   }
	};
	
	
    
    return {saveField, saveItemNow, searchItemsNow, deleteItem, getItem, searchItems, items, saveItem, saveQueue, searchFilter,setSearchFilter,categorySearchFilter,setCategorySearchFilter, getSearchFilter, loadMoreItems, isItemLoaded, itemCount, sort, setSort}
    
}