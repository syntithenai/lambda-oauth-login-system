import {useState, useEffect} from 'react'
import {getAxiosClient} from './helpers'
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
const localForage = require('localforage')

const useMnemoReviewTools = (props={}) => {
  
	var db = null
    //var {user} = props
    //const [isReady, setIsReady] = useState(false)
    
    console.log(['review tools',props])
	//useEffect(function() {
		//console.log('review user changed')
		//if (user && user._id) {
			//console.log('review user changed HAVE USER')
			//var promises = []
			//const axiosClient = getAxiosClient(user.token.access_token)
			////const models = ['seen','success','questionStats','userStats','userquestionprogress']
			var localForageProps = {
				user: user, 
				//modelType:modelType,
				axiosClient:axiosClient,
				restUrl:'/dev/handler/rest/api/v1/',
				startWaiting:props.startWaiting,
				stopWaiting: props.stopWaiting,
				onItemQueued: props.onItemQueued,
				onStartSaveQueue: props.onStartSaveQueue,
				onFinishSaveQueue: props.onFinishSaveQueue, 
				autoSaveDelay: 100, 
				autoRefresh: false 
			}
			var modelType = null
			modelType = 'seen'
			localForageProps.modelType = modelType
			db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
			modelType = 'success'
			localForageProps.modelType = modelType
			db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
			modelType = 'questionStats'
			localForageProps.modelType = modelType
			db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
			modelType = 'userStats'
			localForageProps.modelType = modelType
			db[modelType] = useLocalForageAndRestEndpoint(localForageProps)
			modelType = 'userquestionprogress'
			localForageProps.modelType = modelType
			db[modelType] = useLocalForageAndRestEndpoint(localForageProps)

			
			
			//for (var i = 0; i < Object.keys(db).length; i++) {
				//console.log('review user changed load model '+i)
				//db[i].searchItemsNow({},function(searchResult) {
					//console.log(['review user changed create model ',searchResult,db[i].items])
					//iresolve()
				//})
			//}
			//Promise.all(promises).then(function() {
				//setIsReady(true)
			//})
		//}
	//},[props.user])
		
	function seen(user,question) {
		if (user && user._id && question && question._id) {
			
			db.seen.saveItem({user:user._id, question: question._id}).then(function() {
				// todo update question stats
				db.userquestionprogress.searchItems({}).then(function(uqRes) {
					var found = false
					if (Array.isArray(uqRes)) {
						for (var i = 0; i < uqRes.length && !found; i++) {
							if (uqRes[i] && uqRes[i].question === question._id) {
								found = true
								var newItem = uqRes[i]
								newItem.seen = newItem.seen > 0 ? newItem.seen + 1 : 1 
								newItem.successRate = (newItem.success > 0 ? newItem.success : 0) / newItem.seen
								db.userquestionprogress.saveItem(newItem,function() {
									// todo update user stats
								})
							} 
						}
					}
					if (!found) {
						db.userquestionprogress.saveItem({user:user._id, question: question._id, seen:1, success: 0, successRate: 0, topic: question.quiz},function() {
									
						})
					}
					//db.userquestionprogress.saveItem()
				})
			})
		}
	}
	
	function success(user,question) {
		
	}
  
	function nextReviewItem(user,topic) {
		
	}
	
	function nextDiscoveryItem(user,topic) {
		
	}
  
  return {  seen, success, nextReviewItem, nextDiscoveryItem};
}
export default useMnemoReviewTools

