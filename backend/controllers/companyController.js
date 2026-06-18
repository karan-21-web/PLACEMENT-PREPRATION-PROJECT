import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getDashboardAggregation
} from '../services/companyService.js';

/**
 * @desc    Get all tracked companies
 * @route   GET /api/companies
 * @access  Private
 */
export const listCompanies = async (req, res, next) => {
  try {
    const companies = await getCompanies(req.user._id);
    res.status(200).json(companies);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Get company details by ID
 * @route   GET /api/companies/:id
 * @access  Private
 */
export const getCompanyDetails = async (req, res, next) => {
  try {
    const company = await getCompanyById(req.params.id, req.user._id);
    res.status(200).json(company);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

/**
 * @desc    Add a target company tracker
 * @route   POST /api/companies
 * @access  Private
 */
export const addNewCompany = async (req, res, next) => {
  try {
    const company = await createCompany(req.user._id, req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Update pipeline status or details for a company
 * @route   PUT /api/companies/:id
 * @access  Private
 */
export const updateCompanyDetails = async (req, res, next) => {
  try {
    const company = await updateCompany(req.params.id, req.user._id, req.body);
    res.status(200).json(company);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Remove a company from tracker
 * @route   DELETE /api/companies/:id
 * @access  Private
 */
export const removeCompany = async (req, res, next) => {
  try {
    const result = await deleteCompany(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Fetch aggregated dashboard analytics and stats
 * @route   GET /api/companies/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardAggregation(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
