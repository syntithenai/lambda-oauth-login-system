import React from 'react';
//import {useState, useEffect} from 'react';
import {Dropdown, Row, Col, Button} from 'react-bootstrap'

export default function SortDropDown(props) {
	return <Dropdown  >
	<Dropdown.Toggle variant="info" id="sort-dropdown-basic">
    Sort
  </Dropdown.Toggle>

  <Dropdown.Menu style={{minWidth: '400px'}}>
	{Object.keys(props.options).map(function(field,key) {
		return  <Dropdown.Item key={key} ><Row style={{paddingTop:'0.2em'}}  >
			<Col className="col-4" >
				<b>{props.options[field]}</b>
			</Col>
			<Col  className="col-8" >
				<Button onClick={function(e) {var s = {}; s[field]= -1; props.setSort(s)}} style={{float:'right'}} >Desc</Button>
				<Button onClick={function(e) {var s = {}; s[field]= 1; props.setSort(s)}} style={{float:'right'}} >Asc</Button>
			</Col>
		</Row></Dropdown.Item>
	})}
  </Dropdown.Menu>
</Dropdown>	
}

	
