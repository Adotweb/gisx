require("dotenv").config();
const {postQuery, getValidatedSesh} = require("./gisx")
const {writeFileSync, appendFileSync} = require("fs")
const path = require("path");


let dates1 = [
	["01.01.2023","31.01.2023"],
	["01.02.2023","28.02.2023"],
	["01.03.2023","31.03.2023"],
	["01.04.2023","30.04.2023"],
	["01.05.2023","31.05.2023"],
	["01.06.2023","30.06.2023"],
	["01.07.2023","31.07.2023"],
	["01.08.2023","31.08.2023"],
	["01.09.2023","31.09.2023"],
	["01.10.2023","31.10.2023"],
	["01.11.2023","31.11.2023"],
	["01.12.2023","31.12.2023"],
	["01.01.2024","31.01.2024"],
];


(async  () => {

	let phpsesh = await getValidatedSesh(process.env.u, process.env.p)

	for(let i = 0; i < dates.length; i++){



	let text =await postQuery(dates[i], phpsesh)

	text = text.replaceAll("\n", " ")


	let posts = [...text.matchAll(/<div class="nms_usrf_news_div">.+?(?=class="nms_usrf_news_div")/g)].map(s => s[0])


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

	
			console.log(posts)
	let jsonPosts = posts.map(s => JSON.stringify(s)).join("\n") + "\n"

	appendFileSync(path.join(__dirname, "postdb.txt"), jsonPosts, "latin1")

	}
})()
