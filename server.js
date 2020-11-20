const express = require('express')
const app = express()
const logger = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./api/utils/config')
const db = require('./api/utils/db')
const v1Routes = require('./routes/v1Routes')
const v1RoutesAdmin = require('./routes/v1RoutesAdmin')

const fs = require('fs')

var server
if (config.isSSL) {
  var privateKey = fs.readFileSync('./ssl/vdsta.key', 'utf8');
  var certificate = fs.readFileSync('./ssl/vdsta.pem', 'utf8');
  console.log(privateKey, certificate)
  var credentials = { key: privateKey, cert: certificate };
  server = require('https').createServer(credentials, app);
} else {
  server = require('http').Server(app);
}


logger.token('date', () => {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
})
app.use(logger('[:date[]] :remote-addr ":method :url HTTP/:http-version" :status '))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// app.use('/assets', express.static('assets'))
// app.use('/static', express.static('static'))

app.use('/api/v1', v1Routes)
app.use('/api/v1/admin', v1RoutesAdmin)

app.use('/website/', express.static('website'))
app.get('/website/*', (req, res) => {
  // res.sendFile('./website/index.html')
  res.sendfile('./website/index.html')
})

// app.use('/assets', express.static('web'))
// app.use('/', express.static('web'))
// app.get('/*', (req, res) => {
// res.sendfile('./web/index.html')
// })

// app.use('/assets', express.static('admin-panel'))
// app.use('/', express.static('admin-panel'))
// app.get('/*', (req, res) => {
// res.sendfile('./admin-panel/index.html')
// })

app.set('view engine', 'ejs');

db.getConnection()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`Server Started at http://${config.host}:${config.port}\n`)
    })
  })
  .catch((error) => {
    console.log(error)
  })

module.exports = app;