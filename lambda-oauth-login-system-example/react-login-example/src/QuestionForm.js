//{ tag, removeButtonText, onDelete }
import React from 'react';
import {Form, Row, Col} from 'react-bootstrap'

import CheckboxComponent from './components/CheckboxComponent'
import TagsComponent from './components/TagsComponent'
import MediaEditorComponent from './components/MediaEditorComponent'
import RatingsComponent from './components/RatingsComponent'
//import DropDownSelectorComponent from './components/DropDownSelectorComponent'
import DropDownComponent from './components/DropDownComponent'
import TextComponent from './components/TextComponent'
import TextareaComponent from './components/TextareaComponent'
import {getAxiosClient, getDistinct, isEditable} from './helpers'  
import useLocalForageAndRestEndpoint from './useLocalForageAndRestEndpoint'
 
// TODO ?
// 
//access
//sort
//ok_for_alexa


export default function QuestionForm(props) {
	//const tags = props.tagsDB && Array.isArray(props.tagsDB.items) ? props.tagsDB.items.map(function(tag) { return tag && tag.title ? tag.title : ''}) : []
	//const topics = props.topicsDB && Array.isArray(props.topicsDB.items) ? props.topicsDB.items.map(function(topic) { return topic && topic.topic ? topic.topic : ''}) : []
	const axiosClient = props.isLoggedIn() ? getAxiosClient(props.user.token.access_token) : getAxiosClient()
	
	//const props.tagsDB = useLocalForageAndRestEndpoint({modelType:'tags',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	const writabletopicsDB = useLocalForageAndRestEndpoint({modelType:'topics',axiosClient:axiosClient,restUrl:'/dev/handler/rest/api/v1/'})
	//useEffect(function() {
		//props.tagsDB.searchItems({},null,400)	
		//props.topicsDB.searchItems({},null,400)
	//},[])
	
	////const tags = getDistinct('tags','title')
	const editable = isEditable(props.item,props.user)
	//console.log(props)
	return <div>
  <Form.Group >   
	
		
		{editable && <DropDownComponent 
			value={props.item.quiz} 
			createOption={function(option) {
				var item = null
				if (props.user.is_admin) {
					item = {topic: option}
				} else {
					item = {topic: props.user.avatar+"'s "+option}
				} 
				writabletopicsDB.searchItemsNow({topic: item.topic},function(items) {
					if (items && items.length) {
						// already exists
						props.saveField('quiz',item.topic,props.item,props.itemkey)
					} else {
						props.saveField('quiz',item.topic,item,props.itemkey).then(function(newItem) {
							//console.log(['save',item])
							writabletopicsDB.saveItem(item).then(function() {
								var newTopics = [].concat(props.topics)
								newTopics.push(option)
								newTopics.sort()
								props.setTopics(newTopics)
								//writabletopicsDB.searchItems({},null,400,0,{topic:1})
							})		
						})				
					}
				})
			}}  
			onChange={function(value) {
				//console.log(['ONCHANGE',value,props.item,props.itemkey]) 
				props.saveField('quiz',value,props.item,props.itemkey)}
			} 
			options={Array.isArray(props.topics) ? props.topics.map(function(topic) { return (topic && props.user && (props.user.is_admin || (props.user.avatar && topic.indexOf(props.user.avatar) !== -1)) ) ? topic : null}) : []} />}
			
		{!editable && <h4>{props.item.quiz}</h4>}
	<Form.Label style={{float:'right', paddingRight:'2em'}} >Tags 
			{editable && <TagsComponent suggestions={Array.isArray(props.tags) ? props.tags.map(function(tag) { return tag}) : []} value={props.item.tags} onChange={function(value) { props.saveField('tags',value,props.item,props.itemkey)}} />
			}
			{(!editable && Array.isArray(props.item.tags)) && <b>&nbsp;{props.item.tags.join(",")}</b>}
		</Form.Label>
		
		<Form.Label style={{float:'right', paddingRight:'2em'}} >Difficulty 
			{editable && <RatingsComponent value={parseInt(props.item.difficulty) > 0 ? parseInt(props.item.difficulty) : 0} onChange={function(value) { props.saveField('difficulty',value,props.item,props.itemkey)}}  />}
			{!editable && <b>&nbsp;{props.item.difficulty}</b>}
		</Form.Label>
	
		
	</Form.Group>

  <Form.Group >
		<Form.Label inline={"true"}  >Question</Form.Label>
		{editable && <TextComponent value={props.item.question} onChange={function(value) { props.saveField('question',value,props.item,props.itemkey)}} /> }
		{!editable && <span>&nbsp;{props.item.question}</span>}
    </Form.Group>


  <Form.Group >
		<Form.Label inline={"true"}  >Question2</Form.Label>
		{editable &&  TextComponent({value:props.item.q2,onChange: function(value) { props.saveField('q2',value,props.item,props.itemkey)} })}
		{!editable && <span>&nbsp;{props.item.q2}</span>}
    </Form.Group>
<Form.Group >
 
		<Form.Label>Answer</Form.Label>
		{editable && <TextareaComponent value={props.item.answer} onChange={function(value) { props.saveField('answer',value,props.item,props.itemkey)}} />}
		{!editable && <span>&nbsp;{props.item.answer}</span>}
		 
	</Form.Group>
  
  <Form.Group >

    <Form.Label>Feedback</Form.Label>
    {editable && <TextComponent value={props.item.feedback} onChange={function(value) { props.saveField('feedback',value,props.item,props.itemkey)}} />}
    {!editable && <span>&nbsp;{props.item.feedback}</span> }

  </Form.Group>  
  <Form.Group >
    <Row><Col>
    
		<Form.Label inline={"true"}  >Link</Form.Label>
		{editable && <TextComponent value={props.item.link} onChange={function(value) { props.saveField('link',value,props.item,props.itemkey)}} /> }
		{!editable && <span>&nbsp;{props.item.link}</span>}
	</Col><Col>
		<Form.Label inline={"true"}  >Attribution</Form.Label>
		{editable && <TextComponent value={props.item.attribution} onChange={function(value) { props.saveField('attribution',value,props.item,props.itemkey)}} /> }
		{!editable && <span>&nbsp;{props.item.attribution}</span>}
	</Col></Row>
    
  </Form.Group>
  


  
  <Form.Group >
    {editable && <CheckboxComponent value={props.item.discoverable !== 'no'} onChange={function(value) { props.saveField('discoverable',value ? 'yes' : 'no',props.item,props.itemkey)}} /> }
    {!editable && <span>&nbsp;{props.item.discoverable ? "Yes" : "No"}</span>}


  </Form.Group>

	<Form.Group >
		<MediaEditorComponent readOnly={!editable} title="Images" value={props.item.image} onChange={function(value) { props.saveField('image',value,props.item,props.itemkey,1)}}  />
		<MediaEditorComponent readOnly={!editable} title="Media" value={props.item.media} onChange={function(value) { props.saveField('media',value,props.item,props.itemkey,1)}}  />
  </Form.Group>
		
		 
		 
		 
		 
		 

		
		</div>
}
/*
 *  feedback: { type: String},
  difficulty: { type: Number},
  // links and media
  link: { type: String},
  image: { type: Array},
  media: { type: Array},
   // multiple choice/answerable
  specific_question: { type: String},
  specific_answer: { type: String},
  multiple_choice: { type: Array},
  also_accept: { type: String}
 * */
