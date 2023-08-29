import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const PendingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provside password'],
    minlength: 6,
    // select: false,
  },
  role: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'Teacher',
  },
  code: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null,
  },
})



export default mongoose.model('Pending', PendingSchema)
