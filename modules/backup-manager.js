const fs = require('fs')
const { google } = require('googleapis')
const path = require('path')
const utilities = require('./utilities')
const { promisify } = require('util')

module.exports = exports


exports.deleteFile = deleteFile
exports.uploadFile = uploadFile

/**
 * 
 * @param {String} auth  OAuth2
 * @param {boolean}
 * @param {Array<String>} fileIds String, you get it when uploading a file
 */
async function deleteFile(auth, deletePermanently, fileIds) {
    const drive = google.drive({ version: 'v3', auth })
    const driveDelete = promisify(drive.files.delete)
    console.log("Deleting files...")
    const promises = fileIds.map(id => {
        return driveDelete({
            'fileId': id
        })
    })
    try {
        await Promise.all(promises)
        console.log("Files deleted!")
        if (deletePermanently) {
            drive.files.emptyTrash()
        }
    } catch (err) {
        console.error("An error occurred on deleteFile", err)
    }
}


/**
 * 
 * @param {OAuth2} auth
 * @param {String} localPath
 * @param {Boolean} aioUpload
 * @return {Array<String>} return the file id on Google Drive
 */
async function uploadFile(auth, localPath, aioUpload = true) {
    console.log("Uploading file/s...")
    const drive = google.drive({ version: 'v3', auth })
    if (utilities.isDirectory(localPath)) {
        localPath = await utilities.listFiles(localPath)
    } else {
        localPath = [localPath]
    }

    const createFile = promisify(drive.files.create)
    let promises = []
    for (const element of localPath) {
        const fileMetadata = {
            'name': path.basename(element)
        }
        const media = {
            body: fs.createReadStream(element)
        }
        const promise = createFile({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        })
        if (typeof aioUpload === 'boolean' && !aioUpload) {
            const file = await promise
            console.log(`File ${path.basename(element)} uploaded! File Id: ${file.data.id}`)
            promises.push(file)
        } else {
            promises.push(promise)
        }
    }

    try {
        return await Promise.all(promises).then(arrOfFiles => {
            console.log("Upload completed!")
            const ids = arrOfFiles.map(file => file.data.id)
            console.log('File Ids: ', ids)
            return ids
        })
    } catch (err) {
        console.log(`An error occured uploading files. Specific error: ${err}`)
        return null
    }
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth })
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err)
        const files = res.data.files;
        if (files.length) {
            console.log('Files:')
            files.map((file) => {
                console.log(`${file.name} (${file.id})`)
            });
        } else {
            console.log('No files found.');
        }
    })
}