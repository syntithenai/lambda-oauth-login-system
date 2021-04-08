import axios from 'axios'  
import md5 from 'md5'
import https from 'https'

function isEditable(record,user) {
	if (user && user.is_admin) {
		return true
	} else if (user && record && record.user && user._id && record.user === user._id) {
		return true
	}
	return false
}

function getDistinct(axiosClient, restUrl, modelType ,field) {
	return new Promise(function(resolve,reject) {
		axiosClient.get(restUrl+modelType+'?distinct='+field,
		  {},{
			headers: {
				'Content-Type': 'application/json'
			  },
		  }
		).then(function(res) {
		  //console.log(['GET many',res])  
		  if (res && res.data && Array.isArray(res.data)) { 
			  var sorted = res.data.sort(function(a,b) { if (a && b &&  a.toLowerCase().trim() < b.toLowerCase().trim()) {return -1} else {return 1}})
			  //console.log(sorted) 	
			resolve(sorted)
		  } else {
			  resolve([])
		  }
		}).catch(function(res) {
		  //console.log(res)  
		  reject({error: 'Invalid request error'})
		})
	})
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// use a hash of the access token to avoid exposing it in a URL	
function getMediaQueryString(refreshToken) {
    let csrfToken = getCookie('csrf-token')
	let mediaToken = refreshToken ? md5(refreshToken) : '';
    return '_csrf='+csrfToken+'&_media='+mediaToken
}

function getCsrfQueryString() {
	let csrfToken = getCookie('csrf-token')
	return '_csrf='+csrfToken
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
}

    function getParentPath(history) {
       var pathParts = history.location.pathname.split("/")
       var parentPath = ''
       if (pathParts[0] && pathParts[0].trim()) {
            parentPath = "/"+pathParts.slice(0,pathParts.length-1).join("/")
        } else {
            // skip leading slash
            parentPath = "/"+pathParts.slice(1,pathParts.length-1).join("/")
        }
        //console.log(['PP',parentPath])
        return parentPath
    } 

function getAxiosClient(accessToken)	{
	//console.log(['get axios client ',accessToken])
	let axiosOptions={httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })};
    axiosOptions.headers = {}
	let cookie = getCookie('csrf-token');
	if (cookie && cookie.trim().length > 0) {
		// csrf header
		axiosOptions.headers['x-csrf-token'] = cookie
		// add auth headers 
	}
    if (accessToken && accessToken.length > 0)  {
     //   axiosOptions.headers['Authorization'] = 'Bearer '+accessToken
        axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    }
	return axios.create(axiosOptions);
}

    function uniquifyArray(a) {
        ////console.log(['UNIQARRAY',a])
        if (Array.isArray(a)) {
            var index = {}
            a.map(function(value) {
                index[value] = true 
                return null
            })
            return Object.keys(index)
        } else {
            return []
        }
    }
    
    function generateObjectId() {
		var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
		return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
			return (Math.random() * 16 | 0).toString(16);
		}).toLowerCase();
	}
	  
	function YouTubeGetID(url){
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return undefined !== url[2]?url[2].split(/[^0-9a-z_\-]/i)[0]:url[0];
	}
	
	function decodeFromBase64(base64DataString) {
		const parts = base64DataString.split(';base64,')
		if (parts.length > 1) {
			const buffer = Buffer.from(parts[1], 'base64');
			return buffer
		}
	};

export {isEditable, getDistinct, decodeFromBase64, generateObjectId,uniquifyArray,scrollToTop,getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString, getParentPath, YouTubeGetID}
