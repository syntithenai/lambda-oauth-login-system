export default function useRestEndpoint(axiosClient,restUrl=process.env.REACT_APP_restBaseUrl) {
   
   console.log(['useresturl',restUrl])
   
    // to  endpoint root
    function doPost(modelType,data) {
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
    function doPut(modelType,data) {
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
    function doPatch(modelType, data) {
        console.log(['PATCH', modelType, data, restUrl]) 
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
    
    function saveItem(modelType, data, patch=true) {
		console.log(['save',modelType, data, patch])
		return new Promise(function(resolve,reject) {
			if (data._id && data._id.trim && data._id.trim())  {
				if (patch) {
					return doPatch(modelType,data).then(function(res) {
					  resolve(res)  
					})
				} else {
					return doPut(modelType,data).then(function(res) {
					  resolve(res)  
					})
				}
			} else {
				delete data._id 
				return doPost(modelType,data).then(function(res) {
				  resolve(res)  
				})
			}
		})
    }
    
	function deleteItem(modelType,id) {
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
                  resolve(res)
                }).catch(function(res) {
                  reject({error: 'Invalid request error'})
                })
            } else {
                 reject({error: 'Invalid request'})
            }
        })
    }
    
	function getItem(modelType,id) {
        //console.log(['GET', modelType, id, restUrl]) 
        return new Promise(function(resolve,reject) {
            if (id) {
                axiosClient.get(restUrl+modelType+"/"+id,
                  {
                   
                  },
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
    
  
    function searchItems(modelType,filter, limit=20, skip=0, sort='', populate=null) {
        //console.log(['GETMANY', modelType, filter, restUrl]) 
        return new Promise(function(resolve,reject) {
            var queryParts=[
                'query='+encodeURIComponent(JSON.stringify(filter)),
                'limit='+limit,
                'skip='+skip,
                
            ]
            if (populate) queryParts.push('populate='+encodeURIComponent(JSON.stringify(populate)))
            if (sort) queryParts.push('sort='+encodeURIComponent(JSON.stringify(sort)))
            axiosClient.get(restUrl+modelType+'?'+queryParts.join("&"),
              {
               
              },
              {
                headers: {
                    'Content-Type': 'application/json'
                  },
              }
            ).then(function(res) {
              //console.log(['GET many',res])  
              resolve(res)
            }).catch(function(res) {
              //console.log(res)  
              reject({error: 'Invalid request error'})
            })
        })
    }
    
    return {saveItem, deleteItem, getItem, searchItems}
    
}
