import React from 'react';
//import {useState, useEffect} from 'react';
import {Form} from 'react-bootstrap'

export default function TextComponent(props) {
	return <Form.Control   as='textarea' rows={props.rows > 0 ? props.rows : 4}  type='text' value={props.value ? props.value : ''} onChange={function(e) {props.onChange(e.target.value)}} />		
}

	
