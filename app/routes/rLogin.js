const { checkLoginAndPassword } = require('../middlewares/authentication/checkLoginAndPassword')
const { signToken } = require('../utils/tokens')

async function rLogin (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      case 'GET':
        res.end('Can`t get anything')
    }
  } catch (e) {
    console.log(e)
  }
}

async function postMethod (req, res) {
  const contentType = 'application/json'
  try {
    const user = await checkLoginAndPassword(req.parsedData.email, req.parsedData.password)
    const token = signToken( {
      userId: user._id,
        email: user.email,
        role: user.role,
    })
    res.writeHead(200, {
      'Content-Type': contentType,
    })
    res.write(JSON.stringify({token, email: user.email}))
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