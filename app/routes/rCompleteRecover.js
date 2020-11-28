const models = require('../models')
const bcrypt = require('bcryptjs')

async function completeRecover (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      default:
        res.end(false)
    }
  } catch (e) {
    console.log('Error in rCompleteRecover.js completeRecover')
    res.writeHead(400)
    res.write(e.message)
    res.end()
  }

  async function postMethod (req, res) {
    try {
      //create User model
      console.log(req.parsedData)
      const uuid = req.parsedData.uuid
      //check method and find object with uuid
      let uuidObj;
      if (req.parsedData.method === 'invite') {
        uuidObj = await models.Invitation.findOne({
          uuid
        })
      } else if (req.parsedData.method === 'recover') {
        uuidObj = await models.Recover.findOne({
          uuid
        })
      }

      //check uuidObj
      if (!uuidObj) {
        throw new Error(`You can't ${req.parsedData.method}`)
      }

      //find user for change password
      const userObj = await models.User.findOne({
        _id: uuidObj.user_id
      })

      //change password, save, and delete uuid
      userObj.password = bcrypt.hashSync(req.parsedData.password, process.env.SALT)
      await userObj.save()
      await uuidObj.delete()

      //response
      const contentType = 'text/html'
      res.writeHead(200, {
        'Content-Type': contentType
      })
      console.log(`Password success changed for ${userObj.email}`)
      res.end()

      //if Error
    } catch (e) {
      res.writeHead(400)
      res.write(e.message)
      res.end()
    }
  }
}

module.exports = completeRecover