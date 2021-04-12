//db.questions.updateMany(
    //{$and:[{"interrogative":{"$ne":null}}, {"interrogative":{"$ne":''}},{"question":{"$ne":null}}, {"question":{"$ne":''}}]},
    //[
        //{"$set": {"q2": { "$concat": ["$interrogative", " ", "$question"]}}}
    //]
//)

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const fs = require('fs')
var cors = require('cors')
const userFromAuthHeaders = require('./userFromAuthHeaders')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const loginSystem = require('express-oauth-login-system-server')
const path = require('path')
require('dotenv').config()

//let config = require('./authconfig');
//console.log(config)
const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(methodOverride())
//console.log(process.env)
// disable ssl checks for localhost
if (process.env.IS_OFFLINE === 'true') {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const {getLoginGatewayUrl,getGatewayUrl} = require('./utils')

mongoose.connect(process.env.databaseConnection, {useNewUrlParser: true}) 

mongoose.connection.on('connected', () => {
  process.nextTick(() => {
	console.log('Mongoose connected for demo app');
	
  });
});
mongoose.connection.on('error', (e) => {
  process.nextTick(() => {
	console.log(['Mongoose demo app ERR',e]);
  });
}); 


			
function indexTopic(topic) {
	//console.log(['index topic',topic])
	return new Promise(function(resolve,reject) {
		if (topic) {
			//console.log(['index topic',topic])
			const TopicsModel = mongoose.model('topics', topicsSchema);
			TopicsModel.find({ topic: topic}, function (err, docs) {
				if (err){
					console.log(err);
					resolve()
				}
				else{
					//console.log("Found topics : ", docs);
					if (docs && docs.length > 0) {
						resolve()
					} else {
						TopicsModel.create({ topic: topic }, function (err, small) {
						  if (err) {
							  console.log(err);
							  resolve()
						  } else {
							  //console.log("Saved new topic : ", topic);
							  resolve()
						  }
						  
						});
					}
					//console.log("First function call : ", docs);
				}
			});
		} else {
			resolve()
		}
	})
}

// index tags
function indexTags(tags) {
	//console.log(['index tags',tags])
	return new Promise(function(resolve,reject) {
		var promises = []
			
		if (Array.isArray(tags)) {
			//console.log(['index tags',tags])
			const TagsModel = mongoose.model('tags', tagsSchema);
			tags.forEach(function(tag) {
				promises.push(new Promise(function(iresolve,ireject) {
					TagsModel.find({ title: tag}, function (err, docs) {
						if (err){
							console.log(err);
							iresolve()
						} else {
							//console.log("Found tags : ", docs);
							if (docs && docs.length > 0) {
								iresolve()
							} else {
								TagsModel.create({ title: tag }, function (err, data) {
								  if (err) {
									  console.log(err);
									  iresolve()
								  } else {
									  //console.log("Saved new tag : ", req.body.quiz);
									  iresolve()
								  }
								  
								});
							}
							//console.log("First function call : ", docs);
						}
					})
				}))
			})
			Promise.all(promises).then(function() {
				resolve()
			})
		} else {
			resolve()
		}
		
	})
}




var template = '' 
const restifyOptions = require('./restifyOptions')    
const {questionsSchema, topicsSchema, tagsSchema, mnemonicsSchema, multipleChoiceQuestionsSchema, commentsSchema} = require('./schema')
var restifyRouter = express.Router();
const {extractMediaFields, deleteBucket} = require('./extractMediaFields')

//// if there is base64 data, extract and save media to file system then delete base64 data and update url 
//function deleteMediaFields(fields,item) {
	//if (Array.isArray(fields)) {
		//fields.map(function(field) {
			//if (item && item.hasOwnProperty(field) && typeof item[field] === "object" && item[field].uploadedUrl) {
				//item[field].autoshow_image = "no"
				//item[field].uploadedUrl=item[field].base64 = null
				//console.log(['delete media',item[field].uploadedUrl])
			//}
		//})
	//}
//}

// extract base64 to filesystem to minimise database size
// used by preSave and bulkSave
const mediaFields = {questions: ['image','media']}
const bucketPrefix = 'mnemo-'
const Mnemonics = mongoose.model('mnemonics',mnemonicsSchema )
const Questions = mongoose.model('questions',questionsSchema )
const Tags = mongoose.model('tags',tagsSchema )
const Topics = mongoose.model('topics',topicsSchema )
const MultipleChoiceQuestions = mongoose.model('multipleChoiceQuestions',multipleChoiceQuestionsSchema )
const Comments = mongoose.model('comments',commentsSchema )
questionsSchema.virtual('mnemonics', {
  ref: 'mnemonics', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'question', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});
questionsSchema.virtual('comments', {
  ref: 'comments', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'question', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});
questionsSchema.virtual('multipleChoiceQuestions', {
  ref: 'multipleChoiceQuestions', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'questionId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

restify.serve(restifyRouter, Questions, restifyOptions({
	preSave: function(req,res,next) {
		//console.log('presave')
		// munge topic from user details
		
		
		// index topics
		var topic = req.body.quiz
		
		indexTopic(topic).then(function() {
			indexTags(req.body.tags).then(function() {
				if (Array.isArray(mediaFields['questions'])) {
					extractMediaFields(mediaFields['questions'],req.body, bucketPrefix + 'questions'+'-').then(function(item) {
						Object.assign(req.body,item)
						//console.log('DONE EXTRACT')
						next()
					})
				} else {				
					next()
				}				
			})
		})
		
	}
	,
	postDelete: function(req,res,next) {
		if (req.params && req.params.id) {
			//console.log(['POST DELETEdddddd '+ 'questions-'+req.params.id,mediaFields])
			if (Array.isArray(mediaFields['questions'])) {
				//console.log(['call DELETE '+req.params.id])
				deleteBucket(bucketPrefix + 'questions-'+req.params.id).then(function() {
					//console.log(['deleted bucket ',bucketPrefix + 'questions-'+req.params.id])
				})
			}
		}
		next()
		
	}
},{test:1}))



restify.serve(restifyRouter, Topics, restifyOptions())
restify.serve(restifyRouter, Tags, restifyOptions())
restify.serve(restifyRouter, Mnemonics, restifyOptions())

// serve database restfully
function bulkSave(req,res,next) {
	//console.log('BS')
	if (res.locals.user && res.locals.user._id ) {
		//console.log('BS user')
		var parts = req.originalUrl ? req.originalUrl.split("/") : []
		var modelType = parts.length > 0 ? parts[parts.length -1] : null
		if (modelType && req.body && Array.isArray(req.body)) {
			//console.log('BS bid')
			console.log(req.body)
			const BulkModel = mongoose.model(modelType, questionsSchema);
			var updatePromises = []
			var insertPromises = []
			var operations = []
			req.body.forEach(function(item) {
				
				//if ((req.body.user && req.body.user === res.locals.user._id) || res.locals.user.is_admin)  {
							//req.body.updated_date = new Date().getTime();
							//req.body.user = res.locals.user._id
							//if (options.preSave) options.preSave(req,res,next)
							//else next()
						//} else {
							//console.log('Incorrect User')
							//return res.sendStatus("401") // not authenticated
						//}
					//} else {
						//console.log('Not authenticated')
						//return res.sendStatus("401") // not authenticated
					//}
				
				
				if (item && item._id) {
					//console.log('BS item id'+item._id, res.locals.user._id, item.user)
					if ((item.user && item.user === res.locals.user._id) || res.locals.user.is_admin)  {
					
					//if (item.delete_me) {
						//operations.push({deleteOne:{filter:{_id:item._id}}})
						//// TODO if (Array.isArray(mediaFields[modelType])) deleteMediaFields(mediaFields[modelType],req.body)
					//} else {
						item.updated_date = new Date().getTime()
						// index topics,tags
						var topic = item.quiz
						updatePromises.push(new Promise(function(resolve,reject) {
							indexTopic(topic).then(function() {
								indexTags(item.tags).then(function() {
									//console.log(['should extract',mediaFields,modelType,Array.isArray(mediaFields[modelType])])
									if (Array.isArray(mediaFields[modelType])) {
										extractMediaFields(mediaFields[modelType],item, bucketPrefix + modelType+'-').then(function(item) {
											//console.log(['did extract',item])
											resolve(item)
										})
									} else {
										resolve(item)
										//operations.push({updateOne:{filter:{_id:mongoose.Types.ObjectId(item._id)},update:item}})
									}
								})
							})
						}))
					} else {
						console.log('Not authenticated')
						//return res.sendStatus("401") // not authenticated
					}
				} else {
					item.created_date = new Date().getTime()
					item.updated_date = new Date().getTime()
					item.user = res.locals.user._id		
					insertPromises.push(new Promise(function(resolve,reject) {
						// index topics,tags
						var topic = item.quiz
						indexTopic(topic).then(function() {
							indexTags(item.tags).then(function() {
								if (Array.isArray(mediaFields[modelType])) {
									extractMediaFields(mediaFields[modelType],item, bucketPrefix + modelType+'-').then(function(item) {
										resolve(item)
									})
								} else {
									resolve(item)
									//operations.push({updateOne:{filter:{_id:mongoose.Types.ObjectId(item._id)},update:item}})
								}
							})
						})
					}))
					//operations.push({insertOne:{document:item}})
				}
			})
			var inserted=[]
			var updated=[]
			Promise.all(insertPromises).then(function(items) {
				items.forEach(function(item) {
					//console.log(['BULK EXTR INS',JSON.stringify(item)])
					operations.push({insertOne:{document:item}})
					inserted.push(item)
				})
				Promise.all(updatePromises).then(function(items) {
					items.forEach(function(item) {	
						//console.log(['BULK EXTR UPD',JSON.stringify(item)])
						operations.push({updateOne:{filter:{_id:mongoose.Types.ObjectId(item._id)},update:item}})
						updated.push(item)
					})
						
					//console.log(JSON.stringify(operations))
					BulkModel.bulkWrite(operations).then(result => {
						console.log({inserted: result.insertedCount, modified: result.modifiedCount, deleted: result.deletedCount})
						res.send({inserted: result.insertedCount, modified: result.modifiedCount, deleted: result.deletedCount, inserted: inserted, updated: updated})
					});
				})

			})
		}
	} else {
		console.log('Not authenticated')
		return res.sendStatus("401") // not authenticated
	}
}

app.use('/handler/rest/bulk/',userFromAuthHeaders, cors(),bulkSave);		


app.use('/handler/rest/',userFromAuthHeaders, cors(),restifyRouter);		
app.use('/handler/test/',userFromAuthHeaders, cors(),function(req,res,next) {
	res.send('test' + ((res.locals && res.locals.user) ? JSON.stringify(res.locals.user) : ''))
});		
// serve HTML
app.use('/handler/',function (req,res) {
	if (!template.trim()) {
		var loginLambdaUrl = getLoginGatewayUrl() 
		loginLambdaUrl = loginLambdaUrl && loginLambdaUrl.trim() ? loginLambdaUrl+ "/login" : ''
		var lambdaUrl = getGatewayUrl() + "/handler"
		lambdaUrl = lambdaUrl && lambdaUrl.trim() ? lambdaUrl+ "/handler" : ''
		template = String(fs.readFileSync(path.join(__dirname,'./react-login-example/build', 'index.html')))
		var pre = template.slice(0,400).replace('###MARKER_apiServer###',lambdaUrl).replace('###MARKER_loginServer###',loginLambdaUrl)
		template = pre + template.slice(400)		
	}
	res.send( template);
});

module.exports = app
