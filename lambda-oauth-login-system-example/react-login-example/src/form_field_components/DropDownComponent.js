import React, {useState} from 'react';
import { Button, Badge, Dropdown, ButtonGroup, InputGroup} from 'react-bootstrap'

import icons from '../icons'
const {closeIcon} = icons
			    //
			
const DropDownComponent = function(props) {
    
    var [filterValue, setFilterValue] = useState('')  //props.value ? props.value : '')
    if (!props.readOnly) { 
	
		return <div  onClick={function(e) {setFilterValue('')}}  ><Dropdown  as={ButtonGroup}>
          <Dropdown.Toggle variant={props.variant ? props.variant : 'primary'} split  size="sm"  id="dropdown-split-basic" ></Dropdown.Toggle>
          <Button   size="sm" variant={props.variant ? props.variant : 'primary'}  >{props.value ? (props.title ? props.title + " - " : "") + props.value : (props.title ? props.title : '')} 
           {props.value && <Button  variant="danger" size="sm"  style={{ marginLeft:'1em', borderRadius:'20px', paddingTop:'4px', fontWeight:'bold', height:'2em'}}  onClick={function(e) {e.preventDefault() ;  setFilterValue(''); props.onChange('')}} >{closeIcon}</Button>}
				 </Button>
          <Dropdown.Menu variant={props.variant ? props.variant : ''}  >
              
            		
                {(filterValue && props.createOption) && <Button pill="true" size="sm" style={{ float:'left', fontWeight:'bold', height:'2em', paddingTop:'0.5em', paddingBottom:'0.5em'}}  onClick={function(e) {e.preventDefault() ; if (props.createOption) props.createOption(filterValue); props.onChange(filterValue)}} variant="success" >Create</Button>}
            
                <InputGroup>
                  <input style={{border: '1px solid black'}}  type="text" className="form-control" onChange={function(e) {setFilterValue(e.target.value)}} 
                value={filterValue} />
			  	
			    </InputGroup>
			   
			    <div style={{overflow: 'scroll', height: window.innerHeight * 0.7}}>
              {Array.isArray(props.options) && props.options.map(function(optionKey,i) {
                  ////console.log([optionKey, filterValue])
                   if (!filterValue || (filterValue && typeof filterValue.trim === "function" && filterValue.trim().length === 0) || (filterValue && filterValue.toLowerCase && optionKey && optionKey.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)) {
                       if (optionKey) {
						   return <Dropdown.Item  style={{minHeight:'1.4em'}} key={i} value={optionKey} onClick={function(e) {setFilterValue(optionKey); props.onChange(optionKey)}}  >
								<div  >{optionKey ? optionKey : <b>None</b>}</div>
							</Dropdown.Item>
						} else {
							return null
						}
                   } else return null;
              })}
              </div>
          </Dropdown.Menu>
      </Dropdown></div>
  } else {
	  return <span>{props.value}</span>
  }

}
export default DropDownComponent
