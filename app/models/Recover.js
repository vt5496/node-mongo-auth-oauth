const {Schema, model, Types} = require('mongoose')

const recoverSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
  },
  expiredAt: {
    type: String,
    default: () => Date.now() + 1000000
  }
})

const Recover = model('Recover', recoverSchema)
module.exports = Recover