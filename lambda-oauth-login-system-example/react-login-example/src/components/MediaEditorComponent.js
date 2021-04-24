//{ tag, removeButtonText, onDelete }
import React,{useState} from 'react';
import {Button} from 'react-bootstrap'
	//import { Link  } from 'react-router-dom'
//import DropDownComponent from './DropDownComponent'
//import './TagsComponent.css'
//import YouTube from 'react-youtube';

import FileReaderInput from 'react-file-reader-input';
import "video-react/dist/video-react.css"; // import css
//import { Player } from 'video-react';
//import AudioPlayer from 'react-h5-audio-player';
//import 'react-h5-audio-player/lib/styles.css';
import useListManager from '../useListManager'    
import {generateObjectId} from '../helpers'

//decodeFromBase64
import CheckboxComponent from './CheckboxComponent'

const FileType = require('file-type/browser');
//const FileSaver = require('file-saver');
   
//function dataFromBase64(base64) {
	//var parts = base64.split(';base64,')
	//if (base64.slice(0,5) === "data:" && parts.length === 2) {
		//return parts[1]
	//} else {
		//return base64
	//}
//}

export default function MediaEditorComponent(props) {
    //let that = this
	
	const [message, setMessage] = useState('')
    var messageTimeout = null
	function setPageMessage(message,timeout=0) {
        setMessage(message)
        if (timeout > 0) {
            if (messageTimeout) clearTimeout(messageTimeout) 
            messageTimeout = setTimeout(function() {setPageMessage('')},timeout)
        }
    }
	
	const [grabUrl, setGrabUrl] = useState('')
	
	const  {   
        addListItemData, 
        deleteListItemData, 
        updateListItemData, 
        moveListItemDataUp, 
        moveListItemDataDown, 
        
        //addListItemDataItem, 
        //deleteListItemDataItem, 
        //updateListItemDataItem, 
        //moveListItemDataItemUp, 
        //moveListItemDataItemDown, 
        //onListItemTagDelete, 
        //onListItemTagAddition
    } = useListManager(props.value,props.onChange)
	
     
    function handleFileSelection(ev, results) {
		setMessage('')
        ev.preventDefault()
        if (results) {
            results.forEach(result => {
                // eslint-disable-next-line
                const [e, file] = result;
                //console.log('FILE')
                //console.log(file)
                var item = {id:null, title:file.name}
                const reader = new FileReader();
                reader.onload = (function(item) { return function(e) { item.data = e.target.result; doSave(item)}; })(item);
                reader.readAsDataURL(file)
                function doSave(item) {  
					if (item && item.data && item.data.length > 10485760) {
						setPageMessage('File is larger than maximum 10MB')
					} else {
						//console.log(['FS',item,item.data])
						if (item.data && item.data.length > 10485760) {
							setPageMessage('File is larger than maximum 10MB')
						} else {
							addListItemData({id: generateObjectId(), label:file.name,base64:item.data.trim(), mime: file.type}) 
						}
					}
                 }
            });
            
        }
    }   
    
    
    function handleUrlGrab(url) {
		setMessage('')
		if (url) {
			//var videoId = YouTubeGetID(url)
				
			//if (type==='video') {
				//console.log('ISYOUTUBE '+videoId)
			//}
			
			setGrabUrl('')
			 
			//// Initialize the XMLHttpRequest and wait until file is loaded
			try {
				var xhr = new XMLHttpRequest();
				xhr.onload = function () {
					// Create a Uint8Array from ArrayBuffer
					var codes = new Uint8Array(xhr.response);

					// Get binary string from UTF-16 code units
					var bin = String.fromCharCode.apply(null, codes);
					FileType.fromBuffer(codes).then(function({ext,mime}) {
						//console.log('MIME '+mime)
						// Convert binary to Base64
						var b64 = btoa(bin);
						if (b64 && b64.length > 10485760) {
							setPageMessage('File is larger than maximum 10MB')
						} else {
							//youtubeVideoId: videoId, 
							addListItemData({id: generateObjectId(), mime: mime, ext: ext, label:url,href:url, sourceUrl:url, base64: 'data:'+mime+';base64,' + b64}) 
						}
					})
				  
				  //console.log(b64); //-> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
				};
				xhr.open('GET', url);
				xhr.responseType = 'arraybuffer';
				xhr.send();
			} catch (e) {
				console.log(e)
			}
		}
    }

	function getItemUrl(item) {
		var ret = null
		if (item.href) {
			ret =  item.href
		} else if (item.uploadedUrl) {
			ret = item.uploadedUrl
		} else if (item.base64) {
			ret =  item.base64
		}
		return ret
	}
	
	/** 
	 * Return img/audio/video from item
	 */
	function getMediaElement(item) {
		var url = getItemUrl(item)
		var image = <img alt="images" style={{height:props.height ? props.height : '100px'}} src={url} />
		var audio = <audio controls src={url} />
		var video = <video controls autoplay={true} style={{height:props.height ? props.height : '300px'}} src={url} />
		var link = <a target="_new" href={url} >{url}</a>
		if (item.mime) { 
			if (item.mime.indexOf('image/') === 0) {
				return image
			} else if (item.mime.indexOf('audio/') === 0) {
				return audio
			} else if (item.mime.indexOf('video/') === 0) {
				return video
			} else {
				return link
			}
		} else {
			if (url.indexOf('data:') === 0) {
				//console.log('DATAURL')
				var parts = url.split(";")
				var iparts = parts.length > 0 ? parts[0].split(":") : []
				var type = iparts.length > 1 ? iparts[1] : ''
				var categoryParts = type.split("/")
				var category = categoryParts.length > 0 ? categoryParts[0] : ''
				//console.log(['DATAURL',parts,iparts,type,category])
				if (category === "image") {
					return image
				} else if (category === "video") {
					return video
				} else if (category === "audio") {
					return audio
				}
			}
			else if (url && url.toLowerCase && (url.toLowerCase().endsWith('.jpeg') ||url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.webp') || url.toLowerCase().endsWith('.gif') || url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.svg') )) {
				return image
			} else if (url && url.toLowerCase && (url.toLowerCase().endsWith('.mp3') || url.toLowerCase().endsWith('.wav')  || url.toLowerCase().endsWith('.ogg') )) {
				return audio
			} else if (url  && url.toLowerCase  && (url.toLowerCase().endsWith('.avi') || url.toLowerCase().endsWith('.mp4')  || url.toLowerCase().endsWith('.ogv') || url.toLowerCase().endsWith('.mp3') || url.toLowerCase().endsWith('.webm'))) {
				return video
			} else {
				return link 
			}
		}
	}
	
	if (!props.readOnly) { 
	   return	(<div style={{marginTop:'0.5em', borderTop:'1px solid grey', clear:'both'}}>
			{props.title && <span style={{marginRight:'0.5em'}}>{props.title}</span>}
			{message && <b style={{color: 'red'}} >{message}</b>}
			{!props.readOnly &&  <form  style={{float:'right', marginLeft:'1em'}} onSubmit={function(e) {e.preventDefault()}} >
				<FileReaderInput multiple as="binary" 
								 onChange={function(ev, results) {return handleFileSelection(ev, results)}}>
				  <Button variant="success" style={{ marginRight:'0.5em'}} >Select files</Button>
				</FileReaderInput>
			</form>}
			{!props.readOnly && <form  style={{float:'right'}} onSubmit={function(e) {e.preventDefault(); handleUrlGrab(grabUrl) }} >
				<input type='text' value={grabUrl} onChange={function(e) {setGrabUrl(e.target.value)}} />
				<Button variant="success" type="submit" >From URL</Button>
			</form>}
			{Array.isArray(props.value) && props.value.map(function(button,buttonKey) {
			
			//var blob = button.base64 ? new Blob([decodeFromBase64(button.base64)], {type: button.mime}) : null
			

			return <div style={{clear:'both'}} key={buttonKey}>
			
				{!props.readOnly && <Button variant="danger" onClick={function(e) {deleteListItemData(buttonKey)}} > X </Button>}
				{!props.readOnly && <Button variant="primary"onClick={function(e) {moveListItemDataUp(buttonKey)}}  > ^ </Button>}
				{!props.readOnly && <Button variant="primary" onClick={function(e) {moveListItemDataDown(buttonKey)}}  > v </Button>}
				
				
				<label>&nbsp;&nbsp;&nbsp;URL&nbsp;&nbsp; 
				{!props.readOnly && <input size="60" type="text" value={button.href} onChange={function(e) {var newButton = button; newButton.href = e.target.value; updateListItemData(buttonKey,newButton)}} />}
				{!!props.readOnly && <span>{button.href}</span>}
				</label>
				
				<label>&nbsp;&nbsp;&nbsp;Attribution&nbsp;&nbsp; 
				{!props.readOnly && <input size="60" type="text" value={button.attribution} onChange={function(e) {var newButton = button; newButton.attribution = e.target.value; updateListItemData(buttonKey,newButton)}} />}
				{!!props.readOnly && <span>{button.attribution}</span>}
				</label>
				
				<label  >&nbsp;&nbsp;&nbsp;Autoplay ?&nbsp;&nbsp; 
				{!props.readOnly && <span >&nbsp;&nbsp;<CheckboxComponent style={{marginLeft:'3em'}}  value={button.autoplay === "yes" ? true : false} onChange={function(e) {var newButton = button; newButton.autoplay = e ? 'yes' : 'no'; updateListItemData(buttonKey,newButton)}} />&nbsp;&nbsp;</span>}
				{!!props.readOnly && <span>{button.autoplay ? 'Yes' : 'No'}&nbsp;&nbsp;</span>}
				</label>
				
				
					
					{(getItemUrl(button)) && <span>
						
						{getMediaElement(button)}	
					</span>}
				
				</div>
			})} 
			</div> )

	  } else {
		  return <span  >
			{(Array.isArray(props.value)) && props.value.map(function(media) {
				return <span style={{position:'relative'}}>
					{getMediaElement(media)}
					<span style={{position:'absolute', bottom: 0, left: 0}} >{media.attribution ? media.attribution : ''}</span>
				</span>
				
			})}
			
		  </span>
	  }
}
//<label>&nbsp;&nbsp;&nbsp;Label&nbsp;&nbsp; 
				//{!props.readOnly && <input size="60" type="text" value={button.label} onChange={function(e) {var newButton = button; newButton.label = e.target.value; updateListItemData(buttonKey,newButton)}} />}
				//{!!props.readOnly && <span>{button.label}</span>}
				//</label>
	//{(button.mime && button.mime.startsWith('image')) && <img alt={'media'} style={{maxWidth:'100px'}} src={getItemUrl(button)} />}
						
						//{(button.mime && button.mime.startsWith('audio')) && <audio
							//src={getItemUrl(button)}
							//controls
						  ///>}
						
						//{(false && button.youtubeVideoId) && <YouTube opts={{height:'80', playerVars:{}}}  videoId={button.youtubeVideoId}  />}
						
						//{(button.mime && button.mime.startsWith('video')) &&  <span style={{zIndex: 9999, height:"400px", width:"400px" }}>
						 //<Player height={'400'} fluid={false} >
						  //<source src={getItemUrl(button)} />
						//</Player></span>}
						
						//{(!button.mime || (button.mime && !button.mime.startsWith('image') && !button.mime.startsWith('audio') && !button.mime.startsWith('video'))) && <span>
							//{blob && <Button onClick={function() {FileSaver.saveAs(blob, (props.title ? props.title + '-' + button.id :'download_'+ button.id));
//}} >Download</Button>}
							//{!blob && <a  target="_blank"  rel="noreferrer" href={getItemUrl(button)} ><Button>Download</Button></a>}
						//</span>}
										
