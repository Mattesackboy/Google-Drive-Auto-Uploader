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
    "trackFile": {
        "isEnabled": true,
        "deletePermanently": true
    },
    "localFilePath": "./files/foo.jpg"
}
```
1) trackFile:
* isEnabled: If `true`, the script will save the the uploaded file's ID, and in the next execution will delete it from Google Drive.
* deletePermanently: If trackFile `isEnabled` is setted to `true` and this option is enabled too, for every execution the trash can of Google Drive will be emptied.
2) localFilePath: The path of the file that will be uploaded.

Do not delete _resources folder_, or delete files in it.

_Files folder_ can be deleted, it contains a file just to test the script.

## Usage

After setup, you can run this command to trigger the script

```js
node .
```

## License
[MIT](https://choosealicense.com/licenses/mit/)