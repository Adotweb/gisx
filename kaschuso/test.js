const fs = require("fs")
const {generateBid} = require("./bid");




(async () => {

	const prefetch = await fetch("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso") 


	let prefetchtext = await prefetch.text()


	let currentRequestedPage = [...prefetchtext.match(/value="[^"]+"/g)][0].split("=")[1].replaceAll(`"`, "")

	

	let Cookie = prefetch.headers.get("set-cookie")

	console.log(Cookie)

	const script1 = await fetch("https://kaschuso.so.ch/sil-bid-check/ses.js", {
		headers:{
			Cookie
		}
	}).then(res => {console.log(res.headers);return res}).then(res => res.text())

	
	let seed1 = [...script1.match(/"?[^"]+="/g)][0].replaceAll(`"`, "").replaceAll("?", "").replaceAll("=", "")



	let url = "https://kaschuso.so.ch/login/sls/auth?" + seed1 + "=" + generateBid(seed1)


	let form = new URLSearchParams()

	form.append("userid", "alim.weber");
	form.append("password", "Venawa34puwa&");
	form.append("currentRequestedPage", currentRequestedPage)

	let page = await fetch(url, {
		headers:{

			"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, br",
			"Accept-Language":"en-GB,en;q=0.9",
			"Cache-Control":"max-age=0",
			"Content-Type":"application/x-www-form-urlencoded",
			Cookie,
			"Origin":"https://kaschuso.so.ch",
			"Referer":"https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso"
		},
		method:"POST",
		body:form,
		redirect:"follow"
	})


	page = await page.text()

	fs.writeFileSync(__dirname + "/file.html", page)

		

	console.table({seed1, transformed1: generateBid(seed1), currentRequestedPage})
})()
