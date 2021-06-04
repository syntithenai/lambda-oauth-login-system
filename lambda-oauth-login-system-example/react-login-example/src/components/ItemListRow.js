import {Button} from 'react-bootstrap'
import { Fragment, PureComponent } from "react";
import ItemForm from './ItemForm'
import {Link} from 'react-router-dom'
import {isEditable} from '../helpers'  
import icons from '../icons'
const {viewIcon, editIcon, deleteIcon, refreshIcon} = icons

export default class ItemListRow extends PureComponent {
  
  constructor(props) {
	super(props);
	this.state = {
		progress: null
	}
	this.setProgress = this.setProgress.bind(this)
  }	
  
  setProgress(progress) {
	  this.setState({progress: progress})
  }
  
  updateProgress() {
	  //console.log(['update PROGRESS',this.props.data])
	  let that = this
		const { index , data} = this.props;
		var item = data && data.items && data.items[index]? data.items[index] : null
		//console.log(['SET PROGRESS ??',data.reviewApi,item])
		if (data.reviewApi && data.reviewApi.questionProgress && item && item._id) {
			//console.log(['SET PROGRESS real ??',data.reviewApi,item])
			data.reviewApi.questionProgress(item).then(function(res) {
				//console.log(['SET PROGRESS',res])
				that.setProgress(res)
			}) 
		}
  }
	
  componentDidMount() {
	this.updateProgress()
  }
	 
  componentDidUpdate(props,state) {
	  const { index , data} = this.props;
	  var newitem = data && data.items && data.items[index]? data.items[index] : null
	  var olditem = props.data && props.data.items && props.data.items[index] ? props.data.items[index] : null
	 // console.log(['update',newitem,olditem, props.data.user, data.user])
	  if (
		data  && props.data && newitem
		//&& data.user //&& props.data.user 
		&& (JSON.stringify(newitem) !== JSON.stringify(olditem)
			|| JSON.stringify(props.data.user) !== JSON.stringify(data.user)
		)
	  ) {
		  //console.log('do update')
		  this.updateProgress()	
	  }
  }
    
  createNew (item) {
	  console.log(item)
  }  
    
  render() {
    const { index, style , data} = this.props;
    var item = data && data.items && data.items[index]? data.items[index] : null
    
    //const [progress, setProgress] = useState(null)
	
	//useEffect(function() {
		//updateProgress()
	//},[item,data.user])
    
    const formProps = Object.assign({},data,{
		//isLoggedIn: data.isLoggedIn,
		//lookups: data.lookups,
		//setLookups: data.setLookups,
		//axiosClient: data.axiosClient, 
		//user: data.user,
		item: Object.assign({},item ,{progress:this.state.progress}),
		//saveField: data.saveField,
		itemkey: index,
		//fieldMeta: data.fieldMeta
	})
    const editable = data.isEditable ? data.isEditable(item,data.user) : isEditable(item,data.user)
	let that = this		
    return (
      <div className="ListItem" style={style}>
      		{(item && item._id) ? <div style={{borderBottom: '1px solid black',borderTop: '1px solid black',clear:'both', paddingBottom:'1em', backgroundColor: (index%2 === 1 ? '#e5e6e7e3' : 'lightgrey')}}  key={item._id}>
				
					{ data.refreshItem && <Button  title="Refresh" style={{float:'right'}} variant="warning" onClick={function() {data.refreshItem(item._id,index)}} >{refreshIcon}</Button>}

					{editable && <Button title="Delete"  style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) data.deleteItem(item,index)} } >{deleteIcon}</Button>}
					{editable && <Link to={data.matchUrl +item._id} ><Button title="Edit"  style={{float:'right'}} variant="success" >{editIcon}</Button></Link>}
					{!editable && <Link to={data.matchUrl +item._id} ><Button title="View"  style={{float:'right'}} variant="success" >{viewIcon}</Button></Link>}
					{(item && item._id) && <div>
					
					{Array.isArray(data.buttons) ? <>{data.buttons.map(function(button,bkey) {
						if (typeof button === 'function' ) {
							var thisButton = button(Object.assign({},item,{itemkey: bkey, progress: that.state.progress, createNew: null}),function(e) {
								console.log('click listrow')
								//clickFunction(e)
								that.updateProgress()
							})
							return thisButton
						} else {
							return button
						}
					})}</> : null }	
						
					 
					 <div style={{width:'100%', clear:'both'}} ><ItemForm  {...formProps} /></div>
					 
					 </div>}
				</div> : null}
				
				
      </div>
    );
  }
}
//		{JSON.stringify(item)}
				
	//{Array.isArray(data.buttons) ? <>{data.buttons.map(function(button) {
						//if (typeof button === 'function' ) {
							//return button(item,'Add to my Review Feed')
						//} else {
							//return button
						//}
					//})}</> : null }
