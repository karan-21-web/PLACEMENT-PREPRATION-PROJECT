import DSAProblem from '../models/DSAProblem.js';

/**
 * Add a new solved DSA problem
 * @param {string} userId
 * @param {Object} problemData
 * @returns {Object} Created problem document
 */
export const addProblem = async (userId, problemData) => {
  const problem = await DSAProblem.create({
    userId,
    ...problemData
  });
  return problem;
};

/**
 * Get all DSA problems for a user with optional filters
 * @param {string} userId
 * @param {Object} filters - { search, difficulty, topic, platform }
 * @returns {Array} List of problem documents
 */
export const getProblems = async (userId, filters = {}) => {
  const query = { userId };

  // Apply filters
  if (filters.difficulty && filters.difficulty !== 'all') {
    query.difficulty = filters.difficulty;
  }
  if (filters.topic && filters.topic !== 'all') {
    query.topic = filters.topic;
  }
  if (filters.platform && filters.platform !== 'all') {
    query.platform = filters.platform;
  }

  // Text search on title
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  const problems = await DSAProblem.find(query)
    .sort({ solvedAt: -1 });

  return problems;
};

/**
 * Get a single problem by ID with ownership check
 * @param {string} problemId
 * @param {string} userId
 * @returns {Object} Problem document
 */
export const getProblemById = async (problemId, userId) => {
  const problem = await DSAProblem.findOne({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }
  return problem;
};

/**
 * Update a DSA problem
 * @param {string} problemId
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Object} Updated problem document
 */
export const updateProblem = async (problemId, userId, updateData) => {
  const problem = await DSAProblem.findOne({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }

  const allowedFields = ['title', 'difficulty', 'topic', 'platform', 'notes', 'link', 'solvedAt'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      problem[field] = updateData[field];
    }
  });

  const updatedProblem = await problem.save();
  return updatedProblem;
};

/**
 * Delete a DSA problem
 * @param {string} problemId
 * @param {string} userId
 * @returns {Object} Deletion confirmation
 */
export const deleteProblem = async (problemId, userId) => {
  const problem = await DSAProblem.findOneAndDelete({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }
  return { message: 'Problem removed successfully' };
};

/**
 * Get DSA stats for dashboard
 * @param {string} userId
 * @returns {Object} DSA statistics and distributions
 */
export const getDSAStats = async (userId) => {
  const problems = await DSAProblem.find({ userId });

  const totalSolved = problems.length;

  // Difficulty distribution
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  
  // Topic distribution
  const topicDistribution = {};
  
  // Platform distribution
  const platformDistribution = {};

  problems.forEach((p) => {
    // Count difficulties
    if (difficultyCounts[p.difficulty] !== undefined) {
      difficultyCounts[p.difficulty]++;
    }

    // Count topics
    topicDistribution[p.topic] = (topicDistribution[p.topic] || 0) + 1;

    // Count platforms
    platformDistribution[p.platform] = (platformDistribution[p.platform] || 0) + 1;
  });

  return {
    totalSolved,
    difficultyCounts,
    topicDistribution,
    platformDistribution
  };
};

// ─────────────────────────────────────────────────────────
// LeetCode Integration
// ─────────────────────────────────────────────────────────

/**
 * Fetch public LeetCode profile stats and recent accepted submissions.
 * Uses LeetCode's official public GraphQL endpoint — no auth needed.
 *
 * LIMITATION: recentAcSubmissionList returns at most 20 problems for
 * public profiles. Difficulty is not provided by this API.
 *
 * @param {string} username - LeetCode username
 * @returns {Object} { username, stats, problems, note }
 */
export const fetchLeetCodeData = async (username) => {
  const LEETCODE_GQL = 'https://leetcode.com/graphql/';

  const query = `
    query getUserData($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: 20) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  let response;
  try {
    response = await fetch(LEETCODE_GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (compatible; PrepPilot/1.0)',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });
  } catch (networkErr) {
    throw new Error('Could not reach the LeetCode API. Please check your internet connection.');
  }

  if (!response.ok) {
    throw new Error(`LeetCode API returned an error (HTTP ${response.status}). Please try again later.`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(`LeetCode API error: ${json.errors[0].message}`);
  }

  const user = json.data?.matchedUser;
  if (!user) {
    throw new Error(`LeetCode user "${username}" was not found. Please check the username and try again.`);
  }

  // Parse difficulty stats from the response
  const stats = { total: 0, easy: 0, medium: 0, hard: 0 };
  (user.submitStats?.acSubmissionNum || []).forEach((item) => {
    if (item.difficulty === 'All') stats.total = item.count;
    if (item.difficulty === 'Easy') stats.easy = item.count;
    if (item.difficulty === 'Medium') stats.medium = item.count;
    if (item.difficulty === 'Hard') stats.hard = item.count;
  });

  const rawSubmissions = json.data?.recentAcSubmissionList || [];

  // Deduplicate: same problem can appear multiple times in submission history
  const seen = new Set();
  const problems = [];
  for (const s of rawSubmissions) {
    if (!seen.has(s.titleSlug)) {
      seen.add(s.titleSlug);
      problems.push({
        title: s.title,
        titleSlug: s.titleSlug,
        link: `https://leetcode.com/problems/${s.titleSlug}/`,
      });
    }
  }

  return {
    username: user.username,
    stats,
    problems,
    // Be transparent about the limitation
    note: 'Showing up to 20 most recent accepted submissions. Difficulty defaults to Medium on import (LeetCode API does not include difficulty in recent submissions).',
  };
};

/**
 * Bulk-import LeetCode problems into the user's DSA tracker.
 * Skips problems that are already present (title + platform = LeetCode match).
 *
 * @param {string} userId
 * @param {Array} problems  - [{ title, titleSlug, link }]
 * @returns {Object} { added, skipped, message }
 */
export const syncLeetCodeProblems = async (userId, problems) => {
  // Find existing LeetCode problems to avoid duplicates
  const existing = await DSAProblem.find({ userId, platform: 'LeetCode' }).select('title');
  const existingTitles = new Set(existing.map((p) => p.title.toLowerCase()));

  // Keep only problems not already in the tracker
  const toAdd = problems.filter((p) => !existingTitles.has(p.title.toLowerCase()));

  if (toAdd.length === 0) {
    return {
      added: 0,
      skipped: problems.length,
      message: `All ${problems.length} problem${problems.length !== 1 ? 's' : ''} already exist in your tracker.`,
    };
  }

  // Bulk insert — difficulty/topic unavailable from public API, use safe defaults
  await DSAProblem.insertMany(
    toAdd.map((p) => ({
      userId,
      title: p.title,
      difficulty: 'Medium',   // default — edit manually to correct
      topic: 'Other',         // default — edit manually to correct
      platform: 'LeetCode',
      link: p.link || '',
      notes: 'Imported from LeetCode',
      solvedAt: new Date(),
    }))
  );

  const skipped = problems.length - toAdd.length;
  return {
    added: toAdd.length,
    skipped,
    message: `Added ${toAdd.length} new problem${toAdd.length !== 1 ? 's' : ''}. ${skipped > 0 ? `Skipped ${skipped} duplicate${skipped !== 1 ? 's' : ''}.` : ''}`.trim(),
  };
};
