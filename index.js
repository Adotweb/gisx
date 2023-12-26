require("dotenv").config()
const express = require("express");
const app = express();

const httpServer = require("http").createServer(app)

const path = require("path")
const axios = require("axios")

const PORT = process.env.PORT || 5000

const fs = require("fs")

const bodyparser = require("body-parser")

app.use(bodyparser.urlencoded())

app.use(express.static(path.join(__dirname, "static")))

const {getValidatedSesh, getPageWithSesh} = require("./gisx")


let phpsesh = ""


app.post("/click", async (req, res) => {

	
	res.send("new Div")

})


function getSim(data, keyword){

	data = data.toLowerCase();

	keyword = keyword.toLowerCase(); 

	return data.length - data.replace(new RegExp(keyword, "g"), "").length

}

app.post("/search", async (req, res) => {

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



const uinfoRouter = express.Router() 


uinfoRouter.get("/*", async (req, res) => {

	console.log(req.originalUrl)
	

	let userpage = await getPageWithSesh("https://gisy.ksso.ch" + req.originalUrl.replace("/uinfo", ""), phpsesh)


	res.send(userpage)

})

app.use("/uinfo", uinfoRouter)


httpServer.listen(PORT, async () => {
	console.log(process.env.u, process.env.p)
	phpsesh = await getValidatedSesh(process.env.u, process.env.p)
	console.log(phpsesh)
})
