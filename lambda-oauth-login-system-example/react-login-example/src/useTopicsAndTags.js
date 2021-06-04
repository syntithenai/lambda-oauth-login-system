import {useState, useEffect} from 'react'
import localForage from 'localforage'
import {getDistinct} from './helpers'

export default function useTopicsAndTags(opts) {
	const {restUrl, autoRefresh, axiosClient} = opts
	const [tags,setTags] = useState([])
	const [topics,setTopics] = useState([])
	//const [topicsFull,setTopicsFull] = useState([])
	//const [topicsFull,setTopicsFull] = useState({})
	
	var localForageLookups = localForage.createInstance({name:'lookups',storeName:'items'});
	
	function updateLookups() {
		localForageLookups.getItem('tags').then(function(t) {
			setTags(t)
			if (!Array.isArray(t) || autoRefresh) {
				getDistinct(axiosClient,restUrl,'questions','tags').then(function(t) {
					console.log('APPDISTINCT TAGS')
					setTags(t)
					localForageLookups.setItem('tags',t)
				})
			}
		})
		localForageLookups.getItem('topics').then(function(t) {
			setTopics(t)
			if (!Array.isArray(t) || autoRefresh) {
				getDistinct(axiosClient,restUrl,'questions','quiz').then(function(t) {
					console.log(['APPDISTINCT TOPICS',t])
					//console.log(['getByFieldValues',props.axiosClient])
					//getByFieldValues(props.axiosClient, props.restUrl, 'topics' , 'topic', ['Law News','Song Lyrics']).then(function(res) {
						//console.log(res)
					//})
					setTopics(t)
					localForageLookups.setItem('topics',t)
				})
			}
		}) 
	}
	
	
	function addTag(tag) {
		localForageLookups.getItem('tags').then(function(t) {
			var newT = t
			newT.unshift(tag)
			setTags(newT)
			localForageLookups.setItem('tags',newT)
		})
	}
	
	function addTopic(topic) {
		localForageLookups.getItem('topics').then(function(t) {
			var newT = t
			newT.unshift(topic)
			setTopics(newT)
			localForageLookups.setItem('topics',newT)
		})
	}
			
	//const tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//const topicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	useEffect(function() {
		updateLookups()
		
		//tagsDB.searchItemsNow({},function(tags) {
			//console.log(['LOADEDTAGS',tags])
		//},400,0,{title:1})
		//topicsDB.searchItemsNow({},null,400,0,{topic:1})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])
	
	return {tags, topics, setTags, setTopics, addTag, addTopic}
}	
