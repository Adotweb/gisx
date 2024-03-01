const fs = require("fs")
const {generateBid} = require("./bid");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));



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

	

	console.table({seed1, transformed1: generateBid(seed1), currentRequestedPage})
		console.log(url)
})()
