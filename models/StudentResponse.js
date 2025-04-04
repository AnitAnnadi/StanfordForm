import mongoose from 'mongoose'

const StudentResponseSchema = new mongoose.Schema(
  {
    formCode: {
      type: String,
      required: [true, 'Please provide code'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    grade: {
      type: String,
      required: [true, 'Please provide grade'],
      maxlength:20,
    },
    when: {
      type: String,
      enum: ['before', 'after'],
      required: [true, 'Please provide when'],
    },
    formType:{
      type: String,
      enum: ['You and Me, Together Vape-Free(elem)','You and Me Vape Free (middle school and above)', 'Smart Talk: Cannabis Prevention & Education Awareness','Safety First', 'Healthy Futures: Tobacco/Nicotine/Vaping','Healthy Futures: Cannabis', 'Smart Talk: Cannabis Prevention & Education Awareness(elem)', 'Safety First(Fentanyl)', 'LGBTQ+ Curriculum'],
      required: [true, 'Please provide form type'],
    },
    school:{
      type: String,
      required: [true, 'Please provide school'],
    },
    period:{
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('StudentResponseSchema', StudentResponseSchema)
