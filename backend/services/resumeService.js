import Resume from '../models/Resume.js';
import fs from 'fs';
import path from 'path';

/**
 * Upload a new resume and auto-increment version
 * @param {string} userId
 * @param {Object} fileData - Multer file object
 * @returns {Object} Created resume document
 */
export const uploadResume = async (userId, fileData) => {
  // Calculate next version number
  const lastResume = await Resume.findOne({ userId })
    .sort({ version: -1 })
    .select('version');

  const nextVersion = lastResume ? lastResume.version + 1 : 1;

  const resume = await Resume.create({
    userId,
    version: nextVersion,
    originalName: fileData.originalname,
    fileName: fileData.filename,
    filePath: fileData.path,
    fileSize: fileData.size,
    status: 'active'
  });

  return resume;
};

/**
 * Get all resumes for a user, sorted by version descending
 * @param {string} userId
 * @returns {Array} List of resume documents
 */
export const getResumes = async (userId) => {
  const resumes = await Resume.find({ userId })
    .sort({ version: -1 });
  return resumes;
};

/**
 * Get the latest active resume for a user
 * @param {string} userId
 * @returns {Object|null} Latest resume document or null
 */
export const getLatestResume = async (userId) => {
  const resume = await Resume.findOne({ userId, status: 'active' })
    .sort({ version: -1 });
  return resume;
};

/**
 * Get a single resume by ID with ownership check
 * @param {string} resumeId
 * @param {string} userId
 * @returns {Object} Resume document
 */
export const getResumeById = async (resumeId, userId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new Error('Resume not found or access denied');
  }
  return resume;
};

/**
 * Delete a resume and remove the file from disk
 * @param {string} resumeId
 * @param {string} userId
 * @returns {Object} Deletion confirmation
 */
export const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new Error('Resume not found or access denied');
  }

  // Remove file from disk if it exists
  try {
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
  } catch (fileErr) {
    console.error(`[ResumeService] Failed to remove file: ${fileErr.message}`);
  }

  await Resume.findByIdAndDelete(resumeId);
  return { message: 'Resume deleted successfully' };
};

/**
 * Get resume stats for dashboard
 * @param {string} userId
 * @returns {Object} Resume statistics
 */
export const getResumeStats = async (userId) => {
  const resumes = await Resume.find({ userId }).sort({ version: -1 });
  const latestResume = resumes.length > 0 ? resumes[0] : null;

  return {
    totalResumes: resumes.length,
    latestVersion: latestResume ? latestResume.version : 0,
    lastUploadedAt: latestResume ? latestResume.uploadedAt : null
  };
};
