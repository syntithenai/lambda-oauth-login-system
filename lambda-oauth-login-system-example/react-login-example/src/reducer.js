// handle list updates with minimum disruption to top level items
function reducer(state, action) {
	//console.log(['RED',state,action])
     const index = parseInt(action.index)
	 switch (action.type) {
		case "append":
		  if (action.item) {
			return [...state, action.item];
		  } else return state
		case "prepend":
		  if (action.item) {
			return [action.item, ...state];
		  } else return state
		case "insert":
		  if (action.item && typeof index === "number" ) {
			  if (state.length > 0) {
				  return [
					...state.slice(0, index),
					action.item,
					...state.slice(index)
				  ];
			  } else return state
			} else return state
		case "remove":
		  if (typeof index === "number" ) {
			  return [
				...state.slice(0, index),
				...state.slice(index + 1)
			  ];
		   } else return state 
		case "update":
		   if (action.item && typeof index === "number" ) {
			   return  [
				...state.slice(0, index),
				action.item,
				...state.slice(index + 1)
			  ];
			} else return state 
		case "merge":
		//console.log(['merge',action,index,state])
		   if (action.item && typeof index === "number" ) {
			   //console.log(['domerge',action,index,state])
			   var ret = [
				...state.slice(0, index),
				Object.assign({},state[index], action.item),
				...state.slice(index + 1)
			  ];
			  //console.log(['domerge',action,index,state,ret])
			  return ret
			} else return state 
		case "replaceall":
			if (typeof action.items === "object") {
				return action.items
			} else return state
			
			
		case "extend":
			if (Array.isArray(action.items)) {
				var skip = action.skip ? action.skip : 0
				var limit = action.limit ? action.limit : 0
				var newCollatedItems = Array(skip + limit)
				state.forEach(function(item,key) {
				  newCollatedItems[key] = item
				})
				action.items.map(function(item,k) {
				  newCollatedItems[skip + k] = item
				})
				return newCollatedItems
			} else return state	  
			
		default:
		  throw new Error('Invalid reduction in useDB');
	  }
}
module.exports = reducer
