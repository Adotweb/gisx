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
app.rest.use(bodyParser())
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


let posts = fs.readFileSync(path.join(__dirname, "postdb.txt"), "utf8")
	.split("\n")
	.filter(s => s !== "")
	.map(post => JSON.parse(post))
	.reverse()

app.rest.post("/search", async (req, res) => {

let {query} = req.body

	query = query.toLowerCase().trim().replaceAll(/\s+/g, " ");
		
	

	let hits = people.filter(person => {

		//email is the class for some weird reason is fixed in next version i promise ...

		let {name, vorname, uid, klasse} = person




		return (vorname + " " + name + " " + uid + " " + klasse).toLowerCase().includes(query)

	})	

	let limit = 5 

	if(hits.length < 30){
		limit = hits.length
	}

	hits = hits.splice(0, limit)

	


	let formattedPeople = hits.map(person => `
		<a class="flex justify-between" href="${person.u_link}">${person.vorname} ${person.name} <div>${person.klasse || person.uid}</div></a>
		`).join("")

	if(query.length == 0){
		formattedPeople = ""
	}


	let posthits = posts.filter(post => {

		let {text, title, date, author} = post;

		return (author + " " + date + " " + title + " " + text).toLowerCase().includes(query)

	}).slice(0, 5)

	let formattedPosts = posthits.map(post => `

		<hr>
		<a ${post.mehr ? 'href="' + post.mehr + '"' : ""} class="flex flex-col pt-2">
			
			<div class="w-full flex justify-between"><div>${post.title}</div> ${post.date}</div>

			<div class="pt-2">${post.text}</div>

			<div>${post.author}</div>
		</a>

		`).join("")




	res.send(formattedPeople + formattedPosts)

})


app.rest.get("/loadmore", (req, res) => {
	

	console.log(req.params)

	res.send("hello")
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
