import {
  addQuestion as addQuestionService,
  addBulkQuestions,
  getQuestions,
  deleteQuestion as deleteQuestionService,
  getDistinctCompanies,
  createSession as createSessionService,
  getSessions,
  updateSession as updateSessionService,
  completeSession as completeSessionService,
  deleteSession as deleteSessionService,
  getInterviewStats
} from '../services/interviewService.js';
import { generateQuestions } from '../services/geminiService.js';

// ═══════════════════════════════════════════════════════════
// QUESTION BANK CONTROLLERS
// ═══════════════════════════════════════════════════════════

/**
 * @desc    Add a question to the shared bank
 * @route   POST /api/interviews/questions
 * @access  Private
 */
export const addQuestion = async (req, res, next) => {
  try {
    const question = await addQuestionService(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    List questions with optional filters
 * @route   GET /api/interviews/questions
 * @access  Private
 */
export const listQuestions = async (req, res, next) => {
  try {
    const { search, company, category, difficulty, role } = req.query;
    const questions = await getQuestions({ search, company, category, difficulty, role });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Delete a question from the bank
 * @route   DELETE /api/interviews/questions/:id
 * @access  Private
 */
export const removeQuestion = async (req, res, next) => {
  try {
    const result = await deleteQuestionService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Get distinct companies in question bank
 * @route   GET /api/interviews/questions/companies
 * @access  Private
 */
export const listCompanies = async (req, res, next) => {
  try {
    const companies = await getDistinctCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// PRACTICE SESSION CONTROLLERS
// ═══════════════════════════════════════════════════════════

/**
 * @desc    Start a new practice session
 * @route   POST /api/interviews/sessions
 * @access  Private
 */
export const createSession = async (req, res, next) => {
  try {
    const session = await createSessionService(req.user._id, req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    List all practice sessions for the user
 * @route   GET /api/interviews/sessions
 * @access  Private
 */
export const listSessions = async (req, res, next) => {
  try {
    const sessions = await getSessions(req.user._id);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Update a session's progress
 * @route   PUT /api/interviews/sessions/:id
 * @access  Private
 */
export const updateSession = async (req, res, next) => {
  try {
    const session = await updateSessionService(req.params.id, req.user._id, req.body);
    res.status(200).json(session);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Mark a session as completed
 * @route   PUT /api/interviews/sessions/:id/complete
 * @access  Private
 */
export const completeSessionHandler = async (req, res, next) => {
  try {
    const session = await completeSessionService(req.params.id, req.user._id, req.body);
    res.status(200).json(session);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Delete a practice session
 * @route   DELETE /api/interviews/sessions/:id
 * @access  Private
 */
export const removeSession = async (req, res, next) => {
  try {
    const result = await deleteSessionService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

/**
 * @desc    Get interview preparation dashboard stats
 * @route   GET /api/interviews/stats
 * @access  Private
 */
export const getInterviewDashboardStats = async (req, res, next) => {
  try {
    const stats = await getInterviewStats(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// AI QUESTION GENERATION
// ═══════════════════════════════════════════════════════════

/**
 * @desc    Generate questions using AI and optionally save to bank
 * @route   POST /api/interviews/ai/generate
 * @access  Private
 */
export const generateAIQuestions = async (req, res, next) => {
  try {
    const { company, role, category, count = 5, saveToBank = false } = req.body;

    const result = await generateQuestions(company, role, category, count);

    // If user wants to save generated questions to the shared bank
    if (saveToBank && result.questions.length > 0) {
      const questionsToSave = result.questions.map(q => ({
        company,
        role,
        category,
        question: q,
        difficulty: 'Medium', // Default for AI-generated
        source: result.source === 'ai' ? 'AI Generated' : 'Community'
      }));

      const saved = await addBulkQuestions(questionsToSave);
      return res.status(201).json({
        questions: result.questions,
        source: result.source,
        savedCount: saved.length,
        savedQuestions: saved
      });
    }

    res.status(200).json({
      questions: result.questions,
      source: result.source
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
