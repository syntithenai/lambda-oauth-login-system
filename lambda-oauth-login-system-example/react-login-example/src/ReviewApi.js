import { useEffect, useState}  from 'react'
//import {Button} from 'react-bootstrap'
//import {Link, useParams, useHistory} from 'react-router-dom'
import {getAxiosClient, getByFieldValues} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'

const localForage = require('localforage')


export default function ReviewApi(props) {

	//const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	//const {saveField, saveItemNow, deleteItem, getItem, refreshItem} = useLocalForageAndRestEndpoint({user: props.user, modelType:'questions',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/',startWaiting:props.startWaiting,stopWaiting: props.stopWaiting,onItemQueued: props.onItemQueued,onStartSaveQueue: props.onStartSaveQueue,onFinishSaveQueue: props.onFinishSaveQueue, autoSaveDelay: props.autoSaveDelay, autoRefresh: props.autoRefresh ? true : false })
	
	//var [db,setDb] = useState({})
	var [userTopics,setUserTopics] = useState([])
	var db = {}
	var localForageProps = Object.assign({},props,{
		//user: props.user, 
		////modelType:modelType,
		//axiosClient:props.axiosClient,
		//restUrl:'/dev/handler/rest/api/v1/',
		////startWaiting:props.startWaiting,
		////stopWaiting: props.stopWaiting,
		////onItemQueued: props.onItemQueued,
		////onStartSaveQueue: props.onStartSaveQueue,
		////onFinishSaveQueue: props.onFinishSaveQueue, 
		//autoSaveDelay: 10000, 
		//autoRefresh: false 
	})
	var modelType = null
	modelType = 'userquestionprogresses'
	localForageProps.modelType = modelType
	db[modelType] = useLocalForageAndRestEndpoint(Object.assign({},localForageProps,{autoRefresh: true, createIndexes : {
		questions: function(item) {return [item.question,item._id]},
	}}))
	
	modelType = 'questions'
	localForageProps.modelType = modelType
	db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
	
	modelType = 'comments'
	localForageProps.modelType = modelType
	db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
	
	modelType = 'classes'
	localForageProps.modelType = modelType
	db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
	//db[modelType].searchItemsNow({})
	
	modelType = 'topiccollections'
	localForageProps.modelType = modelType
	db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
	//db[modelType].searchItems({})
	
	
	
	function loadUserProgress(user) {
		//console.log('loadUserProgress', user)
		if (user && user._id) {
			//console.log('loadUserProgress y')
			db.userquestionprogresses.searchItems({user: user._id},function(items) {
				var topics = {}
				//console.log('loadUserProgress cb1', JSON.parse(JSON.stringify(items)))
				items.map(function(item) {
					if (item && item.topic) {
						//console.log('loadUserProgress cb2', item.topic)
						topics[item.topic] = 1
					}
				})
				//console.log(['USER TOPICS',JSON.parse(JSON.stringify(topics))])
				setUserTopics(Object.keys(topics))
			})
		}
	}
	
	useEffect(function() {
		loadUserProgress(props.user) 
	},[props.user])
	
	
	
	
		//setDb(db)
	//},[props.user])
	//console.log(props)
	//const history = useHistory()
	
	//function add(user,question) {
		//return new Promise(function(resolve,reject) {
			//console.log(['seen',user,question,props.user])
			//if (question && question._id) {
				//db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					////console.log(['seen found',item])
					//var newItem = item ? item : {question: question._id}
					//newItem.topic = question.quiz
					//newItem.tags = question.tags
					//newItem.difficulty = question.difficulty
					//newItem.successTally = newItem.successTally > 0 ? newItem.successTally : 0 
					//newItem.seenTally = newItem.seenTally > 0 ? newItem.seenTally + 1 : 1 
					//newItem.seen = new Date().getTime()/1000
					//newItem.successRate = (newItem.successTally > 0 ? newItem.successTally : 0) / newItem.seenTally
					//newItem.action = 'seen' // flag for server create seen record
					//db.userquestionprogresses.saveItem(newItem).then(function(final) {
						//db.userquestionprogresses.saveQueue()	
						//console.log(['seen saved',final])
						//resolve(final)
					//})
				//})
			//} else {
				//resolve(null)
			//}
		//})
	//}
	
	function seen(user,question) {
		return new Promise(function(resolve,reject) {
			console.log(['seen',user,question,props.user])
			if (question && question._id) {
				db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					//console.log(['seen found',item])
					var newItem = item ? item : {question: question._id}
					newItem.topic = question.quiz
					newItem.tags = question.tags
					newItem.block = 0
					newItem.difficulty = question.difficulty
					newItem.successTally = newItem.successTally > 0 ? newItem.successTally : 0 
					newItem.seenTally = newItem.hasOwnProperty('seenTally') ? (newItem.seenTally > 0 ? newItem.seenTally + 1 : 1 ) : 0
					newItem.seen = new Date().getTime()/1000
					newItem.successRate = (newItem.successTally > 0 ? newItem.successTally : 0) / newItem.seenTally
					newItem.action = 'seen' // flag for server create seen record
					db.userquestionprogresses.saveItem(newItem).then(function(final) {
						//db.userquestionprogresses.saveQueue()	
						console.log(['seen saved',final])
						resolve(final)
					})
				})
			} else {
				resolve(null)
			}
		})
	}
	
	function success(user,question) {
		return new Promise(function(resolve,reject) {
			console.log('success')
			if (question && question._id) {
				db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					//console.log(['seen found',item])
					var newItem = item ? item : {question: question._id}
					newItem.topic = question.quiz
					newItem.tags = question.tags
					newItem.block = 0
					newItem.difficulty = question.difficulty
					newItem.successTally = newItem.successTally > 0 ? newItem.successTally + 1 : 1 
					newItem.seenTally = newItem.seenTally > 0 ? newItem.seenTally + 1 : 1 
					newItem.seen = new Date().getTime()/1000
					newItem.successRate = (newItem.successTally > 0 ? newItem.successTally : 0) / newItem.seenTally
					newItem.action = 'success' // flag for server create success record
					db.userquestionprogresses.saveItem(newItem).then(function(final) {
						//db.userquestionprogresses.saveQueue()	
						console.log(['succ saved',final])
						resolve(final)
					})
				})
			} else {
				resolve(null)
			}
			
		})
		
	}
	
	function getStreak() {
		return new Promise(function(resolve,reject) {
			if (!props.user || !props.user._id) resolve([])
			getAllProgresses(props.user._id).then(function(useList) {
				console.log(['getStreak',useList])
				if (Array.isArray(useList)) {
					var dateIndexed = {}
					useList.forEach(function(progress) {
						var updated = new Date(progress.updated_date)
						var key = updated.getDate() + '-'+updated.getMonth()+'-'+updated.getFullYear()
						dateIndexed[key] = Array.isArray(dateIndexed[key]) ? dateIndexed[key] : []
						dateIndexed[key].push(progress)
					})
					//var dates = Object.keys(dateIndexed)
					//dates.sort()
					console.log([dateIndexed])
					
					var date = new Date(Date.now() - 864e5); // start yesterday
					var dateKey = date.getDate() + '-'+date.getMonth()+'-'+date.getFullYear()
					var i = 1
					while (dateIndexed.hasOwnProperty(dateKey) && i < 3000) {
						date = new Date(Date.now() - (864e5 * i))
						dateKey = date.getDate() + '-'+date.getMonth()+'-'+date.getFullYear()
						i++
					}
					resolve(i - 1)
				}
			})
			
		})
	}
	
  
	function nextReviewItem(user,topic) {
		return new Promise(function(resolve,reject) {
			console.log('next review')
			resolve()
		})
	}
	
	function nextDiscoveryItem(user,topic) {
		return new Promise(function(resolve,reject) {
			console.log('next discover')
			resolve()
		})
	}
	
	function block(user,question) {
		return new Promise(function(resolve,reject) {
			console.log('block')
			if (question && question._id) {
				db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					//console.log(['block found',item])
					db.userquestionprogresses.saveItem(Object.assign({},item,{question: question._id, block:1, topic: question.quiz, tags: question.tags, difficulty: question.difficulty})).then(function(final) {
						console.log(['block saved',final])
						resolve(final)
					})
				})
			} else {
				resolve(null)
			}
		})
	}
	
	function unblock(user,question) {
		return new Promise(function(resolve,reject) {
			//console.log('unblock')
			if (question && question._id) {
				db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					//console.log(['unblock found',item])
					db.userquestionprogresses.saveItem(Object.assign({},item,{question: question._id,block:0, topic: question.quiz, tags: question.tags, difficulty: question.difficulty})).then(function(final) {
						//console.log(['block saved',final])
						resolve(final)
					})
				})
			} else {
				resolve(null)
			}
		})
	}
	
	function questionProgress(question) {
		return new Promise(function(resolve,reject) {
			if (question && question._id) {
				db.userquestionprogresses.getFirstItemFromIndexValues('questions',question._id).then(function(item) {
					//console.log(['QP',item])
					resolve(item)
				})
			} else {
				resolve(null)
			}
		})
	}
	
	
	function getTsXHoursBack(x) {
		return parseInt((new Date().getTime() - (3600000 * x))/1000,10) // return seconds as per userquestionprogress.seen
	}


