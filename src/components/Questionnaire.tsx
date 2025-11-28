import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { questionnaireData } from '../data/questions';
import { AnalysisReport } from './AnalysisReport';
import { Round2Questionnaire } from './Round2Questionnaire';

interface QuestionnaireProps {
  onClose: () => void;
  coachLink?: string;
  email?: string;
  franchiseOwnerId?: string | null;
}

export function Questionnaire({ onClose, coachLink, email, franchiseOwnerId }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: email || '' });
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [showRound2, setShowRound2] = useState(false);

  const totalQuestions = 344;
  const questions = questionnaireData;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.name && customerInfo.email) {
      const { data: existingResponse, error: checkError } = await supabase
        .from('responses')
        .select('*')
        .eq('customer_email', customerInfo.email)
        .eq('status', 'in_progress')
        .is('parent_response_id', null)
        .order('last_activity_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing response:', checkError);
      }

      if (existingResponse) {
        const shouldResume = window.confirm(
          `We found an in-progress assessment for this email. You were at question ${existingResponse.current_question + 1} of ${totalQuestions}.\n\nWould you like to resume where you left off?`
        );

        if (shouldResume) {
          setResponseId(existingResponse.id);
          setCurrentQuestion(existingResponse.current_question || 0);
          setAnswers(existingResponse.answers || {});
          setCustomerInfo({ name: existingResponse.customer_name, email: existingResponse.customer_email });
          setShowCustomerForm(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from('responses')
        .insert({
          questionnaire_id: '228eda41-e4d7-4a13-9e31-829e2dff35c1',
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          status: 'in_progress',
          entry_type: coachLink ? 'coach_link' : 'random_visitor',
          email_verified: !!coachLink,
          franchise_owner_id: franchiseOwnerId || null,
          current_question: 0,
          last_activity_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating response:', error);
        alert('Error starting assessment: ' + error.message);
        return;
      }

      if (data) {
        setResponseId(data.id);
        setShowCustomerForm(false);
      }
    }
  };

  const handleAnswer = async (answer: string) => {
    const updatedAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(updatedAnswers);

    if (responseId) {
      await supabase
        .from('responses')
        .update({
          answers: updatedAnswers,
          current_question: currentQuestion,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', responseId);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < totalQuestions - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);

      if (responseId) {
        await supabase
          .from('responses')
          .update({
            current_question: nextQuestion,
            last_activity_at: new Date().toISOString()
          })
          .eq('id', responseId);
      }
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (responseId) {
      await supabase
        .from('responses')
        .update({
          answers,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', responseId);

      setShowAnalysis(true);
    }

    setIsSubmitting(false);
  };

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData?.id];

  if (showCustomerForm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-gray-400 z-10"
            title="Exit questionnaire and return to main page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-3xl font-bold text-[#0A2A5E] mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Welcome to the BrainWorx NIP™ Assessment. This questionnaire contains 344 questions designed to evaluate your neural pathways and cognitive patterns across 16 key areas.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-2">Important Disclaimer</p>
                <p className="leading-relaxed">This assessment is a self-reflection and coaching tool, not a medical or psychological diagnosis. Results should not be used to start, change, or stop any medication or treatment.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DB3E3] focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DB3E3] focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#3DB3E3] focus:ring-[#3DB3E3] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I have read, understood and agree to the disclaimer. I understand this is not a medical diagnosis and I will seek professional help where necessary.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#3DB3E3] focus:ring-[#3DB3E3] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  If the person taking this assessment is under 18 years of age, I confirm that I have parental/guardian consent.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!disclaimerAccepted || !parentalConsent}
              className="w-full bg-[#0A2A5E] text-white py-3 rounded-lg hover:bg-[#3DB3E3] transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Begin Assessment
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showRound2) {
    return (
      <Round2Questionnaire
        onClose={onClose}
        round1ResponseId={responseId!}
        customerEmail={customerInfo.email}
        customerName={customerInfo.name}
      />
    );
  }

  if (showAnalysis) {
    return (
      <AnalysisReport
        responseId={responseId!}
        customerEmail={customerInfo.email}
        onClose={onClose}
        onStartRound2={() => setShowRound2(true)}
        isRound2={false}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-gray-400 z-10"
          title="Exit questionnaire and return to main page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#0A2A5E]">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#3DB3E3] to-[#1FAFA3] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-[#E6E9EF] text-[#0A2A5E] px-4 py-1 rounded-full text-sm font-medium mb-4">
            {currentQuestionData.category}
          </div>
          <h3 className="text-2xl font-bold text-[#0A2A5E] mb-6">
            {currentQuestionData.text}
          </h3>

          <div className="space-y-3">
            {currentQuestionData.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                  currentAnswer === option
                    ? 'border-[#3DB3E3] bg-[#3DB3E3]/10'
                    : 'border-gray-200 hover:border-[#3DB3E3]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {currentAnswer === option && (
                    <CheckCircle className="text-[#3DB3E3]" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-[#0A2A5E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-[#0A2A5E] text-white rounded-lg hover:bg-[#3DB3E3] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={20} />
                Processing...
              </>
            ) : currentQuestion === totalQuestions - 1 ? (
              <>
                Submit
                <CheckCircle size={20} />
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            <strong>Important:</strong> By continuing with this assessment, you confirm that you understand it is a self-reflection and coaching tool, not a medical or psychological diagnosis, and that you will seek professional help where necessary.
          </p>
        </div>
      </div>
    </div>
  );
}
