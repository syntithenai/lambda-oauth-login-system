import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import SortDropDown from './SortDropDown'
//import ItemListHeader from './ItemListHeader'
import DropDownComponent from '../form_field_components/DropDownComponent'
import icons from '../icons'
const {searchIcon} = icons

const ItemListHeader = function(props) {
	return <> 
			<div style={{zIndex:990, backgroundColor: 'white', position: 'fixed', top: 67, left: 0, width: '100%'}} >
				
			<Link style={{float:'right'}}  to={props.match.url + "/new/"+props.categorySearchFilter} ><Button variant="success"  >+</Button></Link>
		
			<form onSubmit={props.searchItemsEvent} >
				{props.useCategorySearch && <span style={{float:'left'}} ><DropDownComponent value={props.categorySearchFilter} variant={'info'} onChange={props.setCategorySearchFilterEvent} options={Array.isArray(props.categoryOptions) ? props.categoryOptions : []} /></span>}
				<span style={{float:'left', border:'1px solid', padding:'1px 6px 1px 1px', display:'inline-block'}} >
					<input style={{border:'none', background:'none', outline:'none', padding:'0 0', margin:'0 0', font:'inherit'}}  type='text' value={props.searchFilter} onChange={props.setSearchFilterEvent} />
					<span style={{cursor:'pointer', color:'blue', fontWeight: 'bold'}}  onClick={function(e) {props.setSearchFilter(''); props.searchItemsNow(' ') }} title="Clear">&times;</span>
				</span>
				&nbsp;
				<Button style={{float:'left', marginLeft:'0.2em'}} onClick={props.searchItemsEvent} variant={'info'} >{searchIcon}</Button>
				&nbsp;
				
				{typeof props.sortOptions === "object" && <span style={{float:'left', marginLeft:'0.2em'}} ><SortDropDown setSort={props.lsetSort} options={props.sortOptions} /></span>}
			</form>
		</div>
		<div style={{height: '6em'}} ></div>
		<div className="d-none d-md-block d-lg-none" style={{ height:'2em'}}  ></div>	
		<div className="d-none d-sm-block d-md-none" style={{height: '3em'}} ></div>	
		<div className="d-block d-sm-none" style={{height: '4em'}} ></div>	
	</>
}
export default ItemListHeader
