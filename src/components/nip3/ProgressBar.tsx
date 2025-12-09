import React from 'react';
import { useAssessment } from './AssessmentContext';
import './ProgressBar.css';

export const ProgressBar: React.FC = () => {
  const { progress, answers, questions } = useAssessment();

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-text">
          Progress: {answers.size} / {questions.length} questions
        </span>
        <span className="progress-percentage">
          {progress.toFixed(0)}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
