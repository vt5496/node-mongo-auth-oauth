const { verifyToken, signToken } = require('../utils/tokens')
const querystring = require('querystring')
const models = require('../models')
const axios = require('axios')

const { HttpError } = require('../utils/httpError')

async function rOAuthGoogle (req, res) {
  const code = req.parsedData
  const userToken = req.headers['x-authorization']
  const payload = verifyToken(userToken)
  const user = await models.User.findOne({
    email: payload.email,
  })

  if (!user) {
    throw new HttpError('Access denied', 403)
  }

  async function getAccessTokenFromCode (code) {
    const { data } = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `http://${req.headers['host']}/oauth-redirect`,
        grant_type: 'authorization_code',
      },
    })
    return data.access_token
  }
  async function getGoogleDriveFiles (accesstoken) {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    })
    return data
  }

  const access_token = await getAccessTokenFromCode(code)
  const userInfo = await getGoogleDriveFiles(access_token)
  console.log("User info from google: \n", userInfo)

  let userOAuth = await models.OAuth.findOne({
    oauthId: userInfo.id,
  })
  if (!userOAuth) {
    userOAuth = await new models.OAuth({
      user_id: user,
      type: 'GOOGLE',
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
  res.write(JSON.stringify({email: user.email, token: token}))
  res.end()

}

module.exports = rOAuthGoogle
