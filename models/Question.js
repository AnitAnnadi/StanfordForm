import mongoose from 'mongoose'

const Question = new mongoose.Schema(
  {
    StudentResponse: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide UUID'],
    },
    Question: {
      type:String,
      required: [true, 'Please provide Question'],
    },
    Answer: {
      type: String,
      required: [true, 'Please provide answer'],
    }
  },
  { timestamps: true }
)

export default mongoose.model('Question', Question)
