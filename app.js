const http = require('http')
const mongoose = require('mongoose')
require('dotenv').config()
const { adminRegDB } = require('./app/middlewares/adminReg')

//my modules
const routers = require('./app/routes')

const server = http.createServer((req, res) => {
  routers(req, res)
})

const PORT = process.env.PORT || 3002

async function start () {
  await mongoose.connect('mongodb+srv://vt5496:Node1234@cluster0.dzyso.mongodb.net/users',
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }, function (err) {
      if (err) {throw err}
      console.log('Successfully connected')
    })
  const db = mongoose.connection
  await db.once('open', function () {console.log('Connect DB')})
  await adminRegDB(process.env.ADMIN)
  server.listen(PORT, () => {
    console.log(`Server started at ${PORT} port...`)
  })
}

start()