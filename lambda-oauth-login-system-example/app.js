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

//mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.databaseConnection, {useNewUrlParser: true, useCreateIndex: true }) 

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
const {questionsSchema, topicsSchema, topicCategoriesSchema, tagsSchema, mnemonicsSchema, multipleChoiceQuestionsSchema, commentsSchema, seenSchema, successSchema, userStatsSchema, questionStatsSchema, userQuestionProgressSchema, grabsSchema, classesSchema, usersSchema} = require('./schema')
var restifyRouter = express.Router();
const {extractMediaFields, deleteBucket} = require('./extractMediaFields')

// extract base64 to filesystem to minimise database size used by preSave and bulkSave
const mediaFields = {questions: ['image','media']}
const bucketPrefix = 'mnemo-'
const Mnemonics = mongoose.model('mnemonics',mnemonicsSchema )
const Questions = mongoose.model('questions',questionsSchema )
const Tags = mongoose.model('tags',tagsSchema )
const Topics = mongoose.model('topics',topicsSchema )
const TopicCategories  = mongoose.model('topicCategories',topicCategoriesSchema )
const MultipleChoiceQuestions = mongoose.model('multipleChoiceQuestions',multipleChoiceQuestionsSchema )
const Comments = mongoose.model('comments',commentsSchema )
const Grabs = mongoose.model('grabs',grabsSchema )
const Classes = mongoose.model('classes',classesSchema )
const Users = mongoose.model('users',usersSchema )
//const Seen = mongoose.model('seen',seenSchema )
//const Success = mongoose.model('successes',successSchema )
//const QuestionStats = mongoose.model('questionStats',questionStatsSchema )
//const UserStats = mongoose.model('userStats',userStatsSchema )
const UserQuestionProgresses = mongoose.model('userquestionprogresses',userQuestionProgressSchema )


Questions.on('index', error => {
    // "_id index cannot be sparse"
    if (error) console.log(error);
});
  
const mongooseModels={
	questions: Questions,
	mnemonics: Mnemonics,
	tags: Tags,
	topics: Topics,
	topiccategories: TopicCategories,
	multiplechoicequestions: MultipleChoiceQuestions,
	comments: Comments,
	grabs: Grabs,
	classes: Classes,
	users: Users,
	//seen: Seen,
	//success: Success,
	//questionStats: QuestionStats,
	//userStats: UserStats,
	userquestionprogresses: UserQuestionProgresses
}

questionsSchema.virtual('mnemonics', {
  ref: 'mnemonics', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'question', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 500 } // Query options, see http://bit.ly/mongoose-query-options
});
questionsSchema.virtual('comments', {
  ref: 'comments', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'question', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 500 } // Query options, see http://bit.ly/mongoose-query-options
});
questionsSchema.virtual('multipleChoiceQuestions', {
  ref: 'multipleChoiceQuestions', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'questionId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { _id: -1 }, limit: 500 } // Query options, see http://bit.ly/mongoose-query-options
});
//questionsSchema.virtual('userquestionprogresses', {
    //ref: 'userquestionprogresses',
    //localField: '_id',
    //foreignField: 'question',
    //justOne: false,   
//});

//commentsSchema.virtual('userFull', {
    //ref: 'users',
    //localField: 'user',
    //foreignField: '_id',
    //justOne: true,   
////});
//commentsSchema.virtual('questionFull', {
    //ref: 'questions',
    //localField: 'question',
    //foreignField: '_id',
    //justOne: true,   
//});
multipleChoiceQuestionsSchema.virtual('question', {
    ref: 'questions',
    localField: 'questionId',
    foreignField: '_id',
    justOne: true,   
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


var options = restifyOptions()
restify.serve(restifyRouter, Topics, options)
restify.serve(restifyRouter, TopicCategories, options)
restify.serve(restifyRouter, Tags, options)
restify.serve(restifyRouter, Mnemonics, options)
restify.serve(restifyRouter, Comments, options)
restify.serve(restifyRouter, MultipleChoiceQuestions, options)
restify.serve(restifyRouter, Grabs, options)

//restify.serve(restifyRouter, Seen, restifyOptions())
//restify.serve(restifyRouter, Success, restifyOptions())
//restify.serve(restifyRouter, QuestionStats, restifyOptions())
//restify.serve(restifyRouter, UserStats, restifyOptions())
restify.serve(restifyRouter, UserQuestionProgresses, options)

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
			const BulkModel = mongooseModels[modelType]
			console.log(['BULKMODEL',BulkModel])
			if (BulkModel) { 
				//mongoose.model(modelType, questionsSchema);
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
					} else if (item) {
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
						if (item) {
							operations.push({insertOne:{document:item}})
							inserted.push(item)
						}
					})
					Promise.all(updatePromises).then(function(items) {
						items.forEach(function(item) {	
							//console.log(['BULK EXTR UPD',JSON.stringify(item)])
							if (item) {
								operations.push({updateOne:{filter:{_id:mongoose.Types.ObjectId(item._id)},update:item}})
								updated.push(item)
							}
						})
							
						//console.log(JSON.stringify(operations))
						BulkModel.bulkWrite(operations).then(result => {
							var reply = result ? {inserted: result.insertedCount, modified: result.modifiedCount, deleted: result.deletedCount, inserted: inserted, updated: updated} : {}
							console.log(reply)
							res.send(reply)
						});
					})

				})
			}
		}
	} else {
		console.log('Not authenticated')
		return res.sendStatus("401") // not authenticated
	}
}

