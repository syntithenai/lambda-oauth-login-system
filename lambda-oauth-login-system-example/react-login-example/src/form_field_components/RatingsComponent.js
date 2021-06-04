import React from 'react';
//import {useState, useEffect} from 'react';
//import {Button, Badge} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";
// need props
// value, onChange, 
// optional
// selectedValue, deselectedValue
export default function RatingsComponent(props) {
	
	if (!props.readOnly) { 
		 
		return <span><ReactStars
				count={props.count ? props.count : 5}
				onChange={props.onChange}
				value={parseInt(props.value)}
				size={24}
				activeColor="#ffd700"
			  /></span>
	 } else {
		  return <span>{props.value}</span>
	 }		
}

	
