import React from 'react';
//import {useState, useEffect} from 'react';
//import {Button, Badge} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";
// need props
// value, onChange, 
// optional
// selectedValue, deselectedValue
export default function RatingsComponent(props) {
	

	return <ReactStars
			count={props.count ? props.count : 5}
			onChange={props.onChange}
			value={props.value ? props.value : 0}
			size={24}
			activeColor="#ffd700"
		  />
		
}

	
