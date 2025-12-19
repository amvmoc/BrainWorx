import React, { useState } from 'react';
import { useAssessment } from './AssessmentContext';
import ClientReport from './ClientReport';
import CoachReport from './CoachReport';
import './ResultsScreen.css';

interface ResultsScreenProps {
  onRestart: () => void;
}

type ReportType = 'client' | 'coach' | 'summary';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const { results } = useAssessment();
  const [reportType, setReportType] = useState<ReportType>('coach');

  if (!results) {
    return <div>Loading results...</div>;
  }

  const completionDate = results.completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Transform results for new report components
  const transformedResults = results.nipResults.map(nip => ({
    nipGroup: nip.code,
    score: nip.actualScore,
    maxScore: nip.maxScore,
    percentage: Math.round(nip.percentage),
    count: nip.totalQuestions
  }));

  if (reportType === 'client') {
    return <ClientReport results={transformedResults} completionDate={completionDate} />;
  }

  if (reportType === 'coach') {
    return <CoachReport results={transformedResults} completionDate={completionDate} />;
  }

  // Summary/Selection Screen
  return (
    <div className="results-screen">
      <div className="results-container">
        <div className="results-header">
          <h2>🎉 Assessment Complete!</h2>
          <p className="completed-date">
            Completed on {completionDate}
          </p>
        </div>

        <div className="report-selection">
          <h3>Choose Your Report Type</h3>
          <p className="selection-intro">
            Your assessment is complete! Select which type of report you'd like to view:
          </p>

          <div className="report-cards">
            <div className="report-card client-card">
              <div className="card-icon">📊</div>
              <h4>Client Report</h4>
              <p>
                Personal assessment report with visual charts, complete score table, 
                and actionable next steps. Perfect for personal review.
              </p>
              <ul className="card-features">
                <li>✓ Stacked bar chart visualization</li>
                <li>✓ Complete 20-pattern score table</li>
                <li>✓ Top 3 priority patterns</li>
                <li>✓ Clear next steps guidance</li>
              </ul>
              <button 
                className="view-button client-button"
                onClick={() => setReportType('client')}
              >
                View Client Report →
              </button>
            </div>

            <div className="report-card coach-card">
              <div className="card-icon">🎓</div>
              <h4>Coach Report</h4>
              <p>
                Comprehensive clinical analysis with detailed descriptions, manifestations, 
                root causes, and evidence-based interventions for all 20 patterns.
              </p>
              <ul className="card-features">
                <li>✓ Same charts/tables as client report</li>
                <li>✓ Full clinical descriptions</li>
                <li>✓ Root causes & manifestations</li>
                <li>✓ 5 interventions per pattern</li>
                <li>✓ Personalized coaching notes</li>
              </ul>
              <button 
                className="view-button coach-button"
                onClick={() => setReportType('coach')}
              >
                View Coach Report →
              </button>
            </div>
          </div>

          <div className="quick-summary">
            <h4>Quick Summary</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-value">{results.nipResults.length}</span>
                <span className="stat-label">Patterns Assessed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">{results.answers.length}</span>
                <span className="stat-label">Questions Completed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">{Math.round(results.overallPercentage)}%</span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>

            <div className="top-patterns">
              <h5>Your Top 3 Patterns:</h5>
              <ol>
                {results.nipResults.slice(0, 3).map(nip => (
                  <li key={nip.code}>
                    <strong>{nip.name}</strong> - {Math.round(nip.percentage)}%
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="action-section">
            <button 
              className="restart-button"
              onClick={onRestart}
            >
              🔄 Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
