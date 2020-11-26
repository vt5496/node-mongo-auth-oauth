const {Schema, model, Types} = require('mongoose')

const oAuthSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true
  },
  oauthId: {
    type: String,
    required: true
  }
})

const OAuth = model('OAuth', oAuthSchema)

module.exports = OAuth