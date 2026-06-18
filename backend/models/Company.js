import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide the job role'],
    trim: true
  },
  packageLpa: {
    type: Number,
    default: 0,
    min: [0, 'Salary package cannot be negative']
  },
  status: {
    type: String,
    enum: ['wishlist', 'applied', 'preparing', 'interviewing', 'offered', 'rejected'],
    default: 'wishlist'
  },
  aptitudeStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'n/a'],
    default: 'pending'
  },
  dsaStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'n/a'],
    default: 'pending'
  },
  resumeStatus: {
    type: String,
    enum: ['pending', 'submitted', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  interviewStatus: {
    type: String,
    enum: ['pending', 'round_1', 'round_2', 'hr', 'completed'],
    default: 'pending'
  },
  applicationLink: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  interviewDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
