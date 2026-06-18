import express from 'express';
import {
  addQuestion,
  listQuestions,
  removeQuestion,
  listCompanies,
  createSession,
  listSessions,
  updateSession,
  completeSessionHandler,
  removeSession,
  getInterviewDashboardStats,
  generateAIQuestions
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, interviewValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth protection to all routes
router.use(protect);

// ─── Dashboard Stats (must be before dynamic :id routes) ───
router.get('/stats', getInterviewDashboardStats);

// ─── Question Bank ───
router.get('/questions/companies', listCompanies);
router.get('/questions', listQuestions);
router.post('/questions', validate(interviewValidator.createQuestion), addQuestion);
router.delete('/questions/:id', removeQuestion);

// ─── Practice Sessions ───
router.get('/sessions', listSessions);
router.post('/sessions', validate(interviewValidator.createSession), createSession);
router.put('/sessions/:id', validate(interviewValidator.updateSession), updateSession);
router.put('/sessions/:id/complete', validate(interviewValidator.updateSession), completeSessionHandler);
router.delete('/sessions/:id', removeSession);

// ─── AI Generation ───
router.post('/ai/generate', validate(interviewValidator.generateAI), generateAIQuestions);

export default router;
