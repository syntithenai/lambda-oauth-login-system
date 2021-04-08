//var uuidv4 = require('uuidv4');
var aws = require('aws-sdk');
const {generateObjectId, decodeFromBase64} = require('./utils')

//const Base64Binary = require('./base64-binary') 

//aws.config.update({
    //accessKeyId: 'dfsdd',
    //secretAccessKey: 'oXRjsdfaddddddNgGHmDj0'
//});

const s3 = new aws.S3({});
//const pngPrefix = 'data:image/jpeg;base64,';
//const jpgPrefix = 'data:image/png;base64,';


 var corsParams = {
  Bucket: "", 
  CORSConfiguration: {
   CORSRules: [
      {
     AllowedHeaders: [
        "*"
     ], 
     AllowedMethods: [
        "PUT", 
        "POST", 
        "DELETE"
     ], 
     AllowedOrigins: [
        "*", //"http://www.example.com"
     ], 
     ExposeHeaders: [
        "x-amz-server-side-encryption"
     ], 
     MaxAgeSeconds: 3000
    }, 
      {
     AllowedHeaders: [
        "Authorization"
     ], 
     AllowedMethods: [
        "GET"
     ], 
     AllowedOrigins: [
        "*"
     ], 
     MaxAgeSeconds: 3000
    }
   ]
  }, 
  ContentMD5: ""
 };
 

function createBucket(bucket, acl = 'public-read', cors= null) {
	//console.log(['CREATEBUCKET',bucket])
	return new Promise(function(resolve,reject) {
		s3.createBucket({
			Bucket: bucket, 
			ACL: acl
		}, function(err, data) {
			if (err) {
				console.log(err) //, err.stack); // an error occurred
				reject(err)
			} else {
				s3.putBucketCors(Object.assign({},(cors ? cors : corsParams),{Bucket: bucket}), function(err, data) {
					if (err) {
						//console.log(err) //, err.stack); // an error occurred
						reject(err)
					} else {
						//console.log(data);           // successful response
						resolve()
					}
				});
			}
		});	
	})
}



function ensureBucket(bucket, acl, cors) {
	//console.log(['ENSUREBUCKET',bucket])
	return new Promise(function(resolve,reject) {
		s3.headBucket({Bucket: bucket}, function(err, data) {
				if (err ) {
					//console.log('err on head');
					//console.log(err) //, err.stack); // an error occurred
					createBucket(bucket, acl, cors).then(function() {
						s3.listObjectsV2({Bucket: bucket},function(err,data) {
							if (err) {
								//console.log(err) //,err.stack)
								reject(err)
							} else {
								resolve(data)
							}
						})
					})
				} else if (!data) {
					//console.log('no data'); // an error occurred
					createBucket(bucket, acl, cors).then(function() {
						s3.listObjectsV2({Bucket: bucket},function(err,data) {
							if (err) {
								//console.log(err) //,err.stack)
								reject(err)
							} else {
								resolve(data)
							}
						})
					})
					
				} else {
					//console.log('found bucket');
					//console.log(data);           // successful response	
					s3.listObjectsV2({Bucket: bucket},function(err,data) {
						if (err) {
							//console.log(err) //,err.stack)
							reject(err)
						} else {
							resolve(data)
						}
					})
				}
			//});
			
		});
	})
}

function deleteBucket(bucket) {
	//console.log(' DELETE bucket '+bucket)
	return new Promise(function(resolve,reject) {
		s3.headBucket({Bucket: bucket}, function(err, data) {
			//console.log([' DELETEing bucket ',data,err])	
			if (!err && data) {
				//console.log([' DELETEing bucket get list '])	
				s3.listObjects({Bucket: bucket}, function(err, data) {
					if (err) {
						//console.log(err); // an error occurred
						resolve() 
					} else {
						var list = data && Array.isArray(data.Contents) ? data.Contents.map(function(c) { return {Key: c.Key} }) : []
						//console.log(['swl ob',data]);           // successful response

						function doDeleteBucket(bucket) {
							if (data ) {
								s3.deleteBucket({Bucket: bucket},function(err,data) {
									if (err) {
										//console.log(err) //, err.stack);
										resolve()
									} else {
										//console.log('really deleted', data);
										resolve()
									}
								})
							} else {
								resolve()
							}
						}
						
						if (list.length > 0) {
							s3.deleteObjects({Bucket: bucket, Delete: { Objects: list }}, function(err, data) {
										
								if (err) {
									//console.log(err) //, err.stack);
									resolve()
								} else {
									doDeleteBucket(bucket)
								}
							})
						} else {
							doDeleteBucket(bucket)
						}
					}
				})
			} else {
				resolve()
			}
		})
	})
}


