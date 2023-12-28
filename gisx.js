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
	
	return await fetch2.text()
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


	let fetch2 = await fetch("https://gisy.ksso.ch/schulinfo2/navigation/dispatcher.php?n=3&m=98&p=147&f=1000000", {
		method:"POST",
		headers:{
			Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.8",
			"Cache-Control":"max-age:0",
			Connection:"keep-alive",
			"Content-Type":"application/x-www-form-urlencoded",
			Cookie:"PHPSESSID=" + sesh,
			Host:"gisy.ksso.ch",
			Origin:"https://gisy.ksso.ch",
			Referer:"https://gisy.ksso.ch/schulinfo2/navigation/dispatcher_mobile.php?n=3&amp;m=98&amp;p=2&amp;f=1000000&rmsg=",

		},
		body:data
	})	



	return await fetch2.text()
}


module.exports = {
	getValidatedSesh, 
	getPageWithSesh,
	getQueriedPage,
	validateSession
}
