const { Schema, model, Types } = require('mongoose')

const invitationSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uuid: {
    type: String,
    required: true
  },
  expiredAt: {
    type: Date,
    required: true,
    default: Date.now() + 10,
    expires: 10
  }
})

const Invitation = model('Invitation', invitationSchema)
module.exports = Invitation