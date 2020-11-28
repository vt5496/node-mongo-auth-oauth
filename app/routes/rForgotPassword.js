const models = require('../models')
const emailSenderRecover = require('../middlewares/invite/emailForgotPassword')
const { v4: uuidv4 } = require('uuid');

async function forgotPassword (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      default:
        res.end(false)
    }
  } catch (e) {
    console.log('Error in rForgotPassword.js forgotPassword')
    res.writeHead(400)
    res.write(e.message)
    res.end()
  }

  async function postMethod (req, res) {
    try {
      //create User model
      const user = await models.User.findOne({
        email: req.parsedData.email
      })

      if (!user) {
        throw new Error('User not found')
      }

      const uuid = uuidv4()
      const recover = new models.Recover({
        user_id: user,
        uuid
      })

      //save Recover User to MongoDB
      await recover.save()

      //send Email to user
      console.log(`Sent new password to ${req.parsedData.email}`)
      await emailSenderRecover(req.parsedData.email, uuid)

      //response
      const contentType = 'text/html'
      res.writeHead(200, {
        'Content-Type': contentType,
      })
      res.write(`We send message to your email: ${req.parsedData.email}`)
      res.end()

      //if Error
    } catch (e) {
      console.log('Error in forgotPassword.js postMethod', e)
      res.writeHead(400)
      res.write(e.message)
      res.end()
    }
  }
}


module.exports = forgotPassword;