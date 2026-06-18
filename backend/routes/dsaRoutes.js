import express from 'express';
import {
  addProblem,
  listProblems,
  getProblem,
  editProblem,
  removeProblem,
  getDSADashboardStats
} from '../controllers/dsaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, dsaValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth protection to all routes
router.use(protect);

// Dashboard stats aggregation (must be before :id routes)
router.get('/stats', getDSADashboardStats);

// Base CRUD endpoints
router.get('/', listProblems);
router.post('/', validate(dsaValidator.create), addProblem);
router.get('/:id', getProblem);
router.put('/:id', validate(dsaValidator.update), editProblem);
router.delete('/:id', removeProblem);

export default router;
