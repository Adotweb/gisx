const puppeteer = require("puppeteer");
const fs = require("fs")
const cheerio = require("cheerio")


const {parseTimeTable} = require("./parseTimeTable")


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


async function getClassesList(username, password){
	
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


		let classlist = []
		$("#listindex_s").children().toArray().map(n => {
			classlist.push([n.attribs.label, n.attribs.value])
		})



	

	await browser.close()

	return classlist
}

async function getTimeTables(username, password, classlist){

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



	for(let i = 0; i < classlist.length; i++){
		try{


		url.searchParams.set("pageid", 22207)
		url.searchParams.set("listindex_s", classlist[i][1])

	
		await page.goto(url.toString())

		await page.waitForSelector(`.dhx_cal_event.stpt_event`, {timeout:5000})


	
	
		let text = await page.content()

		let {timetable, KLP, classname} = parseTimeTable(text)

		console.log(classname)

		fs.writeFileSync(__dirname + `/timetables/${classname}.json`, JSON.stringify({KLP, timetable}))	

		}catch{
			continue
		}		

	}	

	
	await browser.close()

}

async function getTimeTable(username, password, classname=0) {
	let returns = []


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


	return text
}


module.exports = {
	getClassesList, 
	getTimeTables,
	getTimeTable
}
