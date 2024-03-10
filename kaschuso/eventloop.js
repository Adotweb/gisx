const express = require("express");
const puppeteer = require("puppeteer")
const app = express();

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

app.use(express.json())

let globalpage = undefined

const getPage = () => globalpage


app.post("/login", async (req, res) =>  {
	let timeStart = performance.now()

	let {username, password} = req.body

	let page = getPage();


	

	console.log(username, password)

	await page.goto("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")
	await page.waitForSelector('input[name="userid"]')

	
	await page.type('input[name="userid"]', username)

	await page.type('input[name="password"]', password)

	await page.click('button[type="submit"]')

	await page.waitForSelector(".fa-graduation-cap.fas.fa-lg")

	await page.click(".fa-graduation-cap.fas.fa-lg")

	await page.waitForSelector(".div_noten_outer")

	let params = new URL(await page.url()).searchParams
	let transid = params.get("transid");
	let id = params.get("id")

	let cookies = await page.cookies()

	await page.screenshot({path:__dirname + "/frompost.png"})

	let timeStop = performance.now()

	let took  = timeStop - timeStart



	res.send({
		SCDID_S:cookies.filter(({name}) => name == "SCDID_S")[0].value,

		PHPSESSID:cookies.filter(({name}) => name == "PHPSESSID")[0].value,
		id,
		transid,
		took
	})

	for(let i = 0; i < cookies.length;i++){

		let cookie = cookies[i]
		await page.deleteCookie({name:cookie.name, domain: cookie.domain})

	}
})


app.post("/timetable", async (req, res) => {


	let {SCDID_S, PHPSESSID, id, transid} = req.body;

	
		

	let page = getPage();

	await page.setCookie(...[

		{name:"SCDID_S", 
			value:SCDID_S,
		domain:"kaschuso.so.ch"},
		{name:"PHPSESSID", 
			value:PHPSESSID,
		domain:"kaschusos.so.ch"}

	])
	await page.reload()
	
	await page.goto("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")


	await sleep(3000)

	await page.screenshot({path:__dirname + "/timetable.png"})


	res.send("none")

})

app.get("/", async (req, res) => {

	console.log(req.query)
	
	
})

;(async ( )=> {

	let browser = await puppeteer.launch()

	globalpage = await browser.newPage();

	

	app.listen(3000)



})
