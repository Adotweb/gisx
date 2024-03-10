const { Router } = require("express");
const { getValidatedSession } = require("./pupp-api");

const kaschusorouter = Router();


kaschusorouter.post("/login", async (req, res) => {
	
	let {username, password} = req.body

	console.log(username, password);

	let token = await getValidatedSession(username, password)
	

	console.log(token)
	
	res.cookie("token", token)
	res.send("hello there")
})

kaschusorouter.get("/session", (req, res) => {
	
	let {token} = req.cookies;


	if(!token){

		res.send(`

		<div class="w-full h-full flex justify-center items-center">

			<form method="POST" action="/id/kaschuso/login" class="w-[300px] flex flex-col p-4 border-black border-2 rounded-md">
	

				<label for="" class="w-full font-bold text-lg underline pb-4">Kiss</label>
					
				<label for="username">Username</label>
				<input type="text" name="username" class="border-b-2 border-black bg-transparent outline-none">
				<label for="passowrd" class="pt-4">Password</label>
				<input type="password" name="password" class="border-b-2 border-black bg-transparent outline-none">
				<button type="submit" class="w-full mt-2 p-2 rounded-md font-bold bg-black text-white">Submit</button>

			</form>

		</div>

			`)

	}

})



module.exports = {
	kaschusorouter

}
