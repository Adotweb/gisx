const { Router } = require("express");
const { getToken } = require("./api");

const kaschusorouter = Router();


kaschusorouter.post("/login", async (req, res) => {
	
	let {username, password} = req.body

	console.log(username, password);

	let token = await getToken(username, password).catch(e => console.log(e))

	console.log(token)

	res.send("Hello there")

})

kaschusorouter.get("/session", (req, res) => {
	
	let {token} = req.cookies;


	if(!token){

		res.send(`

		<div class="w-full h-full flex justify-center items-center">

			<form method="POST" action="login" class="w-[300px] flex flex-col p-4 border-black border-2 rounded-md gap-y-4">

				<input type="text" name="username" class="border-2 border-black">
				<input type="text" name="password" class="border-2 border-black">
				<button type="submit">Submit</button>

			</form>

		</div>

			`)

	}

})

module.exports = {
	kaschusorouter

}
