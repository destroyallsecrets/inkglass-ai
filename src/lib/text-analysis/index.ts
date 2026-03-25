export interface ReadabilityResult {
  fleschKincaidGrade: number
  fleschReadingEase: number
  smogIndex: number
  colemanLiauIndex: number
  automatedReadabilityIndex: number
  averageGradeLevel: number
  wordCount: number
  sentenceCount: number
  syllableCount: number
  avgWordsPerSentence: number
  avgSyllablesPerWord: number
  gradeLabel: string
}

export interface SentimentResult {
  score: number
  label: 'positive' | 'negative' | 'neutral'
  confidence: number
  positiveWords: string[]
  negativeWords: string[]
  wordCount: number
}

export interface KeywordResult {
  word: string
  frequency: number
  tfidf: number
  relevance: number
}

export interface TextStatistics {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  avgWordLength: number
  avgSentenceLength: number
  uniqueWords: number
  wordDensity: { word: string; count: number }[]
}

export interface SummarizationResult {
  summary: string
  keyPoints: string[]
  wordCountOriginal: number
  wordCountSummary: number
  compressionRatio: number
}

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'outstanding', 'brilliant', 'superb', 'terrific', 'magnificent', 'exceptional',
  'marvelous', 'splendid', 'fine', 'pleasant', 'delightful', 'lovely', 'beautiful',
  'happy', 'joy', 'love', 'adore', 'appreciate', 'grateful', 'thankful', 'blessed',
  'exciting', 'thrilling', 'impressive', 'stunning', 'gorgeous', 'perfect', 'best',
  'better', 'improve', 'improved', 'success', 'successful', 'win', 'winning',
  'achieve', 'achievement', 'accomplish', 'progress', 'grow', 'growth', 'benefit',
  'beneficial', 'helpful', 'useful', 'valuable', 'important', 'significant',
  'easy', 'simple', 'clear', 'effective', 'efficient', 'powerful', 'strong',
  'creative', 'innovative', 'smart', 'intelligent', 'clever', 'brilliant',
  'kind', 'generous', 'friendly', 'nice', 'polite', 'respectful', 'honest',
  'safe', 'secure', 'reliable', 'trustworthy', 'confident', 'optimistic',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'dreadful', 'appalling',
  'atrocious', 'abysmal', 'dismal', 'frightful', 'shocking', 'disgusting',
  'nasty', 'ugly', 'repulsive', ' revolting', 'sickening', 'vile', 'foul',
  'sad', 'unhappy', 'depressed', 'miserable', 'gloomy', 'melancholy', 'sorrow',
  'grief', 'anguish', 'pain', 'suffer', 'suffering', 'hurt', 'damage', 'damaged',
  'harm', 'harmful', 'dangerous', 'risky', 'unsafe', 'threat', 'threaten',
  'fear', 'afraid', 'scared', 'worried', 'anxious', 'nervous', 'tense',
  'hate', 'hatred', 'despise', 'loathe', 'dislike', 'disgust', 'repulse',
  'fail', 'failure', 'failed', 'failing', 'wrong', 'error', 'mistake', 'fault',
  'problem', 'issue', 'bug', 'defect', 'trouble', 'difficulty', 'difficult',
  'hard', 'complex', 'complicated', 'confusing', 'unclear', 'ambiguous',
  'slow', 'sluggish', 'inefficient', 'waste', 'wasted', 'useless', 'worthless',
  'boring', 'tedious', ' dull', 'monotonous', 'annoying', 'irritating', 'frustrating',
  'angry', 'mad', 'furious', 'rage', 'irate', 'outraged', 'livid',
  'weak', 'fragile', 'broken', 'crash', 'crashed', 'crashing', 'corrupt', 'corrupted',
]);

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function getWords(text: string): string[] {
  return text.toLowerCase().match(/\b[a-z]+(?:'[a-z]+)?\b/g) || [];
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
}

export function analyzeReadability(text: string): ReadabilityResult {
  const words = getWords(text);
  const sentences = getSentences(text);
  
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  
  let syllableCount = 0;
  for (const word of words) {
    syllableCount += countSyllables(word);
  }
  
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;
  
  const fleschReadingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const fleschKincaidGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  
  const letterCount = words.join('').length;
  const smogIndex = 1.043 * Math.sqrt(syllableCount * (30 / sentenceCount)) + 3.1291;
  
  const l = (letterCount / wordCount) * 100;
  const s = (sentenceCount / wordCount) * 100;
  const colemanLiauIndex = 0.0588 * l - 0.296 * s - 15.8;
  
  const ari = 4.71 * (letterCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
  
  const averageGradeLevel = (fleschKincaidGrade + colemanLiauIndex + ari + smogIndex) / 4;
  
  let gradeLabel: string;
  if (averageGradeLevel <= 5) gradeLabel = 'Elementary';
  else if (averageGradeLevel <= 8) gradeLabel = 'Middle School';
  else if (averageGradeLevel <= 12) gradeLabel = 'High School';
  else if (averageGradeLevel <= 16) gradeLabel = 'College';
  else gradeLabel = 'Graduate';
  
  return {
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
    fleschReadingEase: Math.max(0, Math.min(100, Math.round(fleschReadingEase * 10) / 10)),
    smogIndex: Math.round(smogIndex * 10) / 10,
    colemanLiauIndex: Math.round(colemanLiauIndex * 10) / 10,
    automatedReadabilityIndex: Math.round(ari * 10) / 10,
    averageGradeLevel: Math.round(averageGradeLevel * 10) / 10,
    wordCount,
    sentenceCount,
    syllableCount,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
    gradeLabel,
  };
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = getWords(text);
  const wordCount = words.length;
  
  let positiveCount = 0;
  let negativeCount = 0;
  const positiveWordsFound: string[] = [];
  const negativeWordsFound: string[] = [];
  
  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      positiveCount++;
      if (!positiveWordsFound.includes(word)) positiveWordsFound.push(word);
    }
    if (NEGATIVE_WORDS.has(word)) {
      negativeCount++;
      if (!negativeWordsFound.includes(word)) negativeWordsFound.push(word);
    }
  }
  
  const rawScore = (positiveCount - negativeCount) / Math.max(1, wordCount);
  const score = Math.max(-1, Math.min(1, rawScore * 10));
  
  let label: 'positive' | 'negative' | 'neutral';
  if (score > 0.1) label = 'positive';
  else if (score < -0.1) label = 'negative';
  else label = 'neutral';
  
  const maxPossible = Math.max(1, wordCount);
  const confidence = Math.min(1, (positiveCount + negativeCount) / maxPossible);
  
  return {
    score: Math.round(score * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
    positiveWords: positiveWordsFound,
    negativeWords: negativeWordsFound,
    wordCount,
  };
}

export function extractKeywords(text: string, limit: number = 20): KeywordResult[] {
  const words = getWords(text);
  
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
    'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
    'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
    'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
    'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
    'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
    'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has',
    'had', 'were', 'said', 'did', 'get', 'made', 'find', 'found', 'here', 'many',
    'such', 'being', 'where', 'those', 'may', 'should', 'am', 'very', 'still', 'too',
  ]);
  
  const wordFreq: Record<string, number> = {};
  for (const word of words) {
    if (word.length > 2 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }
  
  const totalWords = words.length;
  const uniqueWords = Object.keys(wordFreq).length;
  
  const results: KeywordResult[] = Object.entries(wordFreq)
    .map(([word, frequency]) => {
      const tf = frequency / totalWords;
      const idf = Math.log(totalWords / (1 + uniqueWords));
      const tfidf = tf * idf;
      const relevance = (frequency / Math.max(...Object.values(wordFreq))) * 100;
      
      return { word, frequency, tfidf: Math.round(tfidf * 10000) / 10000, relevance: Math.round(relevance) };
    })
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
  
  return results;
}

export function getTextStatistics(text: string): TextStatistics {
  const words = getWords(text);
  const sentences = getSentences(text);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const uniqueWords = new Set(words);
  
  const wordFreq: Record<string, number> = {};
  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }
  
  const wordDensity = Object.entries(wordFreq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const avgWordLength = words.length > 0 ? words.reduce((sum, w) => sum + w.length, 0) / words.length : 0;
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  
  return {
    characters: totalChars,
    charactersNoSpaces: charsNoSpaces,
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    uniqueWords: uniqueWords.size,
    wordDensity,
  };
}

export function summarizeText(text: string, sentenceLimit: number = 5): SummarizationResult {
  const sentences = getSentences(text);
  const words = getWords(text);
  
  if (sentences.length <= sentenceLimit) {
    return {
      summary: text,
      keyPoints: sentences.map(s => s.trim()).filter(s => s.length > 0),
      wordCountOriginal: words.length,
      wordCountSummary: words.length,
      compressionRatio: 100,
    };
  }
  
  const keywords = extractKeywords(text, 10);
  const keywordSet = new Set(keywords.map(k => k.word));
  
  const sentenceScores: { sentence: string; score: number }[] = sentences
    .map((sentence, index) => {
      const sentenceWords = getWords(sentence);
      let score = 0;
      
      for (const word of sentenceWords) {
        if (keywordSet.has(word)) {
          score += 1;
        }
      }
      
      if (index === 0) score *= 1.5;
      if (index === sentences.length - 1) score *= 1.3;
      
      const avgLen = sentenceWords.length;
      if (avgLen >= 10 && avgLen <= 25) score *= 1.2;
      
      return { sentence: sentence.trim(), score };
    })
    .filter(s => s.sentence.length > 20);
  
  sentenceScores.sort((a, b) => b.score - a.score);
  
  const topSentences = sentenceScores.slice(0, sentenceLimit)
    .map(s => s.sentence)
    .sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));
  
  const summary = topSentences.join('. ');
  const summaryWords = getWords(summary);
  
  const keyPoints = extractKeywords(text, 5).map(k => k.word);
  
  return {
    summary: summary + (summary.endsWith('.') ? '' : '.'),
    keyPoints,
    wordCountOriginal: words.length,
    wordCountSummary: summaryWords.length,
    compressionRatio: Math.round((summaryWords.length / words.length) * 100),
  };
}

export function detectPassiveVoice(text: string): { sentence: string; position: number }[] {
  const sentences = getSentences(text);
  const passivePatterns = [
    /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi,
    /\b(is|are|was|were|be|been|being)\s+\w+en\b/gi,
  ];
  
  const results: { sentence: string; position: number }[] = [];
  
  sentences.forEach((sentence, index) => {
    for (const pattern of passivePatterns) {
      if (pattern.test(sentence)) {
        results.push({ sentence: sentence.trim(), position: index });
        break;
      }
    }
  });
  
  return results;
}
