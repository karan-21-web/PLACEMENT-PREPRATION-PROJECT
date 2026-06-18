import Company from '../models/Company.js';

/**
 * Get all companies for a user
 * @param {string} userId
 * @returns {Array} List of company documents
 */
export const getCompanies = async (userId) => {
  const companies = await Company.find({ userId }).sort({ updatedAt: -1 });
  return companies;
};

/**
 * Get a single company by ID (with ownership check)
 * @param {string} companyId
 * @param {string} userId
 * @returns {Object} Company document
 */
export const getCompanyById = async (companyId, userId) => {
  const company = await Company.findOne({ _id: companyId, userId });
  if (!company) {
    throw new Error('Company not found or access denied');
  }
  return company;
};

/**
 * Create a new company tracker entry
 * @param {string} userId
 * @param {Object} companyData
 * @returns {Object} Created company document
 */
export const createCompany = async (userId, companyData) => {
  const company = await Company.create({
    userId,
    ...companyData,
  });
  return company;
};

/**
 * Update a company tracker entry
 * @param {string} companyId
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Object} Updated company document
 */
export const updateCompany = async (companyId, userId, updateData) => {
  const company = await Company.findOne({ _id: companyId, userId });
  if (!company) {
    throw new Error('Company not found or access denied');
  }

  // Apply updates dynamically
  const allowedFields = [
    'name', 'role', 'packageLpa', 'status',
    'aptitudeStatus', 'dsaStatus', 'resumeStatus', 'interviewStatus',
    'applicationLink', 'notes', 'interviewDate'
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      company[field] = updateData[field];
    }
  });

  const updatedCompany = await company.save();
  return updatedCompany;
};

/**
 * Delete a company tracker entry
 * @param {string} companyId
 * @param {string} userId
 * @returns {Object} Deletion confirmation
 */
export const deleteCompany = async (companyId, userId) => {
  const company = await Company.findOneAndDelete({ _id: companyId, userId });
  if (!company) {
    throw new Error('Company not found or access denied');
  }
  return { message: 'Company removed from tracker successfully' };
};

/**
 * Get aggregated dashboard stats for a user's companies
 * @param {string} userId
 * @returns {Object} Dashboard statistics
 */
export const getDashboardAggregation = async (userId) => {
  const companies = await Company.find({ userId });

  const totalCompanies = companies.length;

  // Status counts
  const statusCounts = {
    wishlist: 0,
    applied: 0,
    preparing: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
  };

  // Pipeline progress counters
  const pipelineProgress = {
    aptCompleted: 0,
    dsaCompleted: 0,
    resumeSubmitted: 0,
    interviewsCompleted: 0,
  };

  // Upcoming interviews (future dates)
  const now = new Date();
  const upcomingInterviews = [];

  companies.forEach((company) => {
    // Count statuses
    if (statusCounts[company.status] !== undefined) {
      statusCounts[company.status]++;
    }

    // Count pipeline completions
    if (company.aptitudeStatus === 'completed') pipelineProgress.aptCompleted++;
    if (company.dsaStatus === 'completed') pipelineProgress.dsaCompleted++;
    if (['submitted', 'shortlisted'].includes(company.resumeStatus)) pipelineProgress.resumeSubmitted++;
    if (company.interviewStatus === 'completed') pipelineProgress.interviewsCompleted++;

    // Collect upcoming interviews
    if (company.interviewDate && new Date(company.interviewDate) >= now) {
      upcomingInterviews.push({
        _id: company._id,
        name: company.name,
        role: company.role,
        status: company.status,
        interviewDate: company.interviewDate,
      });
    }
  });

  // Sort upcoming interviews by date ascending
  upcomingInterviews.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

  return {
    totalCompanies,
    statusCounts,
    pipelineProgress,
    upcomingInterviews: upcomingInterviews.slice(0, 5), // Limit to 5
  };
};
