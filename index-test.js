const app = require("localhostjs")
require("dotenv").config()
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")

express = app.express;


app.rest.use(express.json())
app.rest.use(express.static(path.join(__dirname, "static")))



function getSim(data, keyword){

	data = data.toLowerCase();

	keyword = keyword.toLowerCase(); 

	return data.length - data.replace(new RegExp(keyword, "g"), "").length

}




app.rest.post("/search", async (req, res) => {

let {query} = req.body

	query = query.toLowerCase().trim().replaceAll(/\s+/g, " ");
		

	

	let people = fs.readFileSync(path.join(__dirname, "gisxdb.txt"), "utf8")
	
	let names = ([...people.matchAll(/"name":"[^"]*"/g)].map(s => s[0]))	

	let surnames = ([...people.matchAll(/"vorname":"[^"]*"/g)].map(s => s[0]))	

	let ulinks = ([...people.matchAll(/"u_link":"[^"]*"/g)].map(s => s[0]))

	names = names.map(name => name.split(":")[1].replaceAll('"', ""))
	surnames = surnames.map(name => name.split(":")[1].replaceAll('"', ""))
	ulinks = ulinks.map(name => name.split(":")[1].replaceAll('"', ""))




	let fullinfo = surnames.map((s, i) => [s + " " +names[i], ulinks[i]])
	

	let copy = fullinfo.slice();

	copy.sort((a, b) => {
		return getSim(b[0], query) - getSim(a[0], query)
	})

	copy = copy.slice(0, 8)

	copy = copy.map(info => `<a href="/uinfo${info[1]}">${info[0]}</a>`).join("</br>")


	res.send(copy)


})




app.listen({

	id:process.env.id,
	secret:process.env.secret

}, "http://localhost:5000")
