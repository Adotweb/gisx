let cheerio = require("cheerio");

let fs = require("fs")

let page = fs.readFileSync(__dirname + "/file.html")

let $ = cheerio.load(page)


let tableinfo = $("div[style='margin-bottom: 2px;']").html().replaceAll("&nbsp;", "").trim().split(":")[1].trim()

let [classname, KLP1, KLP2] = tableinfo.split(" ")

let KLP = [KLP1, KLP2].join(" ")


let table = $(".dhx_cal_data")

let days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]


let weekdays = [0, 1, 2, 3, 4].map(s => table.find(`div[data-column-index="${s}"]`).toArray().map(s => cheerio.load(s))[0])

	.map((column,i) => {

		let events = column(".dhx_cal_event").toArray().map(s => cheerio.load(s)).map(event => {

			let eventbody = event(".stpt_event_body")

			
			let info = eventbody.attr().title.trim().replaceAll(/\s+/g, " ")
	

			let student = undefined;
			if(info.includes("Schüler")){
				student = info.split("Schüler:")[1].trim()
			}

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
				classes = [classname]
			}
		
			teacher = rest.split(";")[1].split(":")[1].trim()

			let LessonObject = {
				time,
				room,
				coursename,
				classes,
				teacher,
				student,
				day : days[i]
			}	


			return LessonObject
		})


		return events

	})



fs.writeFileSync(__dirname  + `/${classname}_${KLP}.json`, JSON.stringify(weekdays, null, 4))
