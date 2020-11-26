const models = require('../models/index')
const { signToken } = require('../utils/tokens')

async function oAuthGoogle (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      case 'GET':
        break
    }
  } catch (e) {
    console.log('Error in rOAuthGoogle.js invite')
    res.writeHead(400)
    res.write(e.message)
    res.end()
  }
}

async function postMethod (req, res) {
  const contentType = 'application/json'
  try {
    const parsedData = JSON.parse(req.parsedData)
    const user = await models.User.findOne({
      email: parsedData.email
    })
    if (!user){
      throw new Error('User not found! First need invited!')
    }
    console.log(user)

    let userOAuth = await models.OAuth.findOne({
      oauthId: parsedData.id
    })
    if (!userOAuth) {
      userOAuth = await new models.OAuth({
        user_id: user,
        type: 'GOOGLE',
        oauthId: parsedData.id
      })
      userOAuth.save()
    }
    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })
    res.writeHead(200, {
      'Content-Type': contentType,
    })
    res.write(JSON.stringify({ token, email: user.email }))
    res.end()
  } catch (e) {
    console.log('rLogin', e)
    res.writeHead(401, {
      'Content-Type': contentType,
    })
    res.write(JSON.stringify(e.message))
    res.end()
  }

}

module.exports = oAuthGoogle