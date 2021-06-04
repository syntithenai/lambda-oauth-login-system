import React from 'react';
//import {useState, useEffect} from 'react';
import {Form} from 'react-bootstrap'
// need props
// value, onChange, 
// options

//props.onChange(e.selectedOptions[0].value)
export default function SelectComponent(props) {
	
	if (!props.readOnly) { 
		return  <Form.Control as="select" onChange={function(e) {props.onChange(e.target.selectedOptions[0].value)}}   value={props.value} >
		{Array.isArray(props.options) && props.options.map(function(option, key) {
			if (typeof option === "object") { 
				//const selected = {selected: (props.value === option.value) ? "true" : null}
				//console.log(['selobj',selected,props.value,option])
				return <option key={key} value={option.value}  >{option.label}</option>
			} else {
				//const selected = {selected: (props.value === option) ? "true" : null}
				//console.log(['selarr',selected,props.value,option])
				// {...selected}
				return <option key={key} value={option}>{option}</option>
			}
			  
			
		})}
	</Form.Control>
	 } else {
		  <span>{props.value}</span>
	  }
}
   
