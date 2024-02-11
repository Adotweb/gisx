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
		<a class="flex justify-between" href="/id/user/${person.uid}">${person.vorname} ${person.name} <div>${person.klasse || person.uid}</div></a>
		`).join("")

	if(query.length == 0){
		formattedPeople = ""
	}


	let posthits = posts.sort((cur, next) => {
		
		[cd, cm, cy] = cur.date.split(".");
		[nd, nm, ny] = next.date.split(".");

		console.log(cd, cm, cy)	

		let d1 = new Date(cy.split(" ")[0], cm, cd)

		let d2 = new Date(ny.split(" ")[0], nm, nd)

		return d2 - d1

	}).filter(post => {


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
	

	res.send("hello")
})


app.rest.get("/user/:user", async (req, res) => {

	let user = req.params.user

	user = people.filter(s => s.uid === user)[0]


	let page = `

		<div class="flex flex-col w-[200px]">
			<div>${user.name} ${user.vorname}</div>
			<div>${user.uid}</div>
			<div>${user.email}</div>
			<div>${user.klasse ? user.klasse :""}</div>
			
			${user.strasse != "***" ? 

				`<div>${user.strasse} ${user.ort}</div>` :
				``
			}
			
			${user.tel != "***" ? 

				`<div>${user.tel}</div>` :
				``
			}

		</div>

	`;

	res.send(page)

})


const env = require("./env.json")

app.listen(env, "ws://localhost:5000")
//app.listen(env)
