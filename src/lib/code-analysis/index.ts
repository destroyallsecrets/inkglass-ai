export interface ComplexityResult {
  cyclomaticComplexity: number
  linesOfCode: number
  linesOfComments: number
  commentRatio: number
  functionCount: number
  classCount: number
  importCount: number
  maintainabilityIndex: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

export interface SecurityIssue {
  line: number
  severity: 'high' | 'medium' | 'low'
  message: string
  type: string
}

export interface BestPractice {
  line: number
  message: string
  type: string
}

export interface CodeAnalysisResult {
  complexity: ComplexityResult
  security: SecurityIssue[]
  bestPractices: BestPractice[]
  suggestions: string[]
}

const COMPLEXITY_PATTERNS = [
  { pattern: /\bif\s*\(/g, weight: 1, name: 'if' },
  { pattern: /\bfor\s*\(/g, weight: 1, name: 'for' },
  { pattern: /\bwhile\s*\(/g, weight: 1, name: 'while' },
  { pattern: /\bcase\s+/g, weight: 1, name: 'case' },
  { pattern: /\bcatch\s*\(/g, weight: 1, name: 'catch' },
  { pattern: /\b&&\b/g, weight: 1, name: 'logical AND' },
  { pattern: /\b\|\|\b/g, weight: 1, name: 'logical OR' },
  { pattern: /\?\s*[^:]+:/g, weight: 1, name: 'ternary' },
];

const SECURITY_PATTERNS = [
  { 
    pattern: /eval\s*\(/g, 
    severity: 'high' as const, 
    message: 'Avoid eval() - code injection risk', 
    type: 'code-injection' 
  },
  { 
    pattern: /innerHTML\s*=/g, 
    severity: 'medium' as const, 
    message: 'Potential XSS - consider using textContent or sanitized HTML', 
    type: 'xss' 
  },
  { 
    pattern: /document\.write\s*\(/g, 
    severity: 'high' as const, 
    message: 'document.write() is a security risk and bad practice', 
    type: 'xss' 
  },
  { 
    pattern: /password\s*[=:]\s*['"][^'"]+['"]/gi, 
    severity: 'high' as const, 
    message: 'Hardcoded password detected - use environment variables', 
    type: 'hardcoded-secret' 
  },
  { 
    pattern: /(api[_-]?key|apikey|api_secret)\s*[=:]\s*['"][^'"]+['"]/gi, 
    severity: 'high' as const, 
    message: 'Hardcoded API key detected - use environment variables', 
    type: 'hardcoded-secret' 
  },
  { 
    pattern: /secret\s*[=:]\s*['"][^'"]+['"]/gi, 
    severity: 'high' as const, 
    message: 'Hardcoded secret detected - use environment variables', 
    type: 'hardcoded-secret' 
  },
  { 
    pattern: /token\s*[=:]\s*['"][^'"]+['"]/gi, 
    severity: 'medium' as const, 
    message: 'Hardcoded token detected - consider using secure storage', 
    type: 'hardcoded-secret' 
  },
  { 
    pattern: /localhost|127\.0\.0\.1|0\.0\.0\.0/g, 
    severity: 'low' as const, 
    message: 'Development URL detected - ensure this is intentional for production', 
    type: 'dev-url' 
  },
  { 
    pattern: /console\.(log|warn|error|debug)\s*\(\s*(?!['"`]\s*(?:error|warn|info|debug|timestamp)['"`]).*\$\{/g, 
    severity: 'low' as const, 
    message: 'Console statement with template literal - remove before production', 
    type: 'console-statement' 
  },
  { 
    pattern: /debugger\s*;/g, 
    severity: 'medium' as const, 
    message: 'Debugger statement found - remove before production', 
    type: 'debugger' 
  },
  { 
    pattern: /new\s+Function\s*\(/g, 
    severity: 'high' as const, 
    message: 'new Function() is similar to eval() - code injection risk', 
    type: 'code-injection' 
  },
  { 
    pattern: /setTimeout\s*\([^,]+,\s*0\s*\)/g, 
    severity: 'low' as const, 
    message: 'setTimeout with 0 delay detected - consider using queueMicrotask', 
    type: 'timing' 
  },
  { 
    pattern: /\.\s*then\s*\([^)]*=>\s*{\s*\.then/g, 
    severity: 'medium' as const, 
    message: 'Promise nesting detected - consider using async/await', 
    type: 'promise-hell' 
  },
  { 
    pattern: /for\s*\(\s*let\s+\w+\s+in\s+/g, 
    severity: 'low' as const, 
    message: 'for...in on array iterates indices, not values - use for...of', 
    type: 'loop-pattern' 
  },
];

const BEST_PRACTICE_PATTERNS = [
  { 
    pattern: /\bany\b/g, 
    message: 'Avoid using "any" type - use specific types', 
    type: 'typescript' 
  },
  { 
    pattern: /==\s*(?!null|undefined)/g, 
    message: 'Use === instead of == for strict equality', 
    type: 'equality' 
  },
  { 
    pattern: /!=\s*(?!null|undefined)/g, 
    message: 'Use !== instead of != for strict inequality', 
    type: 'equality' 
  },
  { 
    pattern: /var\s+/g, 
    message: 'Use "let" or "const" instead of "var"', 
    type: 'variable-declaration' 
  },
  { 
    pattern: /for\s*\(\s*var\s+/g, 
    message: 'Use "let" in for-loop declarations', 
    type: 'variable-declaration' 
  },
  { 
    pattern: /new\s+Array\s*\(/g, 
    message: 'Use array literal [] instead of new Array()', 
    type: 'array-creation' 
  },
  { 
    pattern: /\.length\s*===\s*0|\.length\s*==\s*0/g, 
    message: 'Use Array.isArray() check before length comparison', 
    type: 'array-check' 
  },
  { 
    pattern: /catch\s*\(\s*\w+\s*\)\s*{\s*}/g, 
    message: 'Empty catch block - add error handling', 
    type: 'empty-catch' 
  },
  { 
    pattern: /\/\/\s*TODO|\/\/\s*FIXME|\/\/\s*HACK/g, 
    message: 'Code comment marker found - ensure this is tracked', 
    type: 'code-comment' 
  },
  { 
    pattern: /async\s+function\s+\w+\s*\([^)]*\)\s*{\s*}/g, 
    message: 'Async function has empty body', 
    type: 'empty-function' 
  },
];

function getLineNumber(code: string, matchIndex: number): number {
  const lines = code.substring(0, matchIndex).split('\n');
  return lines.length;
}

function calculateMaintainabilityIndex(
  cyclomaticComplexity: number,
  linesOfCode: number,
  commentRatio: number
): number {
  const halsteadVolume = linesOfCode * Math.log2(linesOfCode + 1);
  const mi = 171 - 5.2 * Math.log(halsteadVolume + 1) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(linesOfCode + 1) + 50 * Math.sin(Math.PI / 180 * commentRatio * 100);
  return Math.max(0, Math.min(100, mi));
}

function getGrade(maintainabilityIndex: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (maintainabilityIndex >= 80) return 'A';
  if (maintainabilityIndex >= 60) return 'B';
  if (maintainabilityIndex >= 40) return 'C';
  if (maintainabilityIndex >= 20) return 'D';
  return 'F';
}

export function analyzeComplexity(code: string): ComplexityResult {
  let cyclomaticComplexity = 1;
  let linesOfCode = 0;
  let linesOfComments = 0;
  let inMultilineComment = false;
  
  const lines = code.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('/*')) inMultilineComment = true;
    if (inMultilineComment) {
      linesOfComments++;
      if (trimmed.includes('*/')) {
        inMultilineComment = false;
        if (!trimmed.endsWith('*/')) linesOfComments--;
      }
      continue;
    }
    
    if (trimmed.startsWith('//')) {
      linesOfComments++;
      continue;
    }
    
    if (trimmed.length > 0) {
      linesOfCode++;
    }
  }
  
  for (const { pattern, weight } of COMPLEXITY_PATTERNS) {
    const matches = code.match(pattern);
    if (matches) {
      cyclomaticComplexity += matches.length * weight;
    }
  }
  
  const commentRatio = linesOfCode > 0 ? (linesOfComments / (linesOfCode + linesOfComments)) * 100 : 0;
  
  const functionMatches = code.match(/\b(?:function|const|let|var)\s+\w+\s*[=:]\s*(?:async\s*)?\(|async\s+function|\([^)]*\)\s*=>/g);
  const functionCount = functionMatches?.length || 0;
  
  const classMatches = code.match(/\bclass\s+\w+/g);
  const classCount = classMatches?.length || 0;
  
  const importMatches = code.match(/import\s+/g);
  const importCount = importMatches?.length || 0;
  
  const maintainabilityIndex = calculateMaintainabilityIndex(cyclomaticComplexity, linesOfCode, commentRatio);
  
  return {
    cyclomaticComplexity,
    linesOfCode,
    linesOfComments,
    commentRatio,
    functionCount,
    classCount,
    importCount,
    maintainabilityIndex: Math.round(maintainabilityIndex * 10) / 10,
    grade: getGrade(maintainabilityIndex),
  };
}

export function analyzeSecurity(code: string): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  for (const { pattern, severity, message, type } of SECURITY_PATTERNS) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      issues.push({
        line: getLineNumber(code, match.index),
        severity,
        message,
        type,
      });
    }
    pattern.lastIndex = 0;
  }
  
  return issues.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function analyzeBestPractices(code: string): BestPractice[] {
  const practices: BestPractice[] = [];
  
  for (const { pattern, message, type } of BEST_PRACTICE_PATTERNS) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      practices.push({
        line: getLineNumber(code, match.index),
        message,
        type,
      });
    }
    pattern.lastIndex = 0;
  }
  
  return practices;
}

export function generateSuggestions(complexity: ComplexityResult, security: SecurityIssue[]): string[] {
  const suggestions: string[] = [];
  
  if (complexity.cyclomaticComplexity > 10) {
    suggestions.push(`Cyclomatic complexity is ${complexity.cyclomaticComplexity} - consider breaking into smaller functions`);
  }
  
  if (complexity.maintainabilityIndex < 50) {
    suggestions.push('Low maintainability index - improve by adding comments and reducing complexity');
  }
  
  if (complexity.commentRatio < 10) {
    suggestions.push('Low comment ratio - add more comments to improve code documentation');
  }
  
  if (complexity.functionCount > 10) {
    suggestions.push('High function count - consider grouping related functions into classes or modules');
  }
  
  if (complexity.classCount === 0 && complexity.functionCount > 5) {
    suggestions.push('Consider organizing functions into classes for better encapsulation');
  }
  
  if (complexity.importCount > 20) {
    suggestions.push('Many imports detected - consider using barrel exports or consolidating modules');
  }
  
  if (security.some(s => s.type === 'xss')) {
    suggestions.push('Address XSS vulnerabilities by using textContent instead of innerHTML');
  }
  
  if (security.some(s => s.type === 'hardcoded-secret')) {
    suggestions.push('Remove hardcoded secrets and use environment variables instead');
  }
  
  if (security.some(s => s.severity === 'high')) {
    suggestions.push('High severity security issues found - prioritize fixing these');
  }
  
  return suggestions;
}

export function analyzeCode(code: string): CodeAnalysisResult {
  const complexity = analyzeComplexity(code);
  const security = analyzeSecurity(code);
  const bestPractices = analyzeBestPractices(code);
  const suggestions = generateSuggestions(complexity, security);
  
  return {
    complexity,
    security,
    bestPractices,
    suggestions,
  };
}

export function formatComplexityReport(result: ComplexityResult): string {
  const lines = [
    '## Complexity Report',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Cyclomatic Complexity | ${result.cyclomaticComplexity} |`,
    `| Lines of Code | ${result.linesOfCode} |`,
    `| Lines of Comments | ${result.linesOfComments} |`,
    `| Comment Ratio | ${result.commentRatio.toFixed(1)}% |`,
    `| Functions | ${result.functionCount} |`,
    `| Classes | ${result.classCount} |`,
    `| Imports | ${result.importCount} |`,
    `| Maintainability Index | ${result.maintainabilityIndex} |`,
    `| Grade | ${result.grade} |`,
  ];
  
  return lines.join('\n');
}
