const path = require('path')
const fs = require('fs')
const login = require('./rLogin')
const invite = require('./rInvite')
const completeInvitation = require('./rCompleteInvitation')
const forgotPassword = require('./rForgotPassword')
const completeForgotPassword = require('./rCompleteForgotPassword')
const completeRecover = require('./rCompleteRecover')
const {verifyToken} = require('../utils/tokens')
const rOAuthGoogle2 = require('./rOAuthGoogle2')
const rOAuthFacebook = require('./rOAuthFacebook')

function routers (req, res) {
  const filePath = path.join(__dirname, '../../', req.url)
  const ext = path.extname(filePath)
  let contentType = 'text/html'

  switch (ext) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
  }


  let reqObj = ''
  req.on('data', (chunk) => {
    reqObj += chunk
  })
  req.on('end', function () {

    if (req.method !== 'GET') {
      req.parsedData = JSON.parse(reqObj)
    }
    let url = req.url
    req.position = req.url.indexOf('?')
    if (req.position !== -1) {
      url = url.slice(0, req.position)
    }
    switch (url) {
      //api for login user
      case '/api/login':
        login(req, res)
        break

      //api for invite user
      case '/api/invite':
        const payload = verifyToken(req.headers['x-authorization'])
        invite(req, res, payload)
        break

      //api for check uuid when invitation
      case '/api/complete-invitation':
        completeInvitation(req, res)
        break

      //api for create uuid for recover
      case '/api/forgot-password':
        forgotPassword(req, res)
        break

      //api for check uuid when forgot password
      case '/api/complete-forgot-password':
        completeForgotPassword(req, res)
        break

      //api for end change password
      case '/api/complete-recover':
        completeRecover(req, res)
        break

      //for google oauth redirect
      case '/oauth-redirect/google':
        rOAuthGoogle2(req, res)
        break

      //for facebook oauth redirect
      case '/oauth-redirect/facebook':
        rOAuthFacebook(req, res)
        break

      //for front
      default:
        switch (ext) {
          case '.js':
          case '.css':
          case '.ico':
          case '.svg':
            const file = path.join(__dirname, '../../', req.url)
            resReadFile(file, res, contentType)
            break
          default:
            const html = path.join(__dirname, '../../views', 'index.html')
            resReadFile(html, res, contentType)
            break
        }
    }
  })
}

function resReadFile (file, res, contentType){
  fs.readFile(file, (err, data) => {
    if (err){
      res.end('Error')
    }
    res.writeHead(200, {
      'Content-Type': contentType
    })
    res.end(data)
  })
}

module.exports = routers