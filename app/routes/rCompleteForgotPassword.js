const models = require('../models')
const HttpError = require('../utils/httpError')

async function completeForgotPassword (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        await postMethod(req, res)
        break
      default:
        res.end(false)
    }
  } catch (e) {
    console.log('Error in rCompleteForgotPassword.js completeInvitation')
    res.writeHead(400)
    res.write(e.message)
    res.end()
  }

  async function postMethod (req, res) {
    try {
      //create uuid
      const url = req.parsedData.url
      const uuid = url.substr(url.indexOf("recover/") + "recover/".length)
      //find Invitation
      const recoverObj = await models.Recover.findOne({
        uuid
      })
      if (!recoverObj) {
        throw new HttpError('You can`t change your password!', 301)
      }
      //response to save "I fined UUID, all TRUE"
      const contentType = 'text/html'
      res.writeHead(200, {
        'Content-Type': contentType
      })
      res.write(uuid)
      res.end()

      //if Error
    } catch (e) {
      console.log('Error in rCompleteForgotPassword.js postMethod', e)
      res.writeHead(400)
      res.write(e.message)
      res.end()
    }
  }
}


module.exports = completeForgotPassword;