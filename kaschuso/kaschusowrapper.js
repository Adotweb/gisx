let puppeteer = require("puppeteer")


let page;

const getPage = () => page

async function kaschusowrapper(func){

	const browser = await puppeteer.launch()
	page = await browser.newPage()

	func(page)


}


module.exports = {

	getPage, 
	kaschusowrapper
}
