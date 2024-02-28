const {generateBid} = require("./bid")

let input = process.argv[2]
let result = generateBid(input)

console.table({
	input, 
	result
})
