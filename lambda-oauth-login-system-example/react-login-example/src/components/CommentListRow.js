import {Button} from 'react-bootstrap'
import { Fragment, PureComponent } from "react";
import ItemForm from './ItemForm'
import {Link} from 'react-router-dom'
import {isEditable} from '../helpers'  

const viewIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg>

const editIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>


const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>

const refreshIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
</svg>

	

export default class CommentListRow extends PureComponent {
  
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

					{editable && <Button title="Delete"  style={{float:'right'}} variant="danger" onClick={function(e) {if (window.confirm('Really delete ?')) data.deleteItem(item._id,index)} } >{deleteIcon}</Button>}
					
					{editable && <Link to={data.matchUrl +item._id} ><Button title="Edit"  style={{float:'right'}} variant="success" >{editIcon}</Button>{item.questionText}</Link>}
					
					{(item && item._id) && <div>
					
					{Array.isArray(data.buttons) ? <>{data.buttons.map(function(button,bkey) {
						if (typeof button === 'function' ) {
							var thisButton = button(Object.assign({},item,{itemkey: bkey, progress: that.state.progress}),function(e) {
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
