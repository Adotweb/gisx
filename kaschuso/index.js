const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs")

async function getValidatedSession({username, password}){
	
	const browser = await puppeteer.launch();
	const page = await browser.newPage();


	await page.goto("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")
	
	await page.waitForSelector(`input[name="userid"]`)
	await page.type(`input[name="userid"]`, username)
	await page.type(`input[name="password"]`, password)

	await page.click("button.btn.btn-primary")

	
	try{
		await page.waitForSelector(".mdl-layout__container", {
			timeout:4000
		})


		let Cookie = (convert(await page.cookies()))


		return {
			err:false,
			Cookie
		}
	}catch(e){

		return {
			err:"no such user apparently"
		}

	}



}


function convert(puppeteerCookies) {
    // Map each cookie object to a string in the format "name=value"
    const cookiesArray = puppeteerCookies.map(cookie => `${cookie.name}=${cookie.value}`);
    // Join all name=value strings with "; " to create the final cookie header string
    const cookiesString = cookiesArray.join('; ');
    return cookiesString;
}


(async () => {

	const Cookie = await getValidatedSession({username:"username", password:"password"}).then(res => {

		if(res.err){
			throw new Error(res.err)
		} else {
			return res.Cookie
		}
	})



	let getpage = await fetch("https://kaschuso.so.ch/ksso/loginto.php?mode=0&lang=", {
		
		headers:{
			Cookie
		}

	})

	let text = (await getpage.text())



})()
