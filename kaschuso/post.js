const {generateBid} = require("./bid")
const fs = require("fs")


let object ={
  seed: 'FE7871FD7CDD',
  bid: '6ee626d09c76bf9a9834c44a87625264',
  currentRequestedPage: 'RjZsqAj%2BN6o%3D',
  Cookie: 'SLSLanguage=de; Max-Age=94608000; Path=/; Secure; HttpOnly, SCDID_S=WxpvGGuWq63jDWZ9pwtCHZ2pEedNA2Vmq0CskggrBgzh_7ra0RSo8Q$$#dWD2jEdO7yrCZsx6Bpn_ai5OsM5ZSvXQPxcIVIn8NAA$; path=/; Secure; HttpOnly',
  url: 'https://kaschuso.so.ch/login/sls/auth?FE7871FD7CDD=6ee626d09c76bf9a9834c44a87625264'
}

let form = new URLSearchParams()

form.append("userid", "alim.weber");
form.append("password", "Venawa34puwa&")
form.append("currentRequestedPage", object.currentRequestedPage)

fetch(object.url, {
	method:"POST",
	body:form,
	headers:{
		Cookie:object.Cookie
	},
	redirect:"follow",
}).then(res => {
	console.log(res.statusText, res.redirected, res.url)
	
	return res.text()
}).then(res => {



	
	fs.writeFileSync(__dirname + "/file.html", res)
})
