import { Answer, Question, NIPResult, NIPCode, NIP_DEFINITIONS } from './types';

/**
 * Calculate NIP results from answers
 */
export const calculateNIPResults = (answers: Answer[], questions: Question[]): NIPResult[] => {
  // Group questions by NIP
  const nipQuestions = new Map<NIPCode, Question[]>();
  questions.forEach(q => {
    if (!nipQuestions.has(q.nipCode)) {
      nipQuestions.set(q.nipCode, []);
    }
    nipQuestions.get(q.nipCode)!.push(q);
  });

  // Create answer map for quick lookup
  const answerMap = new Map<number, Answer>();
  answers.forEach(a => answerMap.set(a.questionId, a));

  // Calculate scores for each NIP
  const results: NIPResult[] = [];

  nipQuestions.forEach((nipQs, nipCode) => {
    let actualScore = 0;
    const totalQuestions = nipQs.length;
    const maxScore = totalQuestions * 3;

    nipQs.forEach(q => {
      const answer = answerMap.get(q.id);
      if (answer) {
        let score = answer.value;
        
        // Apply reverse scoring if needed
        if (q.reverseScored) {
          score = 3 - score; // 0->3, 1->2, 2->1, 3->0
        }
        
        actualScore += score;
      }
    });

    const percentage = (actualScore / maxScore) * 100;
    const level = getLevel(percentage);
    const recommendation = getRecommendation(level);

    const nipDef = NIP_DEFINITIONS[nipCode];

    results.push({
      code: nipCode,
      name: nipDef.name,
      description: nipDef.description,
      totalQuestions,
      actualScore,
      maxScore,
      percentage,
      level,
      recommendation,
    });
  });

  // Sort by percentage (highest first)
  return results.sort((a, b) => b.percentage - a.percentage);
};

/**
 * Determine level based on percentage
 */
const getLevel = (percentage: number): NIPResult['level'] => {
  if (percentage >= 70) return 'Strongly Present';
  if (percentage >= 50) return 'Moderately Present';
  if (percentage >= 30) return 'Mild Pattern';
  return 'Minimal Pattern';
};

/**
 * Get recommendation based on level
 */
const getRecommendation = (level: NIPResult['level']): string => {
  switch (level) {
    case 'Strongly Present':
      return 'Priority intervention needed - This pattern significantly impacts your life';
    case 'Moderately Present':
      return 'Active attention required - Work with professional support on this area';
    case 'Mild Pattern':
      return 'Monitoring recommended - Be aware of this pattern and address when it arises';
    case 'Minimal Pattern':
      return 'Low concern - This pattern has minimal impact on your life';
  }
};

/**
 * Get color for level visualization
 */
export const getLevelColor = (level: NIPResult['level']): string => {
  switch (level) {
    case 'Strongly Present':
      return '#dc2626'; // red-600
    case 'Moderately Present':
      return '#ea580c'; // orange-600
    case 'Mild Pattern':
      return '#ca8a04'; // yellow-600
    case 'Minimal Pattern':
      return '#16a34a'; // green-600
  }
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Get top N priority NIPs
 */
export const getTopPriorities = (results: NIPResult[], n: number = 3): NIPResult[] => {
  return results
    .filter(r => r.percentage >= 40) // Only include patterns above 40%
    .slice(0, n);
};

/**
 * Calculate overall assessment metrics
 */
export const calculateOverallMetrics = (results: NIPResult[]) => {
  const avgPercentage = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
  
  const levelCounts = {
    'Strongly Present': results.filter(r => r.level === 'Strongly Present').length,
    'Moderately Present': results.filter(r => r.level === 'Moderately Present').length,
    'Mild Pattern': results.filter(r => r.level === 'Mild Pattern').length,
    'Minimal Pattern': results.filter(r => r.level === 'Minimal Pattern').length,
  };

  const highestScore = results[0]; // Already sorted by percentage
  const lowestScore = results[results.length - 1];

  return {
    avgPercentage,
    levelCounts,
    highestScore,
    lowestScore,
    totalPatterns: results.length,
  };
};

/**
 * Export results to JSON for download
 */
export const exportResultsToJSON = (results: NIPResult[], answers: Answer[]): string => {
  return JSON.stringify({
    completedAt: new Date().toISOString(),
    totalQuestions: answers.length,
    results: results.map(r => ({
      nip: r.code,
      name: r.name,
      percentage: r.percentage,
      level: r.level,
    })),
    detailedResults: results,
  }, null, 2);
};

/**
 * Generate CSV of results
 */
export const exportResultsToCSV = (results: NIPResult[]): string => {
  const headers = ['NIP Code', 'Name', 'Questions', 'Score', 'Max Score', 'Percentage', 'Level'];
  const rows = results.map(r => [
    r.code,
    r.name,
    r.totalQuestions.toString(),
    r.actualScore.toString(),
    r.maxScore.toString(),
    r.percentage.toFixed(1),
    r.level,
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
