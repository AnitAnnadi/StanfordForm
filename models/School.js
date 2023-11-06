import mongoose from 'mongoose'

const SchoolSchema = new mongoose.Schema({
  teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
  multiplePeriods: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
    trim: true,
    default: 'United States',
  },
  state: {
    type: String,
    trim: true,
    default: 'state',
  },
  county: {
    type: String,
    trim: true,
    default: 'county',
  },
  city: {
    type: String,
    trim: true,
    default: 'city',
  },
  district: {
    type: String,
    trim: true,
    default: 'district',
  },
  school: {
    type: String,
    trim: true,
    default: 'school',
  },
})

export default mongoose.model('School', SchoolSchema)
