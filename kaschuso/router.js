const { Router } = require("express");

const kaschusorouter = Router();


kaschusorouter.post("/login", (req, res) => {
	
	let {username, password} = req.body


	res.send("Hello there")

})

module.exports = {
	kaschusorouter

}
