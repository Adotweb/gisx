let cheerio = require("cheerio");

let fs = require("fs")

let page = fs.readFileSync(__dirname + "/file.html")

let $ = cheerio.load(page)

let table = $(".dhx_cal_data")

let columns = table.find(".dhx_scale_holder").toArray()

columns = columns.map(column => {


	let p = $.html(column)
	return p
}).map(column => {

	let p = cheerio.load(column)(".dhx_cal_event.stpt_event").toArray()
	
	console.log(p)
	
	return p
})

