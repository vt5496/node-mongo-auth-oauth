const models = require('../../models')
const bcrypt = require('bcryptjs')

async function checkLoginAndPassword (email, password) {
  const user = await models.User.findOne({ email })
  console.log('Fined successfully done')
  if (!user) {
    throw new Error('Email false')
  }
  if (user.password !== bcrypt.hashSync(password, process.env.SALT)) {
    throw new Error('Password false')
  }
  return user
}

module.exports = { checkLoginAndPassword }
