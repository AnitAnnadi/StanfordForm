import mongoose from 'mongoose'

const StudentResponseSchema = new mongoose.Schema(
  {
    formCode: {
      type: String,
      required: [true, 'Please provide code'],
    },
    grade: {
    type: String,
      required: [true, 'Please provide grade'],
      maxlength:10,
    },
    When: {
      type: String,
      enum: ['before', 'after'],
      required: [true, 'Please provide when'],
    },
    formType:{
      type: String,
      enum: ['tobacco', 'cannabis'],
      required: [true, 'Please provide form type'],
    }
  },
  { timestamps: true }
)

export default mongoose.model('StudentResponseSchema', StudentResponseSchema)
