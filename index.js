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

app.post("/click", async (req, res) => {

	
	res.send("new Div")

})

app.post("/search", async (req, res) => {

	const {query} = req.body

	
	let names = fs.readFilySync()


	res.send(query)
})

httpServer.listen(PORT)