function saveFile(media, key, bucket) {
	return new Promise(function(resolve,reject) {
		//console.log('savefile')
		//console.log([key,bucket,media && media.base64 ?  media.base64.length : -1])
		if (media && media.base64) {
			
			 var params = {
				  Body: decodeFromBase64(media.base64), 
				  Bucket: bucket, 
				  Key: key,
				  ACL: "public-read", 
				  ContentType: media.mime ? media.mime : null
			 };
			 s3.putObject(params, function(err, data) {
			   if (err) {
				   console.log(err, err.stack); // an error occurred
				   reject()
				} else {
					media.uploadedUrl= 'https://' + bucket+'.s3.amazonaws.com/'+key
					media.base64=null
					media.href = 'https://' + bucket+'.s3.amazonaws.com/'+key
					//console.log('doneput')
					//console.log([data, media.uploadedUrl])
					resolve(media)
				}
			 });
		} else {
			//console.log('skipput')
			resolve(media)
		}
		
		
		
																
		
	})
}

function deleteFile(bucket,key) {
	//console.log('delfile')
	return new Promise(function(resolve,reject) {
		var params = {
			Bucket: bucket, 
			Key: key
		};
		s3.deleteObject(params, function(err, data) {
			if (err) {
				//console.log(err, err.stack); 
				reject()
			} else {
				//console.log(data);
				resolve()
			}
		});
	})
}

function extractMediaField(field,item, bucket) {
	return new Promise(function(resolve,reject) {
		var promises = []
		item[field].map(function(media,mediaKey) {
			console.log(['extract media',media.base64 ? media.base64.length : -1])
			if (media && media.base64) {
				promises.push(new Promise(function(iresolve,ireject) {
					saveFile(media,field+'-'+media.id,bucket).then(function(media) {
						// upload file into folder /media/{item._id}/{field}/{id}.{fileext}
						iresolve(media)
					})
				}))
			} else {
				promises.push(new Promise(function(iresolve,ireject) {
					iresolve(media)
				}))
			}
		})
		Promise.all(promises).then(function(mediaList) {
			
			resolve({field: field, value: mediaList})
		})
	})
}


// if there is base64 data, extract and save media to aws s3 then delete base64 data and update url 
function extractMediaFields(fields,item,bucketPrefix) {
	return new Promise(function(resolve,reject) {
		//console.log(['AAA extract media',item._id])
		var bucket = bucketPrefix + new String(item._id)
		var promises = []
		var delpromises = []
		if (Array.isArray(fields) && fields.length > 0) {
			// first check if need s3
			var mediaFieldIsUpdated = false
			fields.forEach(function(field) {
				if (Array.isArray(item[field])) {
					mediaFieldIsUpdated = true
				}
			})
			if (mediaFieldIsUpdated) { 
				ensureBucket(bucket).then(function(bucketList) {
					//console.log('bucketList')
					//console.log(bucketList)
					var contents = Array.isArray(bucketList.Contents) ? bucketList.Contents : []
					var contentsIndex = {}
					contents = contents.map(function(iitem) {
						//console.log(item)
						contentsIndex[iitem.Key] = iitem
					})
					//console.log('contents')
					//console.log(JSON.stringify(contentsIndex))
					var fieldKeys = {}
					fields.map(function(field) {
						//console.log(['extract media',field, item[field].length])
						
						if (Array.isArray(item[field])) {
							// ensure ids and collate keys
							item[field] = item[field].map(function(media) {
								if (!media.id) media.id = generateObjectId() 
								fieldKeys[field+'-'+media.id] = 1
								return media
							})
							promises.push(extractMediaField(field,item, bucket))
							//.then(function(mediaList) {
								//item[field] = mediaList
								//mediaList.forEach(function(media) {
									//fieldKeys[field+'-'+media.id] = 1
								//})
							//})
						}
					})
					//console.log('FK')
					//console.log(JSON.stringify(fieldKeys))
					Object.keys(contentsIndex).map(function(contentKey) {
						if (!fieldKeys.hasOwnProperty(contentKey)) {
							delpromises.push(new Promise(function(iresolve,ireject) {
								deleteFile(bucket,contentKey).then(function() {
									iresolve()
								})
								
							}))
						} 
					})
					Promise.all(delpromises).then(function(deleted) {
						
						Promise.all(promises).then(function(saved) {
							// cleanup by iterating all files in folder and deleting those that are not ids in the list field
							saved.map(function(iitem) {
								item[iitem.field] = iitem.value
								//console.log(['DONE extracted media',JSON.stringify(iitem)])
							})
							//if (item) console.log(['FINAL',item._id,JSON.stringify(item.image)])
							//else console.log('no item')
							resolve(item)
						})
					})
				})
			} else {
				resolve(item)
			}
		}
		
	})
}

module.exports = {extractMediaFields, deleteBucket}
