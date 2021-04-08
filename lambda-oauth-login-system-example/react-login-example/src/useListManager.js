//import {useState, useEffect} from 'react'
import {uniquifyArray} from './helpers'

export default function useListManager(listIn, onChange) {
   
    var list = Array.isArray(listIn) ? listIn : [] //.slice(0)
   
    function addListItemData(data,prepend) {
        //console.log(['add',data])
         if (prepend)   {
            list.unshift(data)
        } else {
            list.push(data)
        }
        onChange(list)
    }
    
    function deleteListItemData(index) {
        //console.log(['delete',index])
        if (window.confirm('Really delete?')) {
            list = Array.isArray(list) ? list.filter(function(data,key) {if (key !== index) return true; else return false }) : []
            onChange(list)
        }
    }
    
    function updateListItemData(index,data) {
        //console.log(['udpate',index,data,item])
        if (list.length < index) {
            list[index] = data
        }
        onChange(list)
    }
    
    function moveListItemDataUp(index) {
        //console.log(['move down',index])
        if (index > 0) {
            const tmp = list[index]
            list[index] = list[index-1]
            list[index-1] = tmp
        }
        onChange(list)
    }

    function moveListItemDataDown(index) {
        //console.log(['move up',index])
        if (index <= list.length) {
            const tmp = list[index + 1]
            list[index + 1] = list[index]
            list[index] = tmp
        }
        onChange(list)
    }
    
    
    //List items inside list inside ListItem
    
    function addListItemDataItem(index,field,data) {
        //console.log(['add item',index,field,data])
        if (index < list.length && list[index]) {
            if (list[index].hasOwnProperty(field) && Array.isArray(list[index][field])) {
                var subList = list[index][field]
                subList.push(data)
                list[index][field] = subList
                onChange(list)
            }
        }
    }
    
    function deleteListItemDataItem(index,field,itemIndex) {
        //console.log(['delete item',index,field,itemIndex])
        if (window.confirm('Really delete?')) {
            if (index < list.length && list[index]) {
                if (list[index].hasOwnProperty(field) && Array.isArray(list[index][field])) {
                    var subList = Array.isArray(list[index][field]) ? list[index][field].filter(function(data,key) {if (key !== itemIndex) return true; else return false }) : []
                    list[index][field] = subList
                    onChange(list)
                }
            }
        }
    }
    
    function updateListItemDataItem(index,field,itemIndex,data) {
        //console.log(['udpate item',index,field,itemIndex,data])
        if (index < list.length && list[index]) {
            if (list[index].hasOwnProperty(field) && Array.isArray(list[index][field])) {
                var subList = list[index][field]
                if (itemIndex < subList.length) {
                    subList[itemIndex] = data
                    list[index][field] = subList
                    onChange(list)
                }
            }
        }
    }
    
    function moveListItemDataItemUp(index,field,itemIndex) {
        //console.log(['move down item',index,field,itemIndex])
        if (index < list.length && list[index]) {
            var subList = list[index][field]
            if (itemIndex > 0) {
                const tmp = subList[itemIndex]
                if (tmp) {
                    subList[itemIndex] = subList[itemIndex-1]
                    subList[itemIndex-1] = tmp
                    list[index][field] = subList
                    onChange(list)
                }
            }
        }
    }

    function moveListItemDataItemDown(index,field,itemIndex) {
        //console.log(['move down item',index,field,itemIndex])
        if (index < list.length && list[index]) {
            var subList = list[index][field]
            //console.log([list,subList])
            if (itemIndex <= subList.length) {
                const tmp = subList[itemIndex+1]
                if (tmp) {
                    subList[itemIndex+1] = subList[itemIndex]
                    subList[itemIndex] = tmp
                    list[index][field] = subList
                    onChange(list)
                }
            }
        }
    }
    
    
     function onListItemTagDelete (index,field,fieldIndex,subField,subFieldIndex) {
        //console.log(['ontagdel',index,field,fieldIndex,subField,subFieldIndex])
        if (index < list.length && list[index]) {
            var subList = list[index][field]
            //console.log([list,subList])
            if (fieldIndex <= subList.length) {
                if (subList[fieldIndex] && subList[fieldIndex].hasOwnProperty(subField)) {
                    var subArray = Array.isArray(subList[fieldIndex][subField]) ? subList[fieldIndex][subField] : []
                    subArray = subArray.filter(function(data,key) {if (key !== subFieldIndex) return true; else return false })
                    subList[fieldIndex][subField] = subArray
                    list[index][field] = subList
                    onChange(list)
                }
            }
        }
    }
     
      
     function onListItemTagAddition (index,field,fieldIndex,subField,subFieldValue) {
        //console.log(['ontagad',index,field,fieldIndex,subField,subFieldValue])
        if (index < list.length && list[index]) {
            var subList = list[index][field]
             //console.log(['ontagad1',list,subList])
            if (fieldIndex <= subList.length) {
                if (subList[fieldIndex] && subList[fieldIndex].hasOwnProperty(subField)) {
                    var subArray = Array.isArray(subList[fieldIndex][subField]) ? subList[fieldIndex][subField] : []
                    subArray.push(subFieldValue)
                    subArray = uniquifyArray(subArray)
                     //console.log(['ontagad2',subArray])
                    subList[fieldIndex][subField] = subArray
                    list[index][field] = subList
                     //console.log(['ontagad3',list])
                    onChange(list)
                }
            }
        }
        
      }
    
    
    return {    
        addListItemData, 
        deleteListItemData, 
        updateListItemData, 
        moveListItemDataUp, 
        moveListItemDataDown, 
        
        addListItemDataItem, 
        deleteListItemDataItem, 
        updateListItemDataItem, 
        moveListItemDataItemUp, 
        moveListItemDataItemDown, 
        onListItemTagDelete, 
        onListItemTagAddition
    }
    
}
