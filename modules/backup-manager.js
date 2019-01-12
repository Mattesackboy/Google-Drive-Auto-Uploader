const fs = require('fs')
const { google } = require('googleapis')

module.exports = exports


exports.deleteFile = deleteFile
exports.uploadFile = uploadFile


/**
 * 
 * @param {String} auth  OAuth2
 * @param {String} fileId String, you get it when uploading a file
 * @param {boolean}
 */
function deleteFile(auth, fileId, deletePermanently) {
    const drive = google.drive({ version: 'v3', auth })
    drive.files.delete({
        'fileId': fileId
    })
    if (deletePermanently) {
        drive.files.emptyTrash()
    }
}


/**
 * 
 * @param {OAuth2} auth 
 * @param {String} fileName 
 * @param {String} mimeType 
 * @param {String} filePath
 * @param {function} callback
 * @return {String} return the file id on Google Drive
 */
function uploadFile(auth, fileName, mimeType, localFilePath, callback) {
    console.log("Upload file in corso...")
    const drive = google.drive({ version: 'v3', auth })
    const fileMetadata = {
        'name': fileName
    }
    const media = {
        mimeType: mimeType,
        body: fs.createReadStream(localFilePath)
    }
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            console.error(err)
            return callback()
        }
        console.log("Upload completato!")
        console.log('File Id: ', file.data.id)
        return callback(file.data.id)
    })
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