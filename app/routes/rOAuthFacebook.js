const querystring = require('query-string')

async function oAuthFacebook (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        break
      case 'GET':
        await getMethod(req, res)
        break
    }
  } catch (e) {
    console.log('Error in rOAuthFacebook.js invite')
    res.writeHead(400)
    res.write(e.message)
    res.end()
  }
}

function getMethod(req, res) {
  const code = querystring.parse(req.url.slice(req.position + 1, req.url.length)).code
  console.log(code)
  const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v9.0/oauth/access_token';

  const facebookConfig = {
    clientId: process.env.FACEBOOK_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: process.env.FACEBOOK_REDIRECT_URL, // this must match your google api settings
  }


}

module.exports = oAuthFacebook