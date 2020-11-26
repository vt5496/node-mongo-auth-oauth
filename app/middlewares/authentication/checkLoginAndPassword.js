const models = require('../../models')

async function checkLoginAndPassword (email, password) {
  const user = await models.User.findOne({ email }, function (err) {
    if (err) throw new Error(err)
    console.log('Fined successfully done')
  }).exec()
  if (!user) {
    throw new Error('Email false')
  }
  if (user.password !== password) {
    throw new Error('Password false')
  }
  return user
}

module.exports = { checkLoginAndPassword }
