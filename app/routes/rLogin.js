const { checkLoginAndPassword } = require('../middlewares/authentication/checkLoginAndPassword')
const { signToken } = require('../utils/tokens')
const models = require('../models')

async function rLogin (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      default:
        res.end(false)
    }
  } catch (e) {
    console.log(e)
  }
}

async function postMethod (req, res) {
  const contentType = 'application/json'
  try {
    const user = await checkLoginAndPassword(req.parsedData.email, req.parsedData.password)

    let userOAuthGoogle = await models.OAuth.findOne({
      user_id: user._id,
      type: "GOOGLE"
    })
    if (!userOAuthGoogle) {
      userOAuthGoogle = ''
    }

    let userOAuthFacebook = await models.OAuth.findOne({
      user_id: user._id,
      type: "FACEBOOK"
    })
    if (!userOAuthFacebook) {
      userOAuthFacebook = ''
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })
    res.writeHead(200, {
      'Content-Type': contentType,
    })

    res.write(JSON.stringify({ token, email: user.email, google: userOAuthGoogle.oauthId, facebook:  userOAuthFacebook.oauthId}))
    res.end()
  } catch (e) {
    console.log('rLogin', e)
    res.writeHead(401, {
      'Content-Type': contentType,
    })
    res.write(e.message)
    res.end()
  }
}

module.exports = rLogin