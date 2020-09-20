const Datauri = require("datauri/parser")

const datauri = new Datauri()


module.exports = (filename, buffer) => {

    return datauri.format(filename, buffer).content
}