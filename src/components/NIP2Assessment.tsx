import React, { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, ChevronLeft, ChevronRight, FileText, Brain, TrendingUp, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import questionsData from '../data/nip2/questions-data.json';

// Import NIP patterns from the original file
import { NIP_PATTERNS } from './nip2/nipPatterns';

interface QuestionnaireProps {
  questions: any[];
  onComplete: (answers: Record<number, number>, responseId: string) => void;
  responseId: string;
  initialAnswers?: Record<number, number>;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, onComplete, responseId, initialAnswers = {} }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((Object.keys(answers).length / questions.length) * 100);
  }, [answers, questions.length]);

  // Auto-save answers to database
  useEffect(() => {
    const saveProgress = async () => {
      if (Object.keys(answers).length > 0) {
        await supabase
          .from('nip2_responses')
          .update({
            answers,
            current_question: currentQuestion,
            last_activity_at: new Date().toISOString()
          })
          .eq('id', responseId);
      }
    };

    const debounce = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounce);
  }, [answers, currentQuestion, responseId]);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value });

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => onComplete(answers, responseId), 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const nipInfo = NIP_PATTERNS[question.nipGroup as keyof typeof NIP_PATTERNS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-purple-200">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl mb-6">
          <div className="mb-8">
            <div className="inline-block bg-purple-500/30 text-purple-200 px-4 py-2 rounded-full text-sm mb-4">
              {nipInfo?.name || question.nipGroup}
            </div>
            <h2 className="text-3xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 transform hover:scale-102 ${
                  answers[currentQuestion] === index
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-102'
                    : 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                    answers[currentQuestion] === index ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentQuestion === 0
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {answers[currentQuestion] !== undefined && currentQuestion === questions.length - 1 && (
            <button
              onClick={() => onComplete(answers, responseId)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all"
            >
              Complete Assessment
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NIP2Assessment: React.FC = () => {
  const [stage, setStage] = useState<'welcome' | 'info' | 'questionnaire' | 'clientReport' | 'coachReport'>('welcome');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [responseId, setResponseId] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleStart = () => {
    setStage('info');
  };

  const handleBeginAssessment = async () => {
    if (!customerName || !customerEmail) {
      alert('Please enter your name and email');
      return;
    }

    setLoading(true);

    try {
      // Create response record
      const { data, error } = await supabase
        .from('nip2_responses')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          status: 'in_progress',
          entry_type: 'random_visitor'
        })
        .select()
        .single();

      if (error) throw error;

      setResponseId(data.id);
      setStage('questionnaire');
    } catch (error) {
      console.error('Error creating response:', error);
      alert('Failed to start assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = (answers: Record<number, number>) => {
    const nipScores: Record<string, any> = {};

    // Initialize scores
    Object.keys(NIP_PATTERNS).forEach(nip => {
      nipScores[nip] = { score: 0, maxScore: 0, count: 0 };
    });

    // Calculate scores
    questionsData.forEach((question: any, index: number) => {
      const answer = answers[index];
      if (answer !== undefined) {
        const nipGroup = question.nipGroup;
        nipScores[nipGroup].score += answer;
        nipScores[nipGroup].maxScore += 3;
        nipScores[nipGroup].count += 1;
      }
    });

    // Convert to array and calculate percentages
    const nipScoresArray = Object.entries(nipScores).map(([nipGroup, data]: [string, any]) => ({
      nipGroup,
      score: data.score,
      maxScore: data.maxScore,
      count: data.count,
      percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0
    }));

    // Get top patterns
    const topPatterns = [...nipScoresArray]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    // Get critical patterns
    const criticalPatterns = nipScoresArray.filter(nip => {
      const pattern = NIP_PATTERNS[nip.nipGroup as keyof typeof NIP_PATTERNS];
      return pattern?.impact === 'Critical' && nip.percentage >= 50;
    });

    return {
      nipScores: nipScoresArray,
      topPatterns,
      criticalPatterns,
      totalQuestions: questionsData.length,
      completionDate: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
  };

  const handleComplete = async (answers: Record<number, number>, respId: string) => {
    setLoading(true);

    try {
      const calculatedResults = calculateResults(answers);

      // Update response status
      await supabase
        .from('nip2_responses')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          answers
        })
        .eq('id', respId);

      // Save results
      await supabase
        .from('nip2_results')
        .insert({
          response_id: respId,
          nip_scores: calculatedResults.nipScores,
          total_questions: calculatedResults.totalQuestions,
          completion_date: calculatedResults.completionDate,
          top_patterns: calculatedResults.topPatterns,
          critical_patterns: calculatedResults.criticalPatterns
        });

      setResults(calculatedResults);
      setStage('clientReport');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailResults = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-nip2-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          responseId,
          customerEmail,
          customerName,
          results
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Mark email as sent
      await supabase
        .from('nip2_responses')
        .update({ email_sent: true })
        .eq('id', responseId);

      setEmailSent(true);
      alert('Results have been emailed successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. You can still view and download your results.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Processing...
        </div>
      </div>
    );
  }

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <Brain className="w-20 h-20 text-purple-300" strokeWidth={1.5} />
            </div>

            <h1 className="text-5xl font-bold text-white text-center mb-4 tracking-tight">
              Neural Imprint Patterns 2.0
            </h1>
            <p className="text-xl text-purple-200 text-center mb-8">
              Comprehensive Self-Assessment Questionnaire
            </p>

            <div className="bg-white/5 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">About This Assessment</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Neural Imprint Patterns are deeply embedded psychological, behavioral, and cognitive
                configurations that form lasting imprints on brain structure and function through repeated
                experiences, trauma, environmental influences, or developmental conditioning.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This comprehensive 343-question assessment will help identify your unique neural imprint
                patterns across 20 different categories. The assessment takes approximately 30-45 minutes
                to complete.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">343</div>
                <div className="text-gray-300">Questions</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">20</div>
                <div className="text-gray-300">NIP Categories</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">30-45</div>
                <div className="text-gray-300">Minutes</div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Begin Assessment
            </button>

            <p className="text-center text-gray-400 mt-6 text-sm">
              Powered by BrainWorx™ Assessment Platform
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Your Information</h2>
            <p className="text-gray-300 mb-8">
              Please provide your information to receive your assessment results.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              onClick={handleBeginAssessment}
              disabled={!customerName || !customerEmail}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'questionnaire') {
    return (
      <Questionnaire
        questions={questionsData}
        onComplete={handleComplete}
        responseId={responseId}
      />
    );
  }

  if (stage === 'clientReport' && results) {
    const topPatterns = results.topPatterns.slice(0, 5);
    const radarData = results.nipScores.map((nip: any) => ({
      pattern: NIP_PATTERNS[nip.nipGroup as keyof typeof NIP_PATTERNS]?.code || nip.nipGroup,
      score: nip.percentage,
      fullMark: 100
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4">Neural Imprint Patterns 2.0</h1>
                <p className="text-2xl text-blue-100">Personal Assessment Report</p>
                <p className="text-xl mt-2">{customerName}</p>
              </div>
              <Brain className="w-24 h-24 opacity-50" strokeWidth={1} />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{results.totalQuestions}</div>
                <div className="text-blue-100">Questions</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{results.completionDate}</div>
                <div className="text-blue-100">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{topPatterns.length}</div>
                <div className="text-blue-100">Top Patterns</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-12">
            {/* Top Patterns */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Your Top Neural Imprint Patterns
            </h2>

            <div className="space-y-4 mb-12">
              {topPatterns.map((pattern: any, index: number) => {
                const nipInfo = NIP_PATTERNS[pattern.nipGroup as keyof typeof NIP_PATTERNS];
                return (
                  <div
                    key={pattern.nipGroup}
                    className="bg-gradient-to-r from-gray-50 to-white border-l-4 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: nipInfo?.color || '#666' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-gray-700">#{index + 1}</span>
                          <h3 className="text-xl font-bold text-gray-800">
                            {nipInfo?.code} - {nipInfo?.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-3">{nipInfo?.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                            {nipInfo?.category}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            nipInfo?.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                            nipInfo?.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {nipInfo?.impact} Impact
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                          {pattern.percentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {pattern.score} / {pattern.maxScore}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar Chart */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete Pattern Profile</h3>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ccc" />
                  <PolarAngleAxis dataKey="pattern" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Your Scores"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Email Results */}
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Mail className="w-7 h-7 text-blue-600" />
                Email Your Results
              </h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Would you like to receive a copy of your results via email? We'll send you a detailed report with all your patterns and recommendations.
              </p>
              <button
                onClick={handleEmailResults}
                disabled={emailSent}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Mail className="w-6 h-6" />
                {emailSent ? 'Email Sent!' : 'Send Results to Email'}
              </button>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <AlertCircle className="w-7 h-7 text-blue-600" />
                Next Steps
              </h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                This report provides a high-level overview of your Neural Imprint Patterns. Your results have been saved and you can access them anytime using your email address.
              </p>
              <p className="text-gray-600 text-sm">
                Assessment ID: {responseId}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-6 text-center text-gray-600">
            <p className="text-sm">Neural Imprint Patterns 2.0 • Powered by BrainWorx™</p>
            <p className="text-xs mt-2">This report is confidential and intended for personal development purposes only.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default NIP2Assessment;
