import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, 
    enum: ['user', 'admin'], 
    default: 'user' },
  isverified: { type: Boolean, default: false },
});


module.exports = mongoose.model('user', UserSchema);