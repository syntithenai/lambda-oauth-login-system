import axios from 'axios'  
import md5 from 'md5'
import https from 'https'

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
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
        return parentPath
    } 

function getAxiosClient(accessToken)	{
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
        axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    }
	return axios.create(axiosOptions);
}



export {scrollToTop,getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString, getParentPath}
