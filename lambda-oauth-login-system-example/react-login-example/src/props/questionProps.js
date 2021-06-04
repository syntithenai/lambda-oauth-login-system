import questionsMeta from '../formMeta/questionsMeta'
import {Button, Badge} from 'react-bootstrap'
import questionsMiniMeta from '../formMeta/questionsMiniMeta'
import icons from '../icons'
const {blockOnIcon, blockOffIcon, starOffIcon} = icons
export default function(loginContext, reviewApi) {
	
	var populate = [{"path":"mnemonics"},{"path":"comments"},{"path":"multipleChoiceQuestions"}]

	const questionSingleProps = {
		 modelType: 'questions', 
		 populate: populate, 
		 fieldMeta: questionsMeta,
		 matchUrl: '/search',
		 createItem: function(item,key) {
			console.log('createIteddm')
			console.log(item)
			var value = item.topic
			// filter allowable values by user
			var newValue = (value && loginContext.user && (loginContext.user.is_admin || (loginContext.user.avatar && value.indexOf(loginContext.user.avatar+"'s") === 0))) ? value : '';
			//console.log([newValue,loginContext.user.avatar])
			// empty then default notes
			if (!newValue && loginContext.user && loginContext.user._id && loginContext.user.avatar) {
				newValue =  loginContext.user.avatar+"'s Notes" 
			} 
			return {quiz: newValue, access:'private', discoverable:'yes'} 
		 },
		 createIndexes : {
			quiz: function(item) {return [item.quiz,item._id]},
		 },
		 //backgroundColor: getColor(item.progress.successRate > 0 ? item.progress.successRate * 2: 0), 
		 buttons:[
			 function(item, callback) { 
				 //console.log(['BC',item,item ? item.itemkey : 'none'])
				 if (item) {
					 if (item.progress && item.progress._id ) {
						 if (item.progress.block) {
							 return <Button key={item.itemkey} onClick={function(e) {reviewApi.unblock(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Blocked'} variant="danger" >{blockOnIcon}</Button> 
						 } else { 	
							return  <span key={item.itemkey} >
								<Button key="block" variant="secondary" onClick={function(e) {reviewApi.block(loginContext.user,item).then(function() {callback()})}} style={{float:'left', marginRight:'0.2em'}} title={ 'Block'} >{blockOffIcon}</Button> 
								<Button key="stats"  variant="success" style={{float:'left'}} title={'Under Review'} ><Badge>{item.progress.successTally > 0 ? item.progress.successTally : 0}/{item.progress.seenTally > 0 ? item.progress.seenTally : 0}</Badge></Button> 
								
							</span>
						}
					 } else {
						 return <span key={item.itemkey} >
								<Button key="block" variant="secondary" onClick={function(e) {reviewApi.block(loginContext.user,item).then(function() {callback()})}} style={{float:'left'}} title={ 'Block'} >{blockOffIcon}</Button> 
								<Button key="seen" variant="secondary" style={{float:'left', marginLeft:'0.2em'}} onClick={function(e) {reviewApi.seen(loginContext.user,item).then(function() {callback()})}} title={ 'Add to Review'} >{starOffIcon}</Button></span>
					 }
				}
			}
		]
	 }
	 
	 const questionListProps = Object.assign({},questionSingleProps,{
		itemSize: function(key,items,searchFilter) {return 200},
		useCategorySearch: "quiz",
		fieldMeta: questionsMiniMeta,
		//categoryOptions: topics,
		sortOptions: {_id: 'ID', question: 'Question', answer: 'Answer',updated_date: 'Updated Date',difficulty:'Difficulty'},
		defaultSort: {updated_date:-1},
		minimumBatchSize: 15,
		threshold: 10,
		height:window.innerHeight * 0.85,
	 })


	return  {single: questionSingleProps, list: questionListProps}
}
