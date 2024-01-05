const app = require("localhostjs")
require("dotenv").config()
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")

const envjson = require("./env.json")
const cookieParser = require("cookie-parser")

const {getPageWithSesh, getValidatedSesh} = require("./gisx")

express = app.express;

app.rest.use(express.json())
app.rest.use(cookieParser())

app.rest.use(express.static(path.join(__dirname, "static")))



function getSim(data, keyword){

	data = data.toLowerCase();

	keyword = keyword.toLowerCase(); 

	return data.length - data.replace(new RegExp(keyword, "g"), "").length

}

app.rest.get("/session", (req, res) => {


	if(!req.cookies.session) return res.redirect("/account/login.html")

	return res.send("logged in!")
})

let people = fs.readFileSync(path.join(__dirname, "gisxdb.txt"), "utf8")
	.split("\n")
	.filter(s => s !== "")
	.map(person => JSON.parse(person))

app.rest.post("/search", async (req, res) => {

let {query} = req.body

	query = query.toLowerCase().trim().replaceAll(/\s+/g, " ");
		
	

	let hits = people.filter(person => {

		//email is the class for some weird reason is fixed in next version i promise ...

		let {name, vorname, email} = person




		return (name + " " + vorname + " " + email).toLowerCase().includes(query)

	})	


	hits = hits.splice(0, 5)


	console.log(hits)


	let formatted = hits.map(person => `
		<a class="flex justify-between" href="${person.u_link}">${person.vorname} ${person.name} <div>${person.email}</div></a>
		`).join("")

	res.send(formatted)

})
const uinfoRouter = express.Router() 


uinfoRouter.get("/*", async (req, res) => {

	

	let userpage = await getPageWithSesh("https://gisy.ksso.ch" + req.originalUrl.replace("/uinfo", ""), phpsesh)


	res.send(userpage)

})

app.rest.use("/uinfo", uinfoRouter)


app.listen({

	id:envjson.id,
	secret:envjson.secret

}, "http://localhost:5000")
