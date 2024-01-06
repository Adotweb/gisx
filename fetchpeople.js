const path = require("path")
const {writeFileSync, readFileSync, appendFileSync} = require("fs")
require("dotenv").config()
const cheerio = require("cheerio")

let letters = "abcdefghijklmnopqrstuvwxyzäöü"



let {getPageWithSesh, getQueriedPage,  getValidatedSesh} = require("./gisx");


(async () =>  {

	let phpsesh = await getValidatedSesh(process.env.u, process.env.p)
	for(let i = 0; i < letters.length; i++){

		for(let j = 0; j < letters.length; j++){
			let query = letters[i] + letters[j]
			
			console.log(query + " Start:")	



			let queriedPage = await getQueriedPage(query, phpsesh)
	

			let $ = cheerio.load(queriedPage)

			let s = $("tr.nms_usrf_table_row").toArray().map(k => $(k).text().replace(/(\n)+/g, "\n"))
				


			s = s.map((p, i) => (i % 2 == 0) ? [p, s[i + 1]]: undefined).filter(s => s !== undefined)


			let users = s.map(userarr => {

				let [info, gisy] = userarr.map(s => s.split("\n").filter(s => s !== "")); 

				let name = info[0]
				let vorname = info[1] 
				let strasse = info[2]; 
				let ort = info[3]


				let uid = gisy[0];
				let klasse = gisy[1];
				let email = gisy[2]
			
				info = undefined	
				if(klasse && klasse.includes("@")){
					email = klasse

					klasse = undefined	
					info = gisy[2]
				}

				return {
					name,
					vorname,
					strasse, 
					ort,
					uid, 
					klasse, 
					email,
					info
				}

			}).filter(user => user.name.toLowerCase().slice(0, 2) == (query.toLowerCase()))
			
			let queriedUsers = users.map(user => JSON.stringify(user)).join("\n") 
			queriedUsers += queriedUsers ? "\n" : ""
			
			console.log(queriedUsers)

			appendFileSync("./gisxdb.txt", queriedUsers, "utf8")
		}



	}



})()
