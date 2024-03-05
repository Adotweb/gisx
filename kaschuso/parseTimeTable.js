let cheerio = require("cheerio");

let fs = require("fs")

let page = fs.readFileSync(__dirname + "/file.html")

let $ = cheerio.load(page)

let table = $(".dhx_cal_data")


let events = table.find(".dhx_cal_event").toArray().map(s => cheerio.load(s))
	.map(event => {

		let eventbody = event(".stpt_event_body")

		let info = eventbody.attr().title.trim().replaceAll(/\s+/g, " ");
	
			

		let [time, rest] = info.split("/").map(s => s.trim())

		

		let room = rest.split(" ")[0]
		rest = rest.replace(room, "").trim()


		let course = rest.split(" ")[0]
		rest = rest.replace(course, "").trim()


		let [coursename, classes, teacher] = course.split("-")
		
		try{
			classes = classes.split(",")
		}catch(e){}


		let LessonObject = {
			time,
			room,
			coursename,
			classes,
			teacher
		}	

		return LessonObject
	})


console.log(events)
