const puppeteer = require("puppeteer");
const fs = require("fs")
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


(async () => {
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

	returns.push(gradePage)

	
	url.searchParams.set("pageid", 22207)
	url.searchParams.set("listindex_s", 7)

	await page.goto(url.toString())

	await page.waitForSelector(`.dhx_cal_event.stpt_event`)


	await page.screenshot({path:__dirname + "/pic.png"})

	
	let text = await page.content()

	fs.writeFileSync(__dirname + "/file.html", text)

	await browser.close()

	console.timeEnd()
})()
