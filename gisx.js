const {writeFileSync} = require("fs")
const path = require("path")


async function validateSession(s, username, password){

	
	const formData = new FormData() 

	formData.append("user",username)
	formData.append("password",password)
	formData.append("login.x", 4)
	formData.append("login.y", 9)



	const data = new URLSearchParams() 

	for(const pair of formData){
		data.append(pair[0], pair[1])
	}
	let fetch2 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&m=98&p=145&f=1000000", {
		method:"POST",
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded",
			Cookie:"PHPSESSID=" + s,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",

		},
		body:data
	})	
	
	let fetch3 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher.php?n=3&amp;m=98&amp;p=1&amp;f=1000000&rmsg=", {
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded",
			Cookie:"PHPSESSID=" + s,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",

		},
	})
	
	
	fetch3 = await fetch3.text()

	return fetch3.includes("Angemeldet")
}



async function getValidatedSesh(username, password){
	
		
	let obj = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&m=98&p=145&f=1000000")


	
	let phpsesh = obj.headers.get("set-cookie").split(";")[0].split("=")[1]
	


	const formData = new FormData() 

	formData.append("user",username)
	formData.append("password",password)
	formData.append("login.x", 4)
	formData.append("login.y", 9)



	const data = new URLSearchParams() 

	for(const pair of formData){
		data.append(pair[0], pair[1])
	}


	let fetch2 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&m=98&p=145&f=1000000", {
		method:"POST",
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded",
			Cookie:"PHPSESSID=" + phpsesh,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",

		},
		body:data
	})	


	return phpsesh

}

async function getPageWithSesh(url, session){
	

	let fetch2 = await fetch(url, {
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			Cookie:"PHPSESSID=" + session,
			Host:"gisy.ksso.ch",

		},

	})	
	
	let buf = await fetch2.arrayBuffer() 


	let n = new TextDecoder("ISO-8859-1").decode(buf)
	


	return n
}


async function getQueriedPage(query, sesh){

	

		const formData = new FormData() 

	formData.append("person",query)
	formData.append("search_person.x", 4)
	formData.append("search_person.y", 9)

	

	const data = new URLSearchParams() 

	for(const pair of formData){
		data.append(pair[0], pair[1])
	}


	let p = data.toString();


	let encodings = {
		"%C3%A4":"%E4",
		"%C3%BC":"%FC",
		"%C3%B6":"%F6",
		"%C3%A9":"%E9",
		"%C3%A8":"%E8",
		"%C3%A0":"%E0",
	
	}
	
	Object.keys(encodings).forEach(encoding => {
		p = p.replaceAll(encoding, encodings[encoding])
	})
	
	let fetch2 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher.php?n=3&m=98&p=147&f=1000000", {
		method:"POST",
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
			Cookie:"PHPSESSID=" + sesh,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",
		},
		body:p
	})	


	let buf = await fetch2.arrayBuffer() 


	let n = new TextDecoder("ISO-8859-1").decode(buf)
	


	return n
}



function unEscape(htmlStr) {
    htmlStr = htmlStr.replace(/&lt;/g , "<");	 
    htmlStr = htmlStr.replace(/&gt;/g , ">");     
    htmlStr = htmlStr.replace(/&quot;/g , "\"");  
    htmlStr = htmlStr.replace(/&#39;/g , "\'");   
    htmlStr = htmlStr.replace(/&amp;/g , "&");

	htmlStr = htmlStr.replace(/&nbsp;/g, " ")

	htmlStr = htmlStr.replace(/&uuml;/g, "ü")
	htmlStr = htmlStr.replace(/&Uml;/g, "Ü")
	htmlStr = htmlStr.replace(/&ouml;/g, "ö")
	htmlStr = htmlStr.replace(/&Ouml;/g, "Ö")
	htmlStr = htmlStr.replace(/&auml;/g, "ä")
	htmlStr = htmlStr.replace(/&Auml;/g, "Ä")


	htmlStr = htmlStr.replace(/&eacute;/g, "é")
	htmlStr = htmlStr.replace(/&egrave;/g, "è")
	htmlStr = htmlStr.replace(/&aacute;/g, "á")
	htmlStr = htmlStr.replace(/&agrave;/g, "à")

		


	return htmlStr;
}

async function postQuery([after, before], sesh){

			const formData = new FormData() 

	formData.append("author","")
	formData.append("afterdate", after)
	formData.append("beforedate", before)
	formData.append("title", "")
	formData.append("search", "Suchen")
	

	const data = new URLSearchParams() 

	for(const pair of formData){
		data.append(pair[0], pair[1])
	}


	let p = data.toString();


	let encodings = {
		"%C3%A4":"%E4",
		"%C3%BC":"%FC",
		"%C3%B6":"%F6",
		"%C3%A9":"%E9",
		"%C3%A8":"%E8",
		"%C3%A0":"%E0",
	
	}
	
	Object.keys(encodings).forEach(encoding => {
		p = p.replaceAll(encoding, encodings[encoding])
	})
	
	let fetch2 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher.php?n=3&m=185&p=10648&f=1000100", {
		method:"POST",
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
			Cookie:"PHPSESSID=" + sesh,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",
		},
		body:p
	})	


	let buf = await fetch2.arrayBuffer() 


	let n = new TextDecoder("ISO-8859-1").decode(buf)
	
	n = unEscape(n)
	return n


}

module.exports = {
	getValidatedSesh, 
	getPageWithSesh,
	getQueriedPage,
	validateSession,
	postQuery
}
