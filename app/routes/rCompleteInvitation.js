const models = require('../models')

async function completeInvitation (req, res) {
    try {
      switch (req.method) {
        case 'POST':
          await postMethod(req, res)
          break
        default:
          res.end(false)
      }
    } catch (e) {
      console.log('Error in completeInvitation completeInvitation')
      res.writeHead(400)
      res.write(e.message)
      res.end()
    }

  async function postMethod (req, res) {
    try {
      //create uuid
      const url = req.parsedData.url
      const uuid = url.substr(url.indexOf("invitation/") + "invitation/".length)

      //find Invitation
      const inviteObj = await models.Invitation.findOne({
        uuid
      })
      if (!inviteObj) {
        throw new Error('You can`t invite!')
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
      console.log('Error in rCompleteInvitation.js postMethod', e)
      res.writeHead(400)
      res.write(e.message)
      res.end()
    }
  }
}


module.exports = completeInvitation;