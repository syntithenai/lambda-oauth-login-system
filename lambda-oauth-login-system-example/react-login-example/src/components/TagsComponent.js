import React from 'react';
//import {useState, useEffect} from 'react';
import {Button, Badge} from 'react-bootstrap'
//import checkImage from '../images/check.svg'
import ReactTags from 'react-tag-autocomplete'
import {uniquifyArray} from '../helpers'
import './TagsComponent.css'
function SuggestionComponent({ item, query }) {
  return (
    <span  id={item.id} className={item.name === query ? 'match' : 'no-match'}>
      {item.name}
    </span>
  )
}
//var SuggestionComponent = null
function TagComponent({tag,onDelete}) {
	return (
    <Button type='button'  size="sm" variant='warning' style={{marginLeft:'0.3em', height:'2.5em'}}  >
       <Badge pill="true" variant="danger" size="lg"  style={{float:'right', fontWeight:'bold', height:'2em', paddingTop:'0.5em'}}  onClick={onDelete} >X</Badge>
      {tag.name}  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;       
    </Button>
  )
} 

// need props
// value, onChange, 
// optional
// selectedValue, deselectedValue
export default function TagsComponent(props) {
	 
	function onTagAddition (tag) {
		 if (tag && tag.name && tag.name.trim().length > 0) {
			const newTags = Array.isArray(props.value) ? [].concat(props.value, tag.name) : [tag.name]
			var tagArray = uniquifyArray(newTags)
			if (props.onChange) props.onChange(tagArray)
			return true
		}
	}
	
    function onTagDelete (i) {
        const newTags = props.value && Array.isArray(props.value)  ? props.value.slice(0) : []
        newTags.splice(i, 1)
        if (props.onChange) props.onChange(newTags)
        return true
    }


	return <React.Fragment>
	
		
		<ReactTags
			tagComponent={TagComponent}
            placeholderText={props.placeholderText ? props.placeholderText : "Add tag"}
			minQueryLength={0}
			maxSuggestionsLength={50}
			autoresize={true}
			allowNew={true}
			tags={props.value && Array.isArray(props.value) ? props.value.map(function(tag,i) {
				return {id: i, name: tag}
			}) : []}
			suggestionComponent={SuggestionComponent}
			suggestions={props.suggestions && Array.isArray(props.suggestions) ? props.suggestions.map(function(name,i) {return {id: i, name: name}}) : []}
			onDelete={onTagDelete}
			onAddition={onTagAddition} /> 
			
			
	</React.Fragment>
}

	
