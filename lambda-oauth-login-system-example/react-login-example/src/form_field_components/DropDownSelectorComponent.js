import React from 'react';
import {Button, Dropdown, ButtonGroup} from 'react-bootstrap'

const DropDownSelectorComponent = function(props) {
    //var [selected, setSelected] = useState(props.value ? props.value : '')
    var variant = props.variant ? props.variant : ''
   
    if (!props.readOnly) { 
	
		return <Dropdown variant={variant} as={ButtonGroup}>
          <Dropdown.Toggle  variant={variant}  split     ></Dropdown.Toggle>
          <Button   variant={variant}   >{props.buttonContent ? props.buttonContent : (props.value ? props.title + " - " + props.value : (props.title ? props.title : ''))} </Button>
          <Dropdown.Menu  variant={variant} >
              {Array.isArray(props.options) && props.options.map(function(optionKey,i) {
                       return <Dropdown.Item  variant={variant}  style={{minHeight:'1.4em'}} key={i} value={optionKey} onClick={function(e) {props.onChange(optionKey)}}  >
                            {optionKey ? optionKey : <b>None</b>}
                        </Dropdown.Item>
                    //} else return null;
              })}
          </Dropdown.Menu>
        
      </Dropdown>
  } else {
	  return <span>{props.value}</span>
  }
}
export default DropDownSelectorComponent
