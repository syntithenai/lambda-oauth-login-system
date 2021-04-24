import React, {useState} from 'react';
import { Button, Badge, Dropdown, ButtonGroup, InputGroup} from 'react-bootstrap'

const deleteIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>

const DropDownComponent = function(props) {
    
    var [filterValue, setFilterValue] = useState(props.value ? props.value : '')
    if (!props.readOnly) { 
	
		return <Dropdown  as={ButtonGroup}>
          <Dropdown.Toggle variant={props.variant ? props.variant : 'primary'} split  size="sm"  id="dropdown-split-basic" ></Dropdown.Toggle>
          <Button   size="sm" variant={props.variant ? props.variant : 'primary'}  >{props.value ? (props.title ? props.title + " - " : "") + props.value : (props.title ? props.title : '')} 
          {filterValue && <Badge  variant="danger" size="sm"  style={{marginLeft:'1em', borderRadius:'20px', paddingTop:'4px', fontWeight:'bold', height:'2em'}}  onClick={function(e) {e.preventDefault() ;  setFilterValue(''); props.onChange('')}} >{deleteIcon}</Badge>}
				 </Button>
          <Dropdown.Menu variant={props.variant ? props.variant : ''}  >
              
            		
                {(filterValue && props.createOption) && <Button pill="true" size="sm" style={{ float:'left', fontWeight:'bold', height:'2em', paddingTop:'0.5em', paddingBottom:'0.5em'}}  onClick={function(e) {e.preventDefault() ; if (props.createOption) props.createOption(filterValue); props.onChange(filterValue)}} variant="success" >Create</Button>}
            
                <InputGroup>
                  <input type="text" className="form-control" onChange={function(e) {setFilterValue(e.target.value)}}
                value={filterValue} />
			    
			    {filterValue && <Button  variant="danger" size="sm"  style={{ marginLeft:'1em', borderRadius:'20px', paddingTop:'4px', fontWeight:'bold', height:'2em'}}  onClick={function(e) {e.preventDefault() ;  setFilterValue(''); props.onChange('')}} >{deleteIcon}</Button>}
				
			    </InputGroup>
			    <div style={{overflow: 'scroll', height: window.innerHeight * 0.7}}>
              {Array.isArray(props.options) && props.options.map(function(optionKey,i) {
                  ////console.log([optionKey, filterValue])
                   if (!filterValue || (filterValue && typeof filterValue.trim === "function" && filterValue.trim().length === 0) || (filterValue && filterValue.toLowerCase && optionKey && optionKey.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)) {
                       if (optionKey) {
						   return <Dropdown.Item style={{minHeight:'1.4em'}} key={i} value={optionKey} onClick={function(e) {setFilterValue(optionKey); props.onChange(optionKey)}}  >
								{optionKey ? optionKey : <b>None</b>}
							</Dropdown.Item>
						} else {
							return null
						}
                   } else return null;
              })}
              </div>
          </Dropdown.Menu>
      </Dropdown>
  } else {
	  return <span>{props.value}</span>
  }

}
export default DropDownComponent
