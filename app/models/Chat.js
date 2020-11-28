const {Schema, model, Types} = require('mongoose')

const chatSchema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: 'User',
  },
  users: [String],
  created: {
    type: String,
    default: Date.now()
  },
  messages: [
    Object
  ]
})

const Chat = model('Chat', chatSchema)
module.exports = Chat