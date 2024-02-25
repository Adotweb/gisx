const {default:axios} = require("axios")
const {gen} = require("./sesh")

async function getValidatedPage(){

	let response = await axios.get("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")
		
	let cookies = response.headers["set-cookie"]

	console.log(response.data, cookies)
		
	


}

//currentrequestedpage = G%2Bza5EteHAM%3D (is last thing in login form)
//query string parameter = action on form

(async ( )=> {
	console.log(gen())
	await getValidatedPage()
})()
