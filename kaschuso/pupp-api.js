const puppeteer = require("puppeteer");
const fs = require("fs")
const cheerio = require("cheerio")

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));



async function getTimeTable(username, password, classname=0) {
	let returns = []

	console.time()

	const browser = await puppeteer.launch({headless:true})


	let page = await browser.newPage()
	await page.goto("https://kaschuso.so.ch/ksso")
	
	await page.waitForSelector(`input[name="userid"]`)

	await page.type(`input[name="userid"]`, username)

	await page.type(`input[name="password"]`, password)

	await page.click(`button[type="submit"]`)

	await page.waitForSelector(`div#startMenu`)

	await page.click(`i.fa-graduation-cap.fas.fa-lg`)

	await sleep(1000)

	let url = new URL(await page.url())
	let gradePage = await page.content()


		

	
	url.searchParams.set("pageid", 22207)
	url.searchParams.set("listindex_s", classname)

	await page.goto(url.toString())

	await page.waitForSelector(`.dhx_cal_event.stpt_event`)


	
	
	let text = await page.content()

	let $ = cheerio.load(text)


	console.log(fs.readdirSync(__dirname))
	if(fs.readdirSync(__dirname).includes("classlist.js")){
		let classlist = []
		$("#listindex_s").children().toArray().map(n => {
			classlist.push([n.attribs.label, n.attribs.value])
		})

		fs.writeFileSync(__dirname + "/classlist.json", JSON.stringify(classlist, null, 4))
	}


	await browser.close()

	console.timeEnd()

	return text
}


module.exports = {

	getTimeTable
}