//getItemsFromIndexValues

	function getReviewList(topic, list) {
		if (props.startWaiting) props.startWaiting()
		return new Promise(function(resolve,reject) {
			var start = new Date().getTime()
			if (!props.user || !props.user._id) resolve([])
			getAllProgresses(props.user._id).then(function(useList) {
				console.log(['updateReviewList',useList])
				if (Array.isArray(useList)) {
					var list = []
					var intervals = [0,1,8,27,64,125,216,343,512,729,1000,1331,1728,2197,2744,3375,4100,4800,4550,5350,6200,7100,8050,9050,10100,11200]
					useList.forEach(function(progress) {
						if (progress && !progress.block) {
							if (!topic || (topic && progress.topic === topic)) {
								if (progress.seenTally === 0) {
									list.push(progress._id)
									console.log('never seen')
								} else {
								//var found = false
									console.log(['updateReviewList topic and not blocked'])
									var interval = intervals[progress.successTally]
									//intervals.forEach(function(interval,ik) {
									//console.log(['updateReviewList CHECK',progress.successTally,interval,progress.seen,getTsXHoursBack(interval),progress.seen - getTsXHoursBack(interval)])
									if (progress.seen < getTsXHoursBack(interval))  {
										console.log(['updateReviewList topic seem pass'])
										// recent
										if ((new Date().getTime()/1000 - progress.seen) > 3600) {
											//found = true
											console.log(['updateReviewList push'])
											list.push(progress._id)
										}
									}
								}
							}
						}
					})
					console.log(['updateReviewList',new Date().getTime() - start,list,useList])
					if (props.stopWaiting) props.stopWaiting()
					resolve(list)
				} else {
					if (props.stopWaiting) props.stopWaiting()
					resolve([])
				}
			})
		})
	}
	
	function getAllProgresses(user) {
		//console.log(['getall ump',user])
		if (props.startWaiting) props.startWaiting()
		return new Promise(function(resolve,reject) {
			const userquestionprogressesLocalForage = localForage.createInstance({name:'userquestionprogresses',storeName:'items'+(props.user && props.user._id ? '-'+props.user._id : '')});
			var promises = []
			userquestionprogressesLocalForage.keys().then(function(keys) {
				keys.forEach(function(key) {
					promises.push(userquestionprogressesLocalForage.getItem(key))
				})
				Promise.all(promises).then(function(res) {
					var final = []
					if (Array.isArray(res)) {
						res.forEach(function(resItem) {
							if (resItem.user === user) final.push(resItem)
						})
					}
					//console.log(['goall ump',final])
					//if (props.stopWaiting) props.stopWaiting()
					resolve(final)
				})
			})
		})
	}
	
	function getDiscoverList(topic) {
		console.log(['getDiscoverList'])
		if (props.startWaiting) props.startWaiting()
		return new Promise(function(resolve,reject) {
			const questionsLocalForage = localForage.createInstance({name:'questions',storeName:'items'+(props.user && props.user._id ? '-'+props.user._id : '')});
			
			//if (!topic) resolve([0,[]])
			//var start = new Date().getTime()
			questionsLocalForage.keys().then(function(keys) {
				getAllProgresses(props.user._id).then(function(useList) { 
					console.log(['getDiscoverList searched items',useList])
					//const useList = list ? list : db.userquestionprogresses.items
					//console.log(['updateReviewList',start,db.userquestionprogresses.items])
					if (Array.isArray(useList)) {
						var list = []
						var seenIds = []
						useList.forEach(function(item) {
							if (item && item._id) {
								seenIds.push(item.question)
							}
						})
						console.log([list,seenIds]);
						// direct to localStorage for all items ever searched for
							
						function doResolveLocal() {
							var promises = []
							//console.log(keys);
							keys.forEach(function(key) {
								promises.push(questionsLocalForage.getItem(key))
							})
							Promise.all(promises).then(function(items) {
								var final = []
								items.forEach(function(item) {
									if (item && item._id && item.discoverable !== 'no' && seenIds.indexOf(item._id) === -1) {
										//console.log(['getDiscoverList not seen can disco ',item])
										if (topic) { 
											//console.log(['getDiscoverList topic ',topic, item.quiz])
											if (topic === item.quiz) {
												//console.log(['getDiscoverList topic match ',topic])
												final.push(item)
											} 
										} else {
											final.push(item)
										}
									}
								})
								var l = final && final.length ? final.length : 0
								console.log(['getDiscoverList final ',final])
								if (l > 0) {
									if (props.stopWaiting) props.stopWaiting()
									resolve([l,final.slice(0,500)]) //.map(function(fitem) {return fitem._id})])
								} else {
									doResolveOnline()
								}
							})

						}
						function doResolveOnline() {
							console.log(['getDiscoverList start online ',topic])
							db.questions.searchItems({quiz: topic},function(items) {
								console.log(['getDiscoverList start online items ',items])
								var final = []
								items.forEach(function(item) {
									//console.log(['item ',(item ? JSON.stringify([item._id,item.discoverable,seenIds.indexOf(item._id)])   :'') ])
											
									if (item && item._id && item.discoverable !== 'no' && seenIds.indexOf(item._id) === -1) {
										if (topic) { 
											//console.log(['getDiscoverList start online items check ',topic,item.quiz])
											if (topic === item.quiz) {
												final.push(item)
											} 
										} else {
											final.push(item)
										}
									}
								})
								var l = final && final.length ? final.length : 0
								console.log(['getDiscoverList final online ',final])
								if (props.stopWaiting) props.stopWaiting()
								resolve([l,final.slice(0,500)]) //.map(function(fitem) {return fitem._id})])
							})
						}
						
						if (keys.length === 0) {
							console.log(['res online'])
							doResolveOnline()
						} else {
							console.log(['res local'])
							doResolveLocal()
						} 
						
				
					//console.log(['updateReviewList',new Date().getTime() - start,list,useList])
					
					} else {
						if (props.stopWaiting) props.stopWaiting()
						resolve([0,[]])
					}
				})
			}).catch(function(err) {
				// This code runs if there were any errors
				if (props.stopWaiting) props.stopWaiting()
				console.log(err);
			});
		})
	}
	
	const { children } = props;

	return children(Object.assign({},props,{
	  db:db,
	  seen: seen,
	  success: success,
	  nextReviewItem: nextReviewItem,
	  nextDiscoveryItem: nextDiscoveryItem,
	  questionProgress: questionProgress,
	  block: block,
	  unblock: unblock,
	  getReviewList: getReviewList,
	  getDiscoverList: getDiscoverList,
	  getStreak: getStreak,
	  loadUserProgress: loadUserProgress,
	  userTopics: userTopics
	}));
	

}
