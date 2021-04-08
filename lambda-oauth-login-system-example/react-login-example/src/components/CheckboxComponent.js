import React from 'react';
//import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import checkImage from '../images/check.svg'

// need props
// value, onChange
export default function CheckboxComponent(props) {
	//var selectedValue = props.selectedValue ? props.selectedValue : true
	return (
	<React.Fragment>
      {(!props.value) && <Button style={{float: 'left'}}  variant="secondary" onClick={function(e) {props.onChange(true)}} ><img style={{height:'1em'}} src={checkImage} alt="Select"  /></Button>}
      {(props.value )  && <Button style={{float: 'left'}}  variant="success" onClick={function() {props.onChange(false)}} ><img style={{height:'1em'}} src={checkImage} alt="Deselect"  /></Button>}
     </React.Fragment>
   )
}
