const models = require('../models')
const { createRandomPassword } = require('../middlewares/invite/createRandomPassword')
const emailSender = require('../middlewares/invite/emailInvite')
const { v4: uuidv4 } = require('uuid');

async function invite (req, res, payload) {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res, payload)
        break
      default:
        res.end(false)
        break
    }
}

async function postMethod (req, res, payload) {
  try {
    if (payload.role !== 'ADMIN') {
      throw new Error('permission')
    }

    //create User model
    const user = new models.User({
      email: req.parsedData.email,
      password: createRandomPassword()
    })

    const uuid = uuidv4()
    const invitation = new models.Invitation({
      user_id: user,
      uuid
    })

    //save User to MongoDB
    await user.save()
    await invitation.save()

    //send Email to user
    await emailSender(req.parsedData.email, uuid)
    console.log(`User ${req.parsedData.email} successfully invited`)

    //response
    const contentType = 'text/html'
    res.writeHead(200, {
      'Content-Type': contentType,
    })
    res.write(`Invite new user
        email: ${req.parsedData.email};`)
    res.end()

    //if Error
  } catch (e) {
    if (e.message.includes('duplicate')){
      res.writeHead(400)
      res.write(`This user includes in database!`)
      return res.end()
    } else if (e.message.includes('permission')){
      res.writeHead(400)
      res.write(`You can't do it!`)
      return res.end()
    }
    console.log('Error in rInvite.js postMethod')
    console.log(e)
  }
}

module.exports = invite