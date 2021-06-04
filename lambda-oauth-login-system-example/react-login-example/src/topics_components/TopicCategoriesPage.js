import React,{useState,useEffect} from 'react';
import {Button} from 'react-bootstrap'
import {Link, useParams, useHistory} from 'react-router-dom'

import ItemList from './components/ItemList'

const colors = [
	{color:'white',backgroundColor:'#fe0000'},
	{color:'white',backgroundColor:'#f60'},
	{color:'black',backgroundColor:'#fe9900'},
	{color:'black',backgroundColor:'#fc0'},
	{color:'black',backgroundColor:'#ff0'},
	{color:'black',backgroundColor:'#98cb00'},
	{color:'black',backgroundColor:'#090'},
	{color:'black',backgroundColor:'#0099cb'},
	{color:'white',backgroundColor:'#0066cb'},
	{color:'white',backgroundColor:'#000098'},
	{color:'white',backgroundColor:'#670099'},
	{color:'white',backgroundColor:'#cd0067'},
];

const TopicCategoriesPage = function(props) {
	
	var history = useHistory()
	const {topic} = useParams('')
	function setTopic(topic) {
		console.log('settopic'+topic)
		history.push("/search/topic/"+(topic ? topic : ''))
	}
	console.log(props.reviewApi.userTopics)
	if (topic) {
		return <ItemList {...props}  categorySearchFilter={topic} setCategorySearchFilter={setTopic} />
	} else {
		return <b><br/><br/><br/><br/>
		
		this is the list dddd{JSON.stringify(props.reviewApi.userTopics)}</b>
	}
}
export default TopicCategoriesPage
