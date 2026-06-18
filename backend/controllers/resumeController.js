import {
  uploadResume as uploadResumeService,
  getResumes,
  getLatestResume,
  getResumeById,
  deleteResume as deleteResumeService,
  getResumeStats
} from '../services/resumeService.js';
import path from 'path';

/**
 * @desc    Upload a new resume (PDF)
 * @route   POST /api/resumes/upload
 * @access  Private
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload a PDF file'));
    }

    const resume = await uploadResumeService(req.user._id, req.file);
    res.status(201).json(resume);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    List all resumes for the user
 * @route   GET /api/resumes
 * @access  Private
 */
export const listResumes = async (req, res, next) => {
  try {
    const resumes = await getResumes(req.user._id);
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Get the latest active resume
 * @route   GET /api/resumes/latest
 * @access  Private
 */
export const fetchLatestResume = async (req, res, next) => {
  try {
    const resume = await getLatestResume(req.user._id);
    res.status(200).json(resume || { message: 'No resumes uploaded yet' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Download a resume file by ID
 * @route   GET /api/resumes/:id/download
 * @access  Private
 */
export const downloadResume = async (req, res, next) => {
  try {
    const resume = await getResumeById(req.params.id, req.user._id);
    
    const filePath = path.resolve(resume.filePath);
    res.download(filePath, resume.originalName, (err) => {
      if (err) {
        console.error(`[ResumeController] Download error: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading file' });
        }
      }
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
export const removeResume = async (req, res, next) => {
  try {
    const result = await deleteResumeService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Get resume stats for dashboard
 * @route   GET /api/resumes/stats
 * @access  Private
 */
export const fetchResumeStats = async (req, res, next) => {
  try {
    const stats = await getResumeStats(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
