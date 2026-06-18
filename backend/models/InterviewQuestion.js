import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['HR', 'Technical', 'DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'Projects'],
    required: [true, 'Question category is required'],
    index: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required']
  },
  source: {
    type: String,
    enum: ['Manual', 'AI Generated', 'Community'],
    default: 'Manual'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient filtered queries
interviewQuestionSchema.index({ company: 1, category: 1 });
interviewQuestionSchema.index({ company: 1, difficulty: 1 });
interviewQuestionSchema.index({ category: 1, difficulty: 1 });

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
