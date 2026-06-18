import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required']
  },
  topic: {
    type: String,
    enum: [
      'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
      'DP', 'Greedy', 'Backtracking', 'Sorting', 'Searching',
      'Stack', 'Queue', 'Hashing', 'Math', 'Bit Manipulation', 'Other'
    ],
    required: [true, 'Topic category is required']
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GFG', 'Coding Ninjas', 'Codeforces', 'HackerRank', 'Other'],
    required: [true, 'Platform is required']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    default: '',
    trim: true
  },
  solvedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for filtering performance
dsaProblemSchema.index({ userId: 1, difficulty: 1 });
dsaProblemSchema.index({ userId: 1, topic: 1 });
dsaProblemSchema.index({ userId: 1, platform: 1 });

const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);
export default DSAProblem;
