import { db } from './db.js';

// Text normalizer: remove HTML, punctuation, downcase, tokenize
const tokenize = (text) => {
  if (!text) return [];
  const clean = text
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.split(' ').filter(word => word.length > 2);
};

// Generate n-grams (default 3-grams / trigrams)
const getNGrams = (tokens, n = 3) => {
  const ngrams = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
};

// Jaccard similarity between two n-gram sets
const jaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

// Levenshtein distance for title comparison
const levenshteinDistance = (str1, str2) => {
  const a = str1.toLowerCase().trim();
  const b = str2.toLowerCase().trim();
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

export class OriginalityEngine {
  // Check an article against existing articles in the database and source texts
  evaluateArticle({ title, content, excludeId = null, sourceTexts = [] }) {
    const existingArticles = db.getAllArticles().filter(a => a.id !== excludeId);
    const newTokens = tokenize(content);
    const newShingles = getNGrams(newTokens, 3);

    let maxSimilarity = 0;
    let mostSimilarArticle = null;
    let duplicateTitleFound = false;

    // 1. Check title duplicates and near-duplicates
    for (const art of existingArticles) {
      if (art.title.toLowerCase().trim() === title.toLowerCase().trim()) {
        duplicateTitleFound = true;
        break;
      }
      const dist = levenshteinDistance(art.title, title);
      const maxLen = Math.max(art.title.length, title.length);
      const titleSimilarity = 1 - (dist / maxLen);
      if (titleSimilarity > 0.85) {
        duplicateTitleFound = true;
        break;
      }
    }

    // 2. Check 3-gram shingle similarity against all existing articles
    for (const art of existingArticles) {
      const artTokens = tokenize(art.content);
      const artShingles = getNGrams(artTokens, 3);
      const sim = jaccardSimilarity(newShingles, artShingles);

      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        mostSimilarArticle = art.title;
      }
    }

    // 3. Check similarity against source texts (avoid verbatim copy/paste)
    let maxSourceSimilarity = 0;
    for (const src of sourceTexts) {
      const srcTokens = tokenize(src);
      const srcShingles = getNGrams(srcTokens, 3);
      const sim = jaccardSimilarity(newShingles, srcShingles);
      if (sim > maxSourceSimilarity) maxSourceSimilarity = sim;
    }

    // 4. Word count & thin content check
    const wordCount = newTokens.length;
    const isThinContent = wordCount < 300;

    // Calculate originality score (100 - max penalties)
    const similarityPercent = Math.round(maxSimilarity * 100);
    const sourceOverlapPercent = Math.round(maxSourceSimilarity * 100);
    let originalityScore = 100 - (similarityPercent * 1.5) - (sourceOverlapPercent * 1.2);
    if (duplicateTitleFound) originalityScore -= 40;
    if (isThinContent) originalityScore -= 30;
    originalityScore = Math.max(0, Math.min(100, Math.round(originalityScore)));

    // Quality gate verdict: similarity must be <= 25% and no duplicate title
    const passed = !duplicateTitleFound && similarityPercent <= 25 && !isThinContent;

    return {
      passed,
      originalityScore,
      duplicateTitleFound,
      maxInternalSimilarity: similarityPercent,
      mostSimilarArticle,
      sourceOverlapPercent,
      wordCount,
      isThinContent,
      notes: passed 
        ? 'High originality confirmed. Shingle overlap with existing database is within acceptable threshold.'
        : `Originality check failed: ${duplicateTitleFound ? 'Duplicate title detected. ' : ''}${similarityPercent > 25 ? `Internal similarity ${similarityPercent}% exceeds 25% threshold. ` : ''}${isThinContent ? 'Article contains thin content (<300 words).' : ''}`
    };
  }
}

export const originalityEngine = new OriginalityEngine();
