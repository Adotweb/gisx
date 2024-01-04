require("dotenv").config();
const {postQuery, getValidatedSesh} = require("./gisx")
const {writeFileSync} = require("fs")
const path = require("path");


(async  () => {

	let phpsesh = await getValidatedSesh(process.env.u, process.env.p)



	let text =await postQuery([
		"01.01.2023",
		"31.01.2023"
	], phpsesh)

	text = text.replaceAll("\n", " ")

	let posts = [...text.matchAll(/<div class="nms_usrf_news_div">.+?(?=<div class="nms_usrf_news_div">)/g)].map(s => s[0])


	posts = posts.map(post => {
	

		return post.slice(post.indexOf(">") + 1, post.lastIndexOf("</div>"))
			
		
	}).map(post => {


		let textmatches = [...post.matchAll(/>[^<]*</g)]
			.map(s => s[0])
			.map(s => s.slice(1, s.length -1))
			.map(s => s.trim())
			.filter(s => s != "")


		let linkmatches = [...post.matchAll(/href="[^"]*"/g)]
			.map(s => s[0])
			.map(s => s.replace("href=","").replaceAll(`"`, ""))
		


		return {textmatches, linkmatches}


	}).map(({textmatches, linkmatches}) => {

		let post = textmatches	


		let authorLink = linkmatches[linkmatches.length - 1]

		let addressaten = linkmatches[linkmatches.length - 3]

		let mehr = linkmatches[linkmatches.length - 4]


		let author = post[post.length - 1];

		let date = post[0]

		let title = post[1];

		let text = post[2]

		return {
			author, 
			date, 
			title, 
			text,
			authorLink,
			addressaten,
			mehr
		}
	})

	console.log(posts.filter(p => !!p.mehr))

	writeFileSync(path.join(__dirname, "result.html"), text, "latin1")
})()
