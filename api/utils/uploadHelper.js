
const config = require('./config')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: config.awsAccesskey,
  secretAccessKey: config.awsSecretkey
})

const s3 = new AWS.S3()
const promise = require('bluebird')
const sharp = require('sharp')
const fs = require('fs')

class UploadHelper {
  uploadOnS3 (path, file) {
    return new promise((resolve, reject) => {
      let params = {
        Bucket: config.s3bucketName,
        Key: path,
        Body: file,
        ACL: 'public-read'
      }
      s3.putObject(params, (error, result) => {
        if (error) {
          console.log(error)
          reject('ERROR_UPLOADING_S3')
        } else {
          console.log(result)
          resolve(result)
        }
      })
    })
  }

  deleteFromS3 (path) {
    return new promise((resolve, reject) => {
      let params = {
        Bucket: config.s3bucketName,
        Key: path.replace(config.s3uploadURL, '')
      }
      s3.deleteObject(params, (error, result) => {
        if (error) {
          console.log(error)
          reject('ERROR_DELETE_S3')
        } else {
          console.log(result)
          resolve(result)
        }
      })
    })
  }

  createImageThumbnail (imageData) {
    return new promise((resolve, reject) => {
      sharp(imageData)
        .resize(200)
        .toBuffer()
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject('COMPRESSION_ERROR')
        })
    })
  }

  tempUpload (req, res, next) {
    console.log('========FILE=========')
    console.log(req.file)

    console.log('=======BODY=====1=====')
    console.log(req.body)
    if (req.file) {
      fs.readFile(req.file.path, (error, data) => {
        console.log('=======BODY=====2=====')
        console.log(req.body)

        if (error) {
          console.log(error)
        }
        req.files = { [req.file.fieldname]: { data: '' } }
        req.files[req.file.fieldname].data = data
        req.files[req.file.fieldname].mimetype = req.file.mimetype
        req.files[req.file.fieldname].name = req.file.originalname
        fs.unlinkSync(req.file.path)
        next()
      })
    } else {
      next()
    }
  }
}

module.exports = new UploadHelper()
