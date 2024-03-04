const app = require("localhostjs")
require("dotenv").config()
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")

const envjson = require("./env.json")

const cookieParser = require("cookie-parser")

const {getPageWithSesh, getValidatedSesh} = require("./gisx")
const {kaschusorouter} = require("./kaschuso/router")

let sesh = undefined;

function getSesh(){

	return sesh

}



express = app.express;

app.rest.use(express.json())
app.rest.use(cookieParser())
app.rest.use(bodyParser())
app.rest.use(express.static(path.join(__dirname, "static")))


app.rest.use("/kaschuso", kaschusorouter)




let people = fs.readFileSync(path.join(__dirname, "gisxdb.txt"), "utf8")
	.split("\n")
	.filter(s => s !== "")
	.map(person => JSON.parse(person))


let posts = fs.readFileSync(path.join(__dirname, "postdb.txt"), "utf8")
	.split("\n")
	.filter(s => s !== "")
	.map(post => JSON.parse(post))
	.reverse()


app.rest.post("/session", async (req, res) => {
	

	res.send(`


		<form action="/id/login" method="POST">

			<input type="text" name="username">

			<input type="text" name="password">

			<button type="submit">Submit</button>
		</form>

		`)

})



app.rest.post("/login", async (req, res) => {

	let {username, password} = req.body

	let token = await getToken(username, password)

	console.log(token)

	res.cookie("token", token)
	
	res.redirect("/")
})

app.rest.post("/search", async (req, res) => {


	let {query, loaded} = req.body


	loaded = loaded ? Number(loaded) + 5 : 0
	

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


		let d1 = new Date(cy.split(" ")[0], cm, cd)

		let d2 = new Date(ny.split(" ")[0], nm, nd)

		return d2 - d1

	}).filter(post => {


		let {text, title, date, author} = post;


		return (author + " " + date + " " + title + " " + text).toLowerCase().includes(query)

	}).slice(0, 5 + loaded)
	


	let formattedPosts = posthits.map(post => `

		<hr>
		<a  ${post.mehr ? 'href="/id/loadmore?' +post.mehr.split("?")[1] + '"' : ""} class="flex flex-col pt-2">
			
			<div class="w-full flex justify-between"><div>${post.title}</div> ${post.date}</div>

			<div class="pt-2">${post.text}</div>

			<div>${post.author}</div>
		</a>

		`).join("")

	let loadmore = `
	<hr>

	<div class="flex pt-2 justify-center">
		<input class="hidden" type="text" value="${loaded}" id="loaded" name="loaded">	
		<button hx-post="/id/search" hx-include="#query, #loaded" hx-target=".results">load more</button>		
	</div>
	`
	res.send(formattedPeople + formattedPosts + (formattedPosts.length > 0  ? loadmore : ""))

})

app.rest.get("/loadmore", async (req, res) => {
	
	let query = "https://gisy.ksso.ch/schulinfo2/navigation/dispatcher.php?" + req.url.split("?")[1]

	let page = await getPageWithSesh(query, sesh)


	res.send(page)
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
const { getToken } = require("./kaschuso/api")
getValidatedSesh(process.env.u, process.env.p).then(session => {
	
	
	sesh = session


	app.listen(env, process.argv[2] == "dev" ? "ws://localhost:5000" : undefined)
})
