const fs = require('fs')
const { promisify } = require('util')

/**
 * Save a given JSON Object, you need to catch errors
 * @param {String} toPath 
 * @param {JSON} json
 */
async function saveJsonFile(toPath, json) {
    return await promisify(fs.writeFile)(toPath, JSON.stringify(json))
}

/**
 * Read a JSON file from the given path
 * @param {String} path 
 * @return {JSON} Return JSON or undefined 
 */
async function readJsonFile(path) {
    return await promisify(fs.readFile)(path).then(data => JSON.parse(data)).catch(err => console.log(err))
}

module.exports = exports

exports.saveJsonFile = saveJsonFile
exports.readJsonFile = readJsonFile