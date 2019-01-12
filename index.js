const auth = require('./modules/authentication')
const manager = require('./modules/backup-manager')
const utils = require('./modules/utilities')

const backupInfoPath = './resources/lastBackupInfo.json'

main()

async function main() {
    const config = await utils.readJsonFile('./config.json')
    if (!config) { return }
    const OAuth2 = await auth.loadAuth().catch(err => {
        console.log('Error loading client secret file:', err)
    })
    if (!OAuth2) { return }
    const json = await utils.readJsonFile(backupInfoPath)
    if (!json) {
        //nessun json salvato, primo backup
        console.log("Nessun backup recente...")
        manager.uploadFile(OAuth2, config.fileNameOnDrive, config.fileMimeType, config.localFilePath, id => {
            if (!id) { return }
            utils.saveJsonFile(backupInfoPath, { backupId: id }).catch(err => {
                console.log("Error saving backupInfos:", err)
            })
        })
        return
    }
    //presente un json, non è il primo backup
    manager.deleteFile(OAuth2, json.backupId, true)
    manager.uploadFile(OAuth2, config.fileNameOnDrive, config.fileMimeType, config.localFilePath, id => {
        if (!id) { return }
        utils.saveJsonFile(backupInfoPath, { backupId: id }).catch(err => {
            console.log("Error saving backupInfos:", err)
        })
    })
}