import mongoose from 'mongoose'

const NoCodeSchema = new mongoose.Schema(
  {
    grade: {
      type: String,
      required: [true, 'Please provide grade'],
      maxlength:10,
    },
    when: {
      type: String,
      enum: ['before', 'after'],
      required: [true, 'Please provide when'],
    },
    formType:{
      type: String,
      enum: ['You and Me, Together Vape-Free', 'Smart Talk: Cannabis Prevention & Education Awareness','Safety First', 'Healthy Futures: Tobacco/Nicotine/Vaping','Healthy Futures: Cannabis'],
      required: [true, 'Please provide form type'],
    },
    school:{
      type: String,
      required: [true, 'Please provide school'],
    },
    state:{
        type: String,
        required: [true, 'Please provide state'],
      },
    city:{
    type: String,
    required: [true, 'Please provide city'],
    },
    county:{
        type: String,
        required: [true, 'Please provide county'],
      },
    district:{
    type: String,
    required: [true, 'Please provide district'],
    },
    
  },
  { timestamps: true }
)

export default mongoose.model('NoCodeSchema', NoCodeSchema)
