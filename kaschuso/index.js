const {getTimeTables} = require("./pupp-api")


const classlist = require("./classlist.json")



getTimeTables(process.argv[2], process.argv[3], classlist)
