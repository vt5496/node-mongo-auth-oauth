const models = require('../../models')
const { createRandomPassword } = require('../../middlewares/invite/createRandomPassword')
const emailSender = require('../../middlewares/invite/emailInvite')
const { v4: uuidv4 } = require('uuid')

async function adminRegDB (email) {
  try {
    if (!email) {
      throw new Error('Email is empty')
    }
    //create admin model
    const user = await new models.User({
      email,
      password: createRandomPassword(),
      role: 'ADMIN',
    })
    await user.save()
    const uuid = uuidv4()
    const invitation = await new models.Invitation({
      user_id: user,
      uuid
    })

    await invitation.save()
    console.log('User, successfully saved')

    //send Email to admin
    await emailSender(email, uuid)
  } catch (e) {
    if (e.message.includes('duplicate')) {
      return console.log('User, successfully fined')
    }
    console.log(e)
  }

}

module.exports = { adminRegDB }