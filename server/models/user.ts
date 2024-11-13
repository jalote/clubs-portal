import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  handle: { type: String, required: true },
  isClubsCoordinator: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
})

const User = mongoose.model('User', userSchema)

export default User
