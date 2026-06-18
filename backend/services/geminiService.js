import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Fallback questions when Gemini API is unavailable or unconfigured.
 * Organized by category to provide meaningful defaults.
 */
const FALLBACK_QUESTIONS = {
  HR: [
    'Tell me about yourself and why you are interested in this role.',
    'What are your greatest strengths and areas for improvement?',
    'Where do you see yourself in 5 years?',
    'Describe a challenging situation you faced and how you resolved it.',
    'Why should we hire you over other candidates?'
  ],
  Technical: [
    'Explain the difference between process and thread.',
    'What is the difference between stack and heap memory?',
    'Explain RESTful API design principles.',
    'What are SOLID principles in software engineering?',
    'Describe the MVC architecture pattern and its advantages.'
  ],
  DSA: [
    'Explain the time complexity of common sorting algorithms.',
    'What is the difference between BFS and DFS? When would you use each?',
    'Explain dynamic programming with a real-world example.',
    'How does a hash map work internally?',
    'What is the difference between a binary tree and a binary search tree?'
  ],
  OOPs: [
    'Explain the four pillars of Object-Oriented Programming.',
    'What is the difference between abstraction and encapsulation?',
    'Explain polymorphism with a code example.',
    'What are design patterns? Name three commonly used ones.',
    'What is the difference between composition and inheritance?'
  ],
  DBMS: [
    'What is normalization? Explain up to 3NF.',
    'What is the difference between SQL and NoSQL databases?',
    'Explain ACID properties in database transactions.',
    'What are indexes and how do they improve query performance?',
    'Explain the difference between inner join and outer join.'
  ],
  OS: [
    'What is a deadlock? How can it be prevented?',
    'Explain the difference between paging and segmentation.',
    'What are the different CPU scheduling algorithms?',
    'Explain virtual memory and its advantages.',
    'What is the difference between mutex and semaphore?'
  ],
  CN: [
    'Explain the OSI model and its seven layers.',
    'What is the difference between TCP and UDP?',
    'How does DNS resolution work?',
    'Explain the TCP three-way handshake.',
    'What is the difference between HTTP and HTTPS?'
  ],
  Projects: [
    'Walk me through the architecture of your most complex project.',
    'What were the key technical decisions you made and why?',
    'How did you handle scalability concerns in your project?',
    'Describe a bug you encountered and how you debugged it.',
    'What would you do differently if you rebuilt this project?'
  ]
};

/**
 * Generate interview questions using Google Gemini AI.
 * Falls back to curated sample questions if API key is missing or call fails.
 *
 * @param {string} company - Target company name
 * @param {string} role - Target job role
 * @param {string} category - Question category
 * @param {number} count - Number of questions to generate (default: 5)
 * @returns {Object} { questions: string[], source: 'ai'|'fallback' }
 */
export const generateQuestions = async (company, role, category, count = 5) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key, return fallback immediately
  if (!apiKey) {
    console.log('[GeminiService] No GEMINI_API_KEY configured — using fallback questions.');
    return {
      questions: getFallbackQuestions(category, count),
      source: 'fallback'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert placement interview coach for Indian engineering students.

Generate exactly ${count} interview questions for a ${role} position at ${company}.

Category: ${category}

Rules:
- Questions should be realistic and commonly asked in actual placement drives.
- Difficulty should vary from easy to hard.
- Each question should be a single, clear sentence.
- Focus on concepts that ${company} specifically values.
- Do NOT include numbering or bullet points in individual questions.

Return ONLY a valid JSON array of strings, with no additional text or markdown.
Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

    // Set a 10-second timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const result = await model.generateContent(prompt, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseText = result.response.text().trim();

    // Parse the JSON response — handle potential markdown wrapping
    let cleanText = responseText;
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(cleanText);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        questions: parsed.slice(0, count).map(q => String(q).trim()),
        source: 'ai'
      };
    }

    // If parsing succeeded but result is unexpected, fallback
    console.warn('[GeminiService] AI response was not a valid question array. Falling back.');
    return {
      questions: getFallbackQuestions(category, count),
      source: 'fallback'
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[GeminiService] Request timed out after 10 seconds.');
    } else {
      console.error(`[GeminiService] API error: ${error.message}`);
    }

    return {
      questions: getFallbackQuestions(category, count),
      source: 'fallback'
    };
  }
};

/**
 * Get fallback questions for a given category.
 * @param {string} category
 * @param {number} count
 * @returns {string[]}
 */
const getFallbackQuestions = (category, count) => {
  const pool = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS['Technical'];
  // Shuffle and return requested count
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
