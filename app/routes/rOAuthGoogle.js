const models = require('../models')
const axios = require('axios')
const { verifyToken, signToken } = require('../utils/tokens')


async function rOAuthGoogle (req, res) {
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
    async function getGoogleUserInfo (access_token) {
      const { data } = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      return data
    }

    const access_token = await getAccessTokenFromCode(code)
    const userInfo = await getGoogleUserInfo(access_token)

    console.log('User info from google: \n', userInfo)

    let userOAuthGoogle = await models.OAuth.findOne({
      oauthId: userInfo.id,
      type: "GOOGLE"
    })
    if (!userOAuthGoogle) {
      userOAuthGoogle = await new models.OAuth({
        user_id: user,
        type: 'GOOGLE',
        oauthId: userInfo.id,
      })
      userOAuthGoogle.save()
    }

    let userOAuthFacebook = await models.OAuth.findOne({
      user_id: userOAuthGoogle.user_id,
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

    res.writeHead(301)
    res.write(JSON.stringify({ token, email: user.email, google: userOAuthGoogle.oauthId, facebook:  userOAuthFacebook.oauthId }))
    res.end()
  } catch (e) {
    console.log(JSON.stringify(e.message))
    res.writeHead(403)
    res.write(JSON.stringify(e.message))
    res.end()
  }
}

module.exports = rOAuthGoogle
