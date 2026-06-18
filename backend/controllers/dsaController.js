import {
  addProblem as addProblemService,
  getProblems,
  getProblemById,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService,
  getDSAStats
} from '../services/dsaService.js';

/**
 * @desc    Add a new solved DSA problem
 * @route   POST /api/dsa
 * @access  Private
 */
export const addProblem = async (req, res, next) => {
  try {
    const problem = await addProblemService(req.user._id, req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    List DSA problems with optional filters
 * @route   GET /api/dsa
 * @access  Private
 */
export const listProblems = async (req, res, next) => {
  try {
    const { search, difficulty, topic, platform } = req.query;
    const problems = await getProblems(req.user._id, {
      search,
      difficulty,
      topic,
      platform
    });
    res.status(200).json(problems);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * @desc    Get a single DSA problem
 * @route   GET /api/dsa/:id
 * @access  Private
 */
export const getProblem = async (req, res, next) => {
  try {
    const problem = await getProblemById(req.params.id, req.user._id);
    res.status(200).json(problem);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

/**
 * @desc    Update a DSA problem
 * @route   PUT /api/dsa/:id
 * @access  Private
 */
export const editProblem = async (req, res, next) => {
  try {
    const problem = await updateProblemService(req.params.id, req.user._id, req.body);
    res.status(200).json(problem);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Delete a DSA problem
 * @route   DELETE /api/dsa/:id
 * @access  Private
 */
export const removeProblem = async (req, res, next) => {
  try {
    const result = await deleteProblemService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Get DSA dashboard stats
 * @route   GET /api/dsa/stats
 * @access  Private
 */
export const getDSADashboardStats = async (req, res, next) => {
  try {
    const stats = await getDSAStats(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
