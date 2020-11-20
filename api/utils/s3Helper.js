const config = require('./config')
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey
})
const s3 = new AWS.S3()
const promise = require('bluebird');

class S3 {
    uploadImageOnS3(path, file) {
        return new promise((resolve, reject) => {
            let fileName;
            let params;
            fileName = path + Date.now() + "-" + file.originalname.replace(/\s+/g, ''),
                params = {
                    Bucket: config.s3.bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ACL: 'public-read'
                }
            console.log('fileName', fileName)
            s3.putObject(params, (error, result) => {
                if (error) {
                    console.log(error)
                    reject({ code: 0, message: 'ERROR_UPLOADING_IMAGE' })
                } else {
                    console.log(result)
                    resolve(`${config.s3.uploadURL}/${fileName}`)
                }
            })
        })
    }

    deleteImageFromS3(fullPath) {
        console.log("fulpath===============", fullPath)
        if (!fullPath) {
            console.log("PATH NOT FOUND")
        } else {
            return new promise((resolve, reject) => {
                let fileName = fullPath.replace(config.s3.uploadURL + '/', '')
                let params = {
                    Bucket: config.s3.bucketName,
                    Key: fileName
                }
                s3.deleteObject(params, function (err, data) {
                    if (err) {
                        console.log("error===========", err)
                        console.log(err, err.stack); // an error occurred
                        reject()
                    } else {
                        console.log("delete image data", data)
                        console.log("Delete image successfully...");
                        resolve()
                    }
                });
            })
        }
    }

}

module.exports = new S3()
