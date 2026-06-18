import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewSession from '../models/InterviewSession.js';

// ═══════════════════════════════════════════════════════════
// QUESTION BANK (Shared — not user-scoped)
// ═══════════════════════════════════════════════════════════

/**
 * Add a new question to the shared question bank
 * @param {Object} questionData - Question fields
 * @returns {Object} Created question document
 */
export const addQuestion = async (questionData) => {
  const question = await InterviewQuestion.create(questionData);
  return question;
};

/**
 * Add multiple questions to the bank at once (used by AI generator)
 * @param {Array} questionsArray - Array of question objects
 * @returns {Array} Created question documents
 */
export const addBulkQuestions = async (questionsArray) => {
  const questions = await InterviewQuestion.insertMany(questionsArray);
  return questions;
};

/**
 * Get questions from the bank with optional filters
 * @param {Object} filters - { search, company, category, difficulty, role }
 * @returns {Array} List of question documents
 */
export const getQuestions = async (filters = {}) => {
  const query = {};

  if (filters.company && filters.company !== 'all') {
    query.company = { $regex: filters.company, $options: 'i' };
  }
  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    query.difficulty = filters.difficulty;
  }
  if (filters.role && filters.role !== 'all') {
    query.role = { $regex: filters.role, $options: 'i' };
  }
  if (filters.search) {
    query.question = { $regex: filters.search, $options: 'i' };
  }

  const questions = await InterviewQuestion.find(query)
    .sort({ createdAt: -1 })
    .limit(100);

  return questions;
};

/**
 * Delete a question from the bank
 * @param {string} questionId
 * @returns {Object} Deletion confirmation
 */
export const deleteQuestion = async (questionId) => {
  const question = await InterviewQuestion.findByIdAndDelete(questionId);
  if (!question) {
    throw new Error('Question not found');
  }
  return { message: 'Question removed from bank successfully' };
};

/**
 * Get distinct company names in the question bank
 * @returns {Array} Unique company names
 */
export const getDistinctCompanies = async () => {
  const companies = await InterviewQuestion.distinct('company');
  return companies.sort();
};

// ═══════════════════════════════════════════════════════════
// PRACTICE SESSIONS (User-scoped)
// ═══════════════════════════════════════════════════════════

/**
 * Create a new practice session
 * @param {string} userId
 * @param {Object} sessionData - { company, role, totalQuestions }
 * @returns {Object} Created session document
 */
export const createSession = async (userId, sessionData) => {
  const session = await InterviewSession.create({
    userId,
    ...sessionData
  });
  return session;
};

/**
 * Get all sessions for a user, sorted by most recent
 * @param {string} userId
 * @returns {Array} List of session documents
 */
export const getSessions = async (userId) => {
  const sessions = await InterviewSession.find({ userId })
    .sort({ createdAt: -1 });
  return sessions;
};

/**
 * Update a session's progress (attempted questions, notes, confidence)
 * @param {string} sessionId
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Object} Updated session document
 */
export const updateSession = async (sessionId, userId, updateData) => {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new Error('Session not found or access denied');
  }

  const allowedFields = ['attemptedQuestions', 'totalQuestions', 'confidenceScore', 'notes'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      session[field] = updateData[field];
    }
  });

  const updatedSession = await session.save();
  return updatedSession;
};

/**
 * Mark a session as completed
 * @param {string} sessionId
 * @param {string} userId
 * @param {Object} completionData - Final stats
 * @returns {Object} Completed session document
 */
export const completeSession = async (sessionId, userId, completionData) => {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new Error('Session not found or access denied');
  }

  // Apply final data
  if (completionData.attemptedQuestions !== undefined) {
    session.attemptedQuestions = completionData.attemptedQuestions;
  }
  if (completionData.confidenceScore !== undefined) {
    session.confidenceScore = completionData.confidenceScore;
  }
  if (completionData.notes !== undefined) {
    session.notes = completionData.notes;
  }
  if (completionData.totalQuestions !== undefined) {
    session.totalQuestions = completionData.totalQuestions;
  }

  session.status = 'completed';
  session.completedAt = new Date();

  const updatedSession = await session.save();
  return updatedSession;
};

/**
 * Delete a session
 * @param {string} sessionId
 * @param {string} userId
 * @returns {Object} Deletion confirmation
 */
export const deleteSession = async (sessionId, userId) => {
  const session = await InterviewSession.findOneAndDelete({ _id: sessionId, userId });
  if (!session) {
    throw new Error('Session not found or access denied');
  }
  return { message: 'Practice session deleted successfully' };
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATISTICS
// ═══════════════════════════════════════════════════════════

/**
 * Get interview preparation stats for a user's dashboard
 * @param {string} userId
 * @returns {Object} Interview statistics
 */
export const getInterviewStats = async (userId) => {
  const sessions = await InterviewSession.find({ userId });

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const inProgressSessions = sessions.filter(s => s.status === 'in_progress').length;

  // Calculate average confidence from completed sessions
  const completedWithScore = sessions.filter(s => s.status === 'completed' && s.confidenceScore > 0);
  const avgConfidence = completedWithScore.length > 0
    ? Math.round(completedWithScore.reduce((sum, s) => sum + s.confidenceScore, 0) / completedWithScore.length)
    : 0;

  // Total questions attempted across all sessions
  const totalAttempted = sessions.reduce((sum, s) => sum + s.attemptedQuestions, 0);

  // Company distribution for completed sessions
  const companyDistribution = {};
  sessions
    .filter(s => s.status === 'completed')
    .forEach(s => {
      companyDistribution[s.company] = (companyDistribution[s.company] || 0) + 1;
    });

  // Readiness level based on completed sessions and confidence
  let readinessLevel = 'Beginner';
  if (completedSessions >= 5 && avgConfidence >= 70) {
    readinessLevel = 'Ready';
  } else if (completedSessions >= 2 && avgConfidence >= 40) {
    readinessLevel = 'Improving';
  }

  // Recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(s => ({
      _id: s._id,
      company: s.company,
      role: s.role,
      status: s.status,
      confidenceScore: s.confidenceScore,
      attemptedQuestions: s.attemptedQuestions,
      createdAt: s.createdAt,
      completedAt: s.completedAt
    }));

  // Total questions in the shared bank
  const totalBankQuestions = await InterviewQuestion.countDocuments();

  return {
    totalSessions,
    completedSessions,
    inProgressSessions,
    avgConfidence,
    totalAttempted,
    readinessLevel,
    companyDistribution,
    recentSessions,
    totalBankQuestions
  };
};
