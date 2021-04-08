import React from 'react';
import {useState} from 'react';
import {Form, Button} from 'react-bootstrap'

export default function Password(props) {
	
	const [error, setError] = useState(null)
	const [p1, setP1] = useState(props.value ? props.value : '')
	const [p2, setP2] = useState(props.value ? props.value : '')
	const [changed, setChanged] = useState(false)
	
	function onChange(val) {
		if (p1 === p2) {
			props.onChange(val)
		}
	}

	function onChangeP1(val) {
		setChanged(true)
		if (!val) {
			setError('Empty password')
		} else if (p1 !== p2) {
			setError('Passwords do not match')
		} else {
			setP1(val)
			setError(null)
		}
	}
	
	function onChangeP2(val) {
		setChanged(true)
	}
	
	
	return <span>
		{error && <b>{error}</b>}
		<Form.Control  inline={'true'} type='password' value={p1} onChange={function(e) {onChangeP1(e.target.value)}} />		
		<b>Confirm Password </b>
		<Form.Control   inline={'true'} type='password' value={props.value ? props.value : ''} onChange={function(e) {onChangeP2(e.target.value)}} />
		{(p1 && p1 === p2) && <Button onClick={onChange} variant={'success'} >Save</Button>		
	</span>
}

	
