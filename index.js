const auth = require('./modules/authentication')
const manager = require('./modules/backup-manager')
const utils = require('./modules/utilities')

const uploadedInfoPath = './resources/uploadedInfo.json'

main()

async function main() {
    let config, OAuth2
    try {
        config = await utils.readJsonFile('./config.json')
        OAuth2 = await auth.loadAuth()
    } catch(err) {
        console.error(`An error occurred. Specific error: ${err}`)
    }
    const json = await utils.readJsonFile(uploadedInfoPath)
    if (!json || !config.trackFile.isEnabled) {
        //nessun json salvato, primo upload
        console.log("No recent uploads...")
        await manager.uploadFile(OAuth2, config.filesInfo.localPath).then(ids => {
            if (!ids) { return }
            saveUploadedInfo(ids)
        })
        return
    }
    //presente un json, non è il primo upload
    console.log("Not first upload...")
    await manager.deleteFile(OAuth2, config.trackFile.deletePermanently, json)
    await manager.uploadFile(OAuth2, config.filesInfo.localPath).then(ids => {
        if (!ids) { return }
        saveUploadedInfo(ids)
    })
}

/**
 * TODO
 * @param {Array<String>} infoArr 
 */
function saveUploadedInfo(infoArr) {
    utils.createDir('./resources')
    utils.saveJsonFile(uploadedInfoPath, infoArr).catch(err => {
        console.log("Error saving backupInfos:", err)
    })
}