import React, {useState} from 'react';
import { Button, Dropdown, ButtonGroup, InputGroup} from 'react-bootstrap'

const DropDownComponent = function(props) {
    
    var [filterValue, setFilterValue] = useState(props.value ? props.value : '')
    
    return <Dropdown  as={ButtonGroup}>
          <Dropdown.Toggle variant={props.variant ? props.variant : 'primary'} split  size="sm"  id="dropdown-split-basic" ></Dropdown.Toggle>
          <Button   size="sm" variant={props.variant ? props.variant : 'primary'}  >{props.value ? (props.title ? props.title + " - " : "") + props.value : props.title} </Button>
          <Dropdown.Menu variant={props.variant ? props.variant : ''}  >
              <form  style={{display:'inline'}} onSubmit={function(e) {e.preventDefault(); props.onChange(filterValue)  }} >
            	{filterValue && <Button pill="true" variant="danger" size="sm"  style={{ float:'left', fontWeight:'bold', height:'2em', paddingTop:'0.5em', paddingBottom:'0.5em'}}  onClick={function(e) {e.preventDefault() ;  setFilterValue(''); props.onChange('')}} >Reset</Button>}
					
                {(filterValue && props.createOption) && <Button pill="true" size="sm" style={{ float:'left', fontWeight:'bold', height:'2em', paddingTop:'0.5em', paddingBottom:'0.5em'}}  onClick={function(e) {e.preventDefault() ; props.createOption(filterValue); props.onChange(filterValue)}} variant="success" >Create</Button>}
            
                <InputGroup>
                  <input type="text" className="form-control" onChange={function(e) {setFilterValue(e.target.value)}}
                value={filterValue} />
			    </InputGroup>
              </form>
              {Array.isArray(props.options) && props.options.map(function(optionKey,i) {
                  ////console.log([optionKey, filterValue])
                   if (filterValue.trim().length === 0 || (optionKey && optionKey.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)) {
                       if (optionKey) {
						   return <Dropdown.Item style={{minHeight:'1.4em'}} key={i} value={optionKey} onClick={function(e) {setFilterValue(optionKey); props.onChange(optionKey)}}  >
								{optionKey ? optionKey : <b>None</b>}
							</Dropdown.Item>
						} else {
							return null
						}
                   } else return null;
              })}
          </Dropdown.Menu>
      </Dropdown>

}
export default DropDownComponent
