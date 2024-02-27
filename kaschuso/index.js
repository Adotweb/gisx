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
			timeout:1000
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


async function getGrades(session){
	
	let prefetch = await fetch("https://kaschuso.so.ch/ksso/index.php?pageid=21311&id=18d943c9e1ef5486&transid=896b31", {
		headers:{
			Cookie:session
		}
	})

	let newSesh = prefetch.headers.get("set-cookie").split(";")[0]



	session = session.replace(/PHPSESSID=.*;/g, newSesh + ";")


	prefetch = await prefetch.text()
	



	let gradeurl = "https://kaschuso.so.ch/ksso/" + [...prefetch.match(/"[^"]*pageid=21311[^"]*"/g)][0].replaceAll(`"`, "").replaceAll("&amp;", "&")

	console.log(gradeurl)

	let gradePage = await fetch(gradeurl, {
		Cookie:session,
	}).then(res => res.text())
	
	fs.writeFileSync(__dirname + "/file.html", gradePage)

}

(async () => {

	const gradePage =  await getValidatedSession({username:"", password:""}).catch(console.log)

	fs.writeFileSync(__dirname + "/file.html", gradePage)

	//getGrades(Cookie)
})()
