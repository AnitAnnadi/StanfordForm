import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'name',
  },
  multiplePeriods:{
    type:Boolean,
    default:false
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
  approved: {
    type: Boolean,
    default: false,
  },
  requestedUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  custom: {
    type: Boolean,
    default: true,
  }
})

export default mongoose.model('Location', LocationSchema)
