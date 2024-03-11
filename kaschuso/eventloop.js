const express = require("express");
const puppeteer = require("puppeteer")
const app = express();
const fs = require("fs")

const classlist = require("./classlist.json")



function parseDate(dateStr) {
    return new Date(dateStr);
}

// Function to sort events into a week array
function sortEventsIntoWeek(events) {
    const days = [[], [], [], [], [], [], []]; // Monday, Tuesday, ..., Sunday

    // Sort events into days
    events.forEach(event => {
        const date = parseDate(event.start_date);
        const dayOfWeek = date.getDay() - 1;
        days[dayOfWeek].push(event);
    });

    // Sort events within each day
    days.forEach(day => {
        day.sort((a, b) => parseDate(a.start_date) - parseDate(b.start_date));
    });

    // Output sorted events
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekArray = [];

    days.forEach((events, index) => {
        const dayObj = {
            day: dayNames[index],
            events: events.map(event => ({
                start: parseDate(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                end: parseDate(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                zimmer: event.zimmerkuerzel,
                fach: event.fachkuerzel,
                lehrer: event.lehrerkuerzelname,
                kurs: event.kurskuerzel,
                klasse: event.klasse
            }))
        };
        weekArray.push(dayObj);
    });

    return weekArray;
}
app.use(express.json())

let globalpage = undefined
let info = undefined

const getPage = () => globalpage
const getInfo = () => info


app.use(async (req, res, next) => {

	let timeStart = performance.now()

	let {username, password} = req.body

	let page = getPage();

	let cookies = await page.cookies()

	for(let i = 0; i < cookies.length;i++){

		let cookie = cookies[i]
		await page.deleteCookie({name:cookie.name, domain: cookie.domain})

	}


	await page.goto("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso")
	await page.waitForSelector('input[name="userid"]')

	
	await page.type('input[name="userid"]', username)

	await page.type('input[name="password"]', password)

	await page.click('button[type="submit"]')

	await page.waitForSelector(".fa-graduation-cap.fas.fa-lg")

	let pagetext = await page.content()
	cookies = await page.cookies()

	let [id, transid] = pagetext.match(/&id=[^"]+&transid=[^"]+"/g)[0].replaceAll('"', "").split("&").filter(s => s.length > 0).map(s => s.split("=")[1])

	


	let timeStop = performance.now()

	let took  = timeStop - timeStart



	info = ({
		SCDID_S:cookies.filter(({name}) => name == "SCDID_S")[0].value,
		PHPSESSID:cookies.filter(({name}) => name == "PHPSESSID")[0].value,
		id,
		transid,
		took
	})

		console.log(info)

	
	next()


})

app.post("/timetable", async (req, res) => {

	console.time()
	let {"class":classname} = req.body
	let info = getInfo()
	
	let page = getPage();

	
	let classid = classlist.filter(s => s[0] == classname)[0]

	console.log(classid[0], classid[1])

	let url = `https://kaschuso.so.ch/ksso/index.php?pageid=22207&id=${info.id}&transid=${info.transid}&listindex_s=${classid[1]}`	


	await page.goto(url)

	let timetable = sortEventsIntoWeek([])

	try{
		await page.waitForSelector(".stpt_event_date", {timeout:5000})
	}catch{

		res.send(timetable)	
		console.timeEnd()

		return
	}


	let events = await page.evaluate(() => {
		return scheduler.getEvents().map(({start_date, end_date, fachkuerzel, lehrerkuerzelname, kurskuerzel, klasse, zimmerkuerzel}) => ({

			zimmerkuerzel, 
			start_date:start_date.toString(), 
			end_date:end_date.toString(), 
			fachkuerzel, 
			lehrerkuerzelname, 
			kurskuerzel, 
			klasse, 


		}))
	});

	timetable = sortEventsIntoWeek(events)

	res.send(timetable)
	console.timeEnd()
})


app.post("/grades", async (req, res) => {


	console.time()
	let page = getPage()
	let info = getInfo()	

	let url = `https://kaschuso.so.ch/ksso/index.php?pageid=21311&id=${info.id}&transid=${info.transid}`
	await page.goto(url)


	await page.waitForSelector(".div_noten_outer")


	let grades = await page.evaluate(() => {

		let p = [...document.querySelectorAll("tbody > tr")].map(({className, innerText}) => ({className, innerText}));
		
		let titles = []
	
		let infos = p.filter((s, i) => {
			if(s.className.split("_")[2] == "detailrow"){
				titles.push(p[i - 1])
				return true
			}
			return false
		})

		infos = infos.map(({innerText}) => innerText).map(info => info.replace(/\s+/g, " ").trim().split(" ").slice(4).join(" ")).map(info => {

			let copy = info.split(" ")
		
			copy = copy.slice(0, copy.length - 3).join(" ")
		
			copy = copy.split(/(?=[0-9]{2}\.[0-9]{2}\.[0-9]{4})/g)
			
			
			return copy
		})

		titles = titles.map(({innerText}) => innerText).map(title => title.split(/\t/g).slice(0, 2).map(s => s.replaceAll("\n", " ")))

		return {
			infos, titles
		}
	})

	let gradesinfo = grades.infos



	gradesinfo = gradesinfo.map(subject => {
		return subject.map(gradeobject => {

			if(!gradeobject){
				return ""
			}

			let datum = gradeobject.split(" ")[0]
			gradeobject = gradeobject.replace(datum, "").trim().split(" ")
	
			let amd = datum.split(".")
			let date = new Date(`${amd[1]}.${amd[0]}.${amd[2]}`)
			let now = new Date() 


			if(now < date) return ""

			let gewichtung = gradeobject[gradeobject.length - 1]
			gradeobject = gradeobject.slice(0, gradeobject.length - 1).join(" ").trim()

			let details = undefined
			if(gradeobject.includes("Details")){
				details = "Details" + gradeobject.split("Details")[1]
				gradeobject = gradeobject.replace(details, "").trim()

				details = details.replace("NotePunkte", "Note, Punkte")

			}
		
			let grade = undefined
			let title = undefined


			gradeobject = gradeobject.split(" ")
			grade = gradeobject[gradeobject.length - 1] 

			gradeobject = gradeobject.join(" ").replace(grade, " ")
			title = gradeobject	

			return {
				title,
				grade,
				datum, 
				details,
				gewichtung,
				gradeobject
			}
		}).filter(s => s!== "")

	})


	

	res.send(gradesinfo)
	console.timeEnd()
})

;(async ( )=> {

	let browser = await puppeteer.launch()

	globalpage = await browser.newPage();

	

	app.listen(3000)



})()