app.use('/handler/rest/bulk/',userFromAuthHeaders, cors(),bulkSave);		


function findUpdates(req,res,next) {
	console.log(['BS',res.locals])
	
	//console.log('PREREAD',req.originalUrl,res.locals ? JSON.stringify(res.locals.user) : 'nolloc')
				//console.log(req && req.erm && req.erm.query)
	var authParts = []
	if (res.locals && res.locals.user) {
		if (!res.locals.user.is_admin) {
			// add filtering to allow view public and owned
			authParts = {$or:[{access:'public'},{user:res.locals.user._id}]}
		}
	} else {
		authParts = {access:'public'}
	}
	
	if (res.locals) { // &&  res.locals.user && res.locals.user._id ) {
		var parts = req.originalUrl ? req.originalUrl.split("/") : []
		var modelType = parts.length > 0 ? parts[parts.length -1] : null
		//console.log(['BS user',parts,modelType])
		if (modelType && req.body && Array.isArray(req.body.ids)) {
			//console.log('BS bid')
			//console.log(req.body.ids ? JSON.stringify(req.body.ids.slice(0,10)) : [])
			const BulkModel = mongooseModels[modelType]
			var populate = req.body.populate ? req.body.populate : ''
			var query = {}
			if (Array.isArray(req.body.ids)) {
				query = {$or: req.body.ids.map(function(idAndDate) {
					if (Array.isArray(idAndDate)) {
						// array of id and updated date pairs
						if (idAndDate.length > 1) { 	
							//console.log(['array of ids and date',idAndDate])
							return {'$and':[{_id:mongoose.Types.ObjectId(idAndDate[0])},{"updated_date":{'$gt':idAndDate[1] > 0 ? parseInt(idAndDate[1]) : 0}}]}
						// array of arrays with single element id
						} else {
							//console.log(['array of arrays',idAndDate])
							{_id:mongoose.Types.ObjectId(idAndDate[0])}
						}
					// array of ids
					} else {
						//console.log(['array of ids',idAndDate])
						return  {_id:mongoose.Types.ObjectId(idAndDate)}
					}
				})}
				if (authParts.length > 0) {
					query = {$and:[query,authParts]}
				} 
				
				//console.log(JSON.stringify(query))
				BulkModel.find(query).populate(populate).then(function(results) {
					//console.log(res)
					res.send(results)
					
				})
			
			}
			//updateCheck.push({'$and':[{_id:localItem._id},{"updated_date":{'$gt':localItem && localItem.updated_date > 0 ? parseInt(localItem.updated_date) : 0}}]})
			//var queryParts=[
				//'query='+encodeURIComponent(JSON.stringify({$or: chunk})),
			//]
		}
	}
}
			
app.use('/handler/rest/updates/',userFromAuthHeaders, cors(),findUpdates);		


app.use('/handler/rest/',userFromAuthHeaders, cors(),restifyRouter);		
//app.use('/handler/test/',userFromAuthHeaders, cors(),function(req,res,next) {
	//res.send('test' + ((res.locals && res.locals.user) ? JSON.stringify(res.locals.user) : ''))
//});		
// serve HTML
app.use('/handler/',function (req,res) {
	if (!template.trim()) {
		var loginLambdaUrl = getLoginGatewayUrl() 
		loginLambdaUrl = loginLambdaUrl && loginLambdaUrl.trim() ? loginLambdaUrl+ "/login" : ''
		var lambdaUrl = getGatewayUrl() + "/handler"
		lambdaUrl = lambdaUrl && lambdaUrl.trim() ? lambdaUrl+ "/handler" : ''
		template = String(fs.readFileSync(path.join(__dirname,'./react-login-example/buildfinal', 'index.html')))
		var pre = template.slice(0,400).replace('###MARKER_apiServer###',lambdaUrl).replace('###MARKER_loginServer###',loginLambdaUrl)
		template = pre + template.slice(400)		
	}
	res.send( template);
});

module.exports = app
