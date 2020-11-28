const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'USER'
  }
})

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


const User =  model('User', userSchema)

module.exports = User;