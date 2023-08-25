import mongoose from 'mongoose'

const ResetPassword = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide email'],
    //   maxlength:10,
    },
    token: { type: String, required: true },
    createdAt: { type: Date, expires: '10m', default: Date.now },   
  },
  { timestamps: true }
)

export default mongoose.model('ResetPassword', ResetPassword)
