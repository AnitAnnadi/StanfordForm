import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'name',
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
  custom: {
    type: Boolean,
    default: true,
  }
})

export default mongoose.model('Location', LocationSchema)
