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


function createDir(path) {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path)
    }
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}

async function listFiles(path) {
    if (isDirectory(path)) {
        const readDir = promisify(fs.readdir)
        return await readDir(path).then(items => {
            return items.map(file => {
                return `${path}/${file}`
            })
        })
    }
    return []
}

module.exports = exports

exports.saveJsonFile = saveJsonFile
exports.readJsonFile = readJsonFile
exports.createDir = createDir
exports.isDirectory = isDirectory
exports.listFiles = listFiles