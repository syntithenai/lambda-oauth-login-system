import React from 'react'
const useSelectionsManager = () => {
  const [selected, setSelected] = React.useState({});

  function select(id) {
	  var s = selected
	  s[id] = true
	  setSelected(s)
  }

  function deselect(id) {
	  var s = selected
	  s[id] = false
	  setSelected(s)
  }
  
  function selectAll(items) {
	  if (Array.isArray(items)) {
		  var s = selected
		  items.forEach(item) {
			  if (item && item._id) {
				  s[item._id] = true
			  }
		  }
		  setSelected(s)
	  }
	  
  }
  
  function clearSelection() {
	  
  }

  // Return the width so we can use it in our components
  return { select, deselect, selectAll, clearSelection, selections };
}
export default useSelectionsManager
