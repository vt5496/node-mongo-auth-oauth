const https = require('https')
const querystring = require('querystring')
const models = require('../models/index')
const axios = require('axios')
const { signToken, verifyToken } = require('../utils/tokens')

const { HttpError } = require('../utils/httpError')

const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v9.0/oauth/access_token'

async function rOAuthFacebook (req, res) {
  const code = req.parsedData
  if (!code) {
    new HttpError('Invalid request', 400)
  }
  const userToken = req.headers['x-authorization']
  const payload = verifyToken(userToken)
  const user = await models.User.findOne({
    email: payload.email,
  })

  async function getAccessTokenFromCode (code) {
    const body = {
      redirect_uri: `http://localhost:3002/oauth-redirect`,
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

  async function getFacebookDriveFiles (accesstoken) {
    const { data } = await axios({
      url: `https://graph.facebook.com/v9.0/me?fields=email&access_token=${access_token}`,
      method: 'get',
    })
    return data
  }

  const access_token = await getAccessTokenFromCode(code)
  const userInfo = await getFacebookDriveFiles(access_token)

  console.log('User info from Facebook: \n', userInfo)

  let userOAuth = await models.OAuth.findOne({
    oauthId: userInfo.id,
  })
  if (!userOAuth) {
    userOAuth = await new models.OAuth({
      user_id: user,
      type: 'FACEBOOK',
      oauthId: userInfo.id,
    })
    userOAuth.save()
  }

  const token = signToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  })

  res.writeHead(301)
  res.write(JSON.stringify({ email: user.email, token: token }))
  res.end()
}

module.exports = rOAuthFacebook
