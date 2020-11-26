const models = require('../../models')
const { createRandomPassword } = require('../../middlewares/invite/createRandomPassword')
const emailSender = require('../../middlewares/invite')
const { v4: uuidv4 } = require('uuid');

async function adminRegDB (email) {
  try {
    if (!email) {
      throw new Error('Email is empty')
    }
    //create admin model
    await new models.User({
      email,
      password: createRandomPassword(),
      role: 'ADMIN',
    }).save()
    console.log('User, successfully saved')

    //send Email to admin
    await emailSender(email, uuidv4())
  } catch (e) {
    if (e.message.includes('duplicate')){
      return console.log('User, successfully fined')
    }
    console.log(e)
  }

}

module.exports = { adminRegDB }