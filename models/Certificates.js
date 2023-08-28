import mongoose from 'mongoose'

const Certificate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
    //   maxlength:10,
    },
    teacherId: {
        type: mongoose.Types.ObjectId,
      required: [true, 'Please provide teacherId'],
    },
    formType:{
      type: String,
      enum: ['Healthy Futures: Tobacco/Nicotine/Vaping','Healthy Futures: Cannabis'],
      required: [true, 'Please provide form type'],
    },
  //   refId: {
  //     type: mongoose.Types.ObjectId,
  //   required: [true, 'Please provide refId'],
  // },
    
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', Certificate)
