import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true
  },
  totalQuestions: {
    type: Number,
    default: 0,
    min: [0, 'Total questions cannot be negative']
  },
  attemptedQuestions: {
    type: Number,
    default: 0,
    min: [0, 'Attempted questions cannot be negative']
  },
  confidenceScore: {
    type: Number,
    default: 0,
    min: [0, 'Confidence score cannot be below 0'],
    max: [100, 'Confidence score cannot exceed 100']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes for efficient user queries
interviewSessionSchema.index({ userId: 1, status: 1 });
interviewSessionSchema.index({ userId: 1, company: 1 });
interviewSessionSchema.index({ userId: 1, createdAt: -1 });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
