const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs")



async function getValidatedSession({username, password}){


	let pages = {
		grades:"",
		timetable:""
	}

	console.time()

	const browser = await puppeteer.launch();
	const page = await browser.newPage();


	await page.goto("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")
	
	await page.waitForSelector(`input[name="userid"]`)
	await page.type(`input[name="userid"]`, username)
	await page.type(`input[name="password"]`, password)

	await page.click("button.btn.btn-primary")

	
		await page.waitForSelector("#menu21311", {
			timeout:4000
		})
	

		
	
		await page.click("#menu21311")
		//let Cookie = (convert(await page.cookies()))
	
		await page.waitForSelector("#uebersicht_bloecke")	


		let Cookie = (convert(await page.cookies()))


		let content = await page.content()
	



		await browser.close()
	

	

	console.timeEnd()


	return content



}


function convert(puppeteerCookies) {
    // Map each cookie object to a string in the format "name=value"
    const cookiesArray = puppeteerCookies.map(cookie => `${cookie.name}=${cookie.value}`);
    // Join all name=value strings with "; " to create the final cookie header string
    const cookiesString = cookiesArray.join('; ');
    return cookiesString;
}



(async () => {

	const gradePage =  await getValidatedSession({username:"", password:""}).catch(console.log)

	fs.writeFileSync(__dirname + "/file.html", gradePage)

	//getGrades(Cookie)
})()
