let cheerio = require("cheerio");

let fs = require("fs")

let page = fs.readFileSync(__dirname + "/file.html")

let $ = cheerio.load(page)

let table = $(".dhx_cal_data")


let weekdays = [0, 1, 2, 3, 4].map(s => table.find(`div[data-column-index="${s}"]`).toArray().map(s => cheerio.load(s))[0])

	.map((column,i) => {

		let events = column(".dhx_cal_event").toArray().map(s => cheerio.load(s)).map(event => {

			let eventbody = event(".stpt_event_body")



			console.log(eventbody.attr(), i)
		})
			//.find(".stpt_event_body")




		console.log(events)
	})


		


let events = table.find(".dhx_cal_event").toArray().map(s => cheerio.load(s))
	.map((event, i) => {

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
	
		if(!teacher){
			classes = []
		}
		
		teacher = rest.split(";")[1].split(":")[1].trim()

		let LessonObject = {
			time,
			room,
			coursename,
			classes,
			teacher,
			index: i
		}	

		return LessonObject
	})



let bytime = [

]


//events = events.filter(s => s.time == "07:35 - 08:20")




