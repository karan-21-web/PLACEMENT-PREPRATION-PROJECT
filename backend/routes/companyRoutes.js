import express from 'express';
import {
  listCompanies,
  getCompanyDetails,
  addNewCompany,
  updateCompanyDetails,
  removeCompany,
  getDashboardStats
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, companyValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth protection to all routes in this router
router.use(protect);

// Dashboard stats aggregation (Must be declared before standard dynamic :id route)
router.get('/dashboard/stats', getDashboardStats);

// Base CRUD endpoints
router.get('/', listCompanies);
router.post('/', validate(companyValidator.create), addNewCompany);
router.get('/:id', getCompanyDetails);
router.put('/:id', validate(companyValidator.update), updateCompanyDetails);
router.delete('/:id', removeCompany);

export default router;
