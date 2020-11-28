const querystring = require('querystring')
const models = require('../models/index')
const axios = require('axios')
const { signToken, verifyToken } = require('../utils/tokens')

const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v9.0/oauth/access_token'

async function rOAuthFacebook (req, res) {
  try {
    const code = req.parsedData
    if (!code) {
      throw new Error('Invalid request')
    }

    const userToken = req.headers['x-authorization']
    const payload = verifyToken(userToken)
    const user = await models.User.findOne({
      email: payload.email,
    })

    async function getAccessTokenFromCode (code) {
      const body = {
        redirect_uri: `http://${req.headers['host']}/oauth-redirect`,
        code,
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      }
      const { data } = await axios({
        url: `${FACEBOOK_TOKEN_URL}?${querystring.encode(body)}`,
        method: 'get',
      })
      return data.access_token
    }
    async function getFacebookUserInfo (access_token) {
      const { data } = await axios({
        url: `https://graph.facebook.com/v9.0/me?fields=email&access_token=${access_token}`,
        method: 'get',
      })
      return data
    }

    const access_token = await getAccessTokenFromCode(code)
    const userInfo = await getFacebookUserInfo(access_token)

    console.log('User info from Facebook: \n', userInfo)

    let userOAuthFacebook = await models.OAuth.findOne({
      oauthId: userInfo.id,
      type: "FACEBOOK"
    })
    if (!userOAuthFacebook) {
      userOAuthFacebook = await new models.OAuth({
        user_id: user,
        type: 'FACEBOOK',
        oauthId: userInfo.id,
      })
      userOAuthFacebook.save()
    }

    let userOAuthGoogle = await models.OAuth.findOne({
      user_id: userOAuthFacebook.user_id,
      type: "GOOGLE"
    })
    if (!userOAuthGoogle) {
      userOAuthGoogle = ''
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })

    res.writeHead(301)
    res.write(JSON.stringify({ token, email: user.email, facebook: userOAuthFacebook.oauthId, google: userOAuthGoogle.oauthId }))
    res.end()
  } catch (e) {
    console.log(e.message)
    res.writeHead(403)
    res.write(JSON.stringify(e.message))
    res.end()
  }
}

module.exports = rOAuthFacebook
