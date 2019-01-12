# Google Drive - Auto Uploader

You can use this Script to automatically upload a file to your Google Drive Account. 
For now, this script it's only meant for backing up a VPS and deleting the old one on Google Drive.
It's more like a private project.

## Setup

After cloning this project, you need to run:
```js
npm i
```

After, you first need to get the _credentials.json_ from [Google Drive Docs](https://developers.google.com/drive/api/v3/quickstart/nodejs), you just need to follow the first step to get it.

Then, setup the config.json.

```js
{
    "deletePermanently": true,
    "fileMimeType": "image/jpeg",
    "fileNameOnDrive": "foo.jpg",
    "localFilePath": "./files/foo.jpg"
}
```
1) deletePermanently: If true, for every execution the trash can of Google Drive will be emptied.
2) fileMimeType: The file [Mime-Type](https://www.freeformatter.com/mime-types-list.html) you will upload. If you want to upload a _.tar.gz_ you need to set it to "application/gzip".
3) fileNameOnDrive: The file will be saved with this name Google Drive.
4) localFilePath: The path of the file that will be uploaded.

Do not delete _resources folder_, or delete files in it.

_Files folder_ can be deleted, it contains a file just to test the script.

## Usage

After setup, you can run this command to trigger the script

```js
node .
```

## License
[MIT](https://choosealicense.com/licenses/mit/)