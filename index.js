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
    if (!json || !config.trackFile.isEnabled) {
        //nessun json salvato, primo backup
        console.log("No recent backups...")
        manager.uploadFile(OAuth2, config.localFilePath, id => {
            if (!id) { return }
            saveBackupInfo(id)
        })
        return
    }
    //presente un json, non è il primo backup
    manager.deleteFile(OAuth2, json.backupId, config.trackFile.deletePermanently)
    manager.uploadFile(OAuth2, config.localFilePath, id => {
        if (!id) { return }
        saveBackupInfo(id)
    })
}

function saveBackupInfo(backupId) {
    utils.createDir('./resources')
    utils.saveJsonFile(backupInfoPath, { backupId: backupId }).catch(err => {
        console.log("Error saving backupInfos:", err)
    })
}