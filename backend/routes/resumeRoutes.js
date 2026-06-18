import express from 'express';
import {
  uploadResume,
  listResumes,
  fetchLatestResume,
  downloadResume,
  removeResume,
  fetchResumeStats
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadResumeMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth protection to all routes
router.use(protect);

// Stats route (must be before :id routes)
router.get('/stats', fetchResumeStats);

// Latest resume route (must be before :id routes)
router.get('/latest', fetchLatestResume);

// Upload a new resume (multipart/form-data with 'resume' field)
router.post('/upload', (req, res, next) => {
  uploadResumeMiddleware.single('resume')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
}, uploadResume);

// List all resumes
router.get('/', listResumes);

// Download resume by ID
router.get('/:id/download', downloadResume);

// Delete resume by ID
router.delete('/:id', removeResume);

export default router;
