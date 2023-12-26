const path = require("path")
const {writeFileSync, readFileSync} = require("fs")



let letters = "abcdefghijklmnopqrstuvwxyz"



let {getPageWithSesh, getQueriedPage,  getValidatedSesh} = require("./gisx");



(async () =>  {

	let phpsesh = await getValidatedSesh("u504207", "p186119")
	for(let i = 0; i < letters.length; i++){

		for(let j = 0; j < letters.length; j++){
			let query = letters[i] + letters[j]
			
			console.log(query + " Start:")	



			let queriedPage = await getQueriedPage(query, phpsesh)

	
	
			let result = queriedPage.split("@ksso.ch</a>").map(s => s + "@ksso.ch</a>").filter(s => s.includes("tr"))	

			let users = ""
	
			for(let i = 0; i < result.length; i++){

				let p = result[i].replace(/(\n)/g, "");




	
				p = (p.split("tr").reverse().map(s => s + "tr").slice(0, 3).reverse().join(""))

				p = "<tr" +  p.substring(0, p.length - 2)

				
				let links = [...p.matchAll(/href="([^"])*"/g)].map(res => res[0]).map(res => res.replace("href=", "").replaceAll('"', ""))

				p = p.split(/<([^<])*>/g).filter(s => s.length > 1)


				


				if(p.length < 7) continue


				if(p[0].substring(0, query.length).toLowerCase() !== query) continue

				let user = {
					name:p[0],
					vorname:p[1],
					stundenplan:p[2],
					ort:p[3],
					tel:p[4],
					id:p[5],
					email:p[6],
		
					email_link:links[links.length - 1],
					u_link:links[0],
				}

				users += JSON.stringify(user) + "\n"
				

				console.log(query + " Done!")
			}	
			
			writeFileSync(path.join(__dirname, "gisxdb.txt"), 
				readFileSync(path.join(__dirname, "gisxdb.txt"), "utf8") + users,
				"utf8"
			)
				

		}

	}



})()
