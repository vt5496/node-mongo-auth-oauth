const models = require('../models')
const axios = require('axios')
const { signToken } = require('../utils/tokens')

const GOOGLE_TOKEN_URL = `https://oauth2.googleapis.com/token`

async function rOAuthGoogleLogin (req, res) {
  try {
    const code = req.parsedData
    if (!code) {
      throw new Error('Invalid request')
    }
    async function getAccessTokenFromCode (code) {
      const { data } = await axios({
        url: GOOGLE_TOKEN_URL,
        method: 'post',
        data: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `http://${req.headers['host']}/oauth-redirect-login`,
          grant_type: 'authorization_code',
        },
      })
      return data.access_token
    }
    async function getGoogleUserInfo (accesstoken) {
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
    const userInfo = await getGoogleUserInfo(access_token)

    console.log('User info from google: \n', userInfo)

    let userOAuthGoogle = await models.OAuth.findOne({
      oauthId: userInfo.id,
      type: "GOOGLE"
    })
    if (!userOAuthGoogle) {
      throw new Error('User not found')
    }

    const user = await models.User.findOne({
      _id: userOAuthGoogle.user_id,
    })
    if (!user) {
      throw new Error('OAuth user not found')
    }

    let userOAuthFacebook = await models.OAuth.findOne({
      user_id: userOAuthGoogle.user_id,
      type: 'FACEBOOK'
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
    res.write(JSON.stringify({ token, email: user.email, google: userOAuthGoogle.oauthId , facebook:  userOAuthFacebook.oauthId}))
    res.end()
  } catch (e) {
    res.writeHead(403)
    console.log(JSON.stringify(e.message))
    res.write(JSON.stringify(e.message))
    res.end()
  }

}

module.exports = rOAuthGoogleLogin
