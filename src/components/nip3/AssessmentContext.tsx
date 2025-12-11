import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Question, Answer, AnswerValue, NIPResult, AssessmentResults } from './types';
import { calculateNIPResults } from './scoring';
import questionsData from '../../data/nip3/questions.json';

interface AssessmentContextType {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Map<number, Answer>;
  isComplete: boolean;
  results: AssessmentResults | null;
  answerQuestion: (questionId: number, value: AnswerValue, option: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
  progress: number;
  email?: string;
  customerName?: string;
  franchiseOwnerId?: string | null;
  couponId?: string | null;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
  initialEmail?: string;
  initialCustomerName?: string;
  initialFranchiseOwnerId?: string | null;
  initialCouponId?: string | null;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
  initialEmail,
  initialCustomerName,
  initialFranchiseOwnerId,
  initialCouponId
}) => {
  const [questions] = useState<Question[]>(questionsData.questions as Question[]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map());
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [email] = useState(initialEmail);
  const [customerName] = useState(initialCustomerName);
  const [franchiseOwnerId] = useState(initialFranchiseOwnerId);
  const [couponId] = useState(initialCouponId);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('assessment-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentQuestionIndex(data.currentIndex || 0);
        setAnswers(new Map(data.answers || []));
      } catch (e) {
        console.error('Failed to load saved progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (answers.size > 0 && !isComplete) {
      const data = {
        currentIndex: currentQuestionIndex,
        answers: Array.from(answers.entries()),
      };
      localStorage.setItem('assessment-progress', JSON.stringify(data));
    }
  }, [answers, currentQuestionIndex, isComplete]);

  const answerQuestion = (questionId: number, value: AnswerValue, option: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, {
      questionId,
      value,
      option: option as any,
    });
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const completeAssessment = () => {
    if (answers.size === questions.length) {
      const answersArray = Array.from(answers.values());
      const nipResults = calculateNIPResults(answersArray, questions);
      
      const assessmentResults: AssessmentResults = {
        answers: answersArray,
        nipResults,
        completedAt: new Date(),
        overallPercentage: nipResults.reduce((sum, nip) => sum + nip.percentage, 0) / nipResults.length,
      };

      setResults(assessmentResults);
      setIsComplete(true);
      
      // Save results to localStorage
      localStorage.setItem('assessment-results', JSON.stringify({
        ...assessmentResults,
        completedAt: assessmentResults.completedAt.toISOString(),
      }));
      
      // Clear progress
      localStorage.removeItem('assessment-progress');
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    setIsComplete(false);
    setResults(null);
    localStorage.removeItem('assessment-progress');
    localStorage.removeItem('assessment-results');
  };

  const progress = (answers.size / questions.length) * 100;

  return (
    <AssessmentContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        answers,
        isComplete,
        results,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        completeAssessment,
        resetAssessment,
        progress,
        email,
        customerName,
        franchiseOwnerId,
        couponId,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
