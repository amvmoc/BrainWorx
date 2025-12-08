import React, { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, ChevronLeft, ChevronRight, FileText, Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

// NIP Pattern Definitions
const NIP_PATTERNS = {
  NIP01: {
    code: 'TRAP',
    name: 'Home/Work',
    color: '#FFB800',
    description: 'Spaces that ignore the need for conscious human growth, creating environments where individuals simply "exist" instead of evolving.',
    category: 'Environmental',
    impact: 'High',
    detailedDescription: 'These settings — family, social, or professional — are designed around empowerment or personal progress, leaving individuals without meaningful encouragement or direction.',
    interventions: [
      'Create intentional growth spaces and rituals',
      'Establish clear personal and professional boundaries',
      'Develop a vision for conscious evolution',
      'Identify and challenge limiting environmental patterns',
      'Build supportive communities focused on growth'
    ]
  },
  NIP02: {
    code: 'SHT',
    name: 'Shattered Worth',
    color: '#FF6B6B',
    description: 'An individual who has endured emotional damage causing hyper-sensitivity whether physical, verbal, or sexual — often at a distance with a weakened sense of personal worth and dignity.',
    category: 'Trauma',
    impact: 'Critical',
    detailedDescription: 'Substantial emotional harm from childhood, family, settings, intimate relationships, workplaces, or broader social circles.',
    interventions: [
      'Trauma-informed therapy (EMDR, Somatic Experiencing)',
      'Self-compassion practices and affirmation work',
      'Boundary setting and assertiveness training',
      'Nervous system regulation techniques',
      'Safe relationship building with therapeutic support'
    ]
  },
  NIP03: {
    code: 'ORG',
    name: 'Time & Order',
    color: '#DAA520',
    description: 'Refers to persistent difficulties with planning, organizing, and managing time. The individual may misjudge how long tasks will take, lose important items, forget appointments, or feel constantly "behind."',
    category: 'Executive Function',
    impact: 'High',
    detailedDescription: 'Despite good intentions, life may feel disordered and rushed, with a constant sense of being "behind."',
    interventions: [
      'Implement structured daily routines and systems',
      'Use time-blocking and calendar management tools',
      'Break large tasks into smaller, manageable steps',
      'External accountability partnerships',
      'Professional organizing or ADHD coaching support'
    ]
  },
  NIP04: {
    code: 'NEGP',
    name: 'Unmet Needs',
    color: '#90C695',
    description: 'Refers to parenting styles that fail to nurture healthy emotional and cognitive growth. These parents may rely on punishment rather than guidance, neglect emotional connection, or lack the understanding of how the brain and behavior develop.',
    category: 'Developmental',
    impact: 'High',
    detailedDescription: 'Resulting in a lack of critical support and stimulation across key developmental areas.',
    interventions: [
      'Reparenting work with therapist',
      'Inner child healing practices',
      'Learn and practice healthy emotional expression',
      'Build secure attachment relationships',
      'Education on emotional intelligence and self-regulation'
    ]
  },
  NIP05: {
    code: 'HYP',
    name: 'High Gear',
    color: '#B0B0E0',
    description: 'Refers to a body and mind that feel as if they are constantly "on." The individual may struggle to sit still, relax, unwind, or may appear calm on the outside while experiencing an intense inner restlessness.',
    category: 'Arousal',
    impact: 'High',
    detailedDescription: 'Rest, stillness, and quiet activities feel uncomfortable, as if the internal engine remains stuck in high gear.',
    interventions: [
      'Vagal nerve toning exercises',
      'Progressive muscle relaxation',
      'Mindfulness and meditation practices',
      'Regular physical exercise with rest periods',
      'Sleep hygiene optimization and nervous system calming'
    ]
  },
  NIP06: {
    code: 'DOG',
    name: 'Dogmatic Chains',
    color: '#87CEEB',
    description: 'A way of thinking rooted in belief systems that restrict how a person interprets or responds to everyday issues like relationships, lifestyle, or values.',
    category: 'Cognitive',
    impact: 'Medium',
    detailedDescription: 'This outlook is shaped by strict and rigid agreement to or religious conditioning that limits openness to new perspectives.',
    interventions: [
      'Cognitive flexibility exercises',
      'Exposure to diverse perspectives and worldviews',
      'Critical thinking skill development',
      'Values clarification work',
      'Gradual exploration of alternative viewpoints'
    ]
  },
  NIP07: {
    code: 'IMP',
    name: 'Impulse Rush',
    color: '#FFD700',
    description: 'Describes a pattern where a person tends to "jump all out" before they are fully thought through. The person may interrupt, blurt out comments, buy things impulsively, or make quick decisions they later regret.',
    category: 'Impulse Control',
    impact: 'Medium',
    detailedDescription: 'The inner experience is often a sense of urgency or "act now before the feeling disappears."',
    interventions: [
      'Pause-and-plan strategies before acting',
      'Impulse control delay techniques',
      'Mindfulness of urges without immediate action',
      'Financial and decision-making safeguards',
      'Cognitive behavioral therapy for impulse regulation'
    ]
  },
  NIP08: {
    code: 'NUH',
    name: 'Numb Heart',
    color: '#FFB6C1',
    description: 'Describes a pattern where a person has learned to withhold feeling as a way to survive. Emotions are kept at a distance, and empathy or boundaries hardly register.',
    category: 'Emotional',
    impact: 'Critical',
    detailedDescription: 'Over time the person seems cold, harsh, or uncaring, and time and space usually grasping the impact. This imprint often develops after prolonged exposure to cruelty, and reflects an over-protective "freeze" response rather than a lack of human value.',
    interventions: [
      'Gradual emotional reconnection therapy',
      'Somatic experiencing to access buried feelings',
      'Safe relational experiences to practice vulnerability',
      'Art or music therapy for emotional expression',
      'Trauma processing with specialized therapist'
    ]
  },
  NIP09: {
    code: 'DIS',
    name: 'Mind In Distress',
    color: '#4A90E2',
    description: 'Points to the presence of a mental health conditions that strongly affect daily functioning. This may include depression, bipolar shifts, severe anxiety or panic, schizophrenia, certain personality patterns, trauma-related states, or other clinical concerns.',
    category: 'Mental Health',
    impact: 'Critical',
    detailedDescription: 'These patterns signal that emotional, cognitive, and behavioral systems in the person\'s brain and nervous system are carrying more than everyday stress.',
    interventions: [
      'Comprehensive psychiatric evaluation',
      'Medication management if appropriate',
      'Intensive therapy (CBT, DBT, or specialized modalities)',
      'Crisis planning and support network',
      'Regular monitoring and professional care coordination'
    ]
  },
  NIP10: {
    code: 'ANG',
    name: 'Anchored Anger',
    color: '#DC143C',
    description: 'A persistent form of anger stemming from past experiences, marked by an inability to let go of resentment or grudges. It exists in two states: -Expressed: openly felt and demonstrated, or -Latent: held dormant but capable of re-emerging when triggered.',
    category: 'Emotional',
    impact: 'High',
    detailedDescription: 'This pattern reflects unresolved emotional wounds that maintain active charge.',
    interventions: [
      'Anger management therapy and skill-building',
      'Forgiveness work and resentment release',
      'Trauma resolution for root causes',
      'Healthy anger expression techniques',
      'Emotional regulation and distress tolerance skills'
    ]
  },
  NIP11: {
    code: 'INFL',
    name: 'Inside Out',
    color: '#2C3E50',
    description: 'Refers to a person who complains that "life is something inflicted on their life: Do I not experience life as something I inflict on choices, patterns, and responses make their feelings."',
    category: 'Locus of Control',
    impact: 'High',
    detailedDescription: 'Make their life happen I interpret life mainly outside. I move from victim to "agent, grow." This imprint explains being trapped or powerless has become through upbringing, trauma, and social conditioning.',
    interventions: [
      'Develop internal locus of control awareness',
      'Personal responsibility and agency building',
      'Cognitive reframing of victimhood narratives',
      'Empowerment through small, achievable goals',
      'Life coaching focused on choice and accountability'
    ]
  },
  NIP12: {
    code: 'BULLY',
    name: 'Victim Loops',
    color: '#9370DB',
    description: 'Out Pattern: A habit of turning internal disappointment inward. The person often feels powerless, misunderstood, or targeted. In Pattern: A habit of turning internal disappointment.',
    category: 'Behavioral Pattern',
    impact: 'Medium',
    detailedDescription: 'Fundamentally "less than". This inner sense tracks their worth, value, and agency and makes it hard to recognize their strengths and agency.',
    interventions: [
      'Break victim-perpetrator-rescuer triangle patterns',
      'Assertiveness and boundary-setting training',
      'Self-advocacy skill development',
      'Therapeutic work on shame and powerlessness',
      'Build resilience and self-efficacy'
    ]
  },
  NIP13: {
    code: 'LACK',
    name: 'Lack State',
    color: '#696969',
    description: 'A situation created by limiting belief in financial means or material resources. The individual (or organization) may face genuine economic strain, depression, or other structural needs.',
    category: 'Scarcity Mindset',
    impact: 'Medium',
    detailedDescription: 'Restricted security and poverty thinking to separate or sustain daily needs effectively.',
    interventions: [
      'Financial literacy and planning education',
      'Abundance mindset cultivation practices',
      'Practical budgeting and resource management',
      'Address root beliefs about money and worth',
      'Community resources and support access'
    ]
  },
  NIP14: {
    code: 'DIM',
    name: 'Scatter Focus',
    color: '#B0C4DE',
    description: 'Describes how easily a person can move between detail and "big picture" thinking. Some get stuck in the small and lose track of practical steps.',
    category: 'Attention',
    impact: 'Medium',
    detailedDescription: 'Others float above the facts, making broad pronouncements that lack grounding in reality. A flexible focus imprint struggles to adjust between stress the person may either hyperfocus in overwhelming impact.',
    interventions: [
      'Attention training and focus techniques',
      'Task prioritization systems',
      'Environmental modifications for concentration',
      'Regular breaks and attention restoration',
      'ADHD assessment if patterns are pervasive'
    ]
  },
  NIP15: {
    code: 'FOC',
    name: 'Scatter Focus',
    color: '#CD5C5C',
    description: 'Refers to a pattern where a person struggles to rapidly between tasks, sounds, or ideas, making it hard to focus long enough to complete what was started.',
    category: 'Attention',
    impact: 'High',
    detailedDescription: 'The individual may feel restless, easily distracted, unfinished, lose track of instructions, or unable to hold one channel of attention in place.',
    interventions: [
      'Implement single-tasking practices',
      'Use of timers and structured work periods',
      'Minimize distractions in environment',
      'Attention training exercises',
      'Professional evaluation for attention disorders'
    ]
  },
  NIP16: {
    code: 'RES',
    name: 'Attitude',
    color: '#9ACD32',
    description: 'A consistent pattern of resistance or negativity expressed toward people, relationships, responsibilities, or life situations — shaping how one engages with the world around them.',
    category: 'Attitude',
    impact: 'Medium',
    detailedDescription: 'This outlook reflects ingrained defensive or oppositional stances formed through experience.',
    interventions: [
      'Identify and challenge automatic negative responses',
      'Gratitude and appreciation practices',
      'Explore origins of resistance patterns',
      'Develop openness and receptivity',
      'Motivational interviewing for ambivalence'
    ]
  },
  NIP17: {
    code: 'INWF',
    name: 'Inward Focus',
    color: '#D2691E',
    description: 'An amplified belief in one\'s own importance that results in self-centered attitudes and choices, frequently disregarding the feelings or needs of those around them.',
    category: 'Self-Perception',
    impact: 'Medium',
    detailedDescription: 'This pattern reflects narcissistic tendencies and lack of empathy for others.',
    interventions: [
      'Perspective-taking and empathy development',
      'Service and contribution to others',
      'Feedback reception and integration',
      'Exploration of underlying insecurity or wounds',
      'Relational therapy focused on mutuality'
    ]
  },
  NIP18: {
    code: 'CPL',
    name: 'Addictive Loops',
    color: '#DC143C',
    description: 'Refers to a repeated pattern of reaching for the same behavior — no matter how you feel — even when you know it works against the path. The goal is usually to soothe, distract, or create a sense of control.',
    category: 'Addiction',
    impact: 'Critical',
    detailedDescription: 'Includes substances, relationships, or calling. The goal is usually to be felt.',
    interventions: [
      'Addiction treatment program (inpatient or outpatient)',
      'Twelve-step or recovery support groups',
      'Address underlying trauma and emotional pain',
      'Healthy coping mechanisms development',
      'Relapse prevention planning and ongoing support'
    ]
  },
  NIP19: {
    code: 'BURN',
    name: 'Burned Out',
    color: '#A9A9A9',
    description: 'When a person feels or behaves older than their years — mentally, emotionally, or physically — usually because of weakness, stress overload, or prolonged caregiving.',
    category: 'Depletion',
    impact: 'High',
    detailedDescription: 'It reflects a restricted view of life that drains energy and hope, rather than renews.',
    interventions: [
      'Rest and recovery prioritization',
      'Stress management and life balance',
      'Energy restoration practices',
      'Reassess commitments and boundaries',
      'Address chronic stress sources and build resilience'
    ]
  },
  NIP20: {
    code: 'DEC',
    name: 'Deceiver',
    color: '#4B0082',
    description: 'An individual who masks self-serving motives with an appearance of goodness or innocence. Such people skillfully project their authentic but operate with hidden agendas.',
    category: 'Interpersonal',
    impact: 'High',
    detailedDescription: 'Pattern of manipulation at the benefit at the expense of those who trust them.',
    interventions: [
      'Honesty and integrity skill-building',
      'Explore underlying fears and insecurities',
      'Accountability and consequences',
      'Therapy for personality patterns',
      'Development of authentic self-expression'
    ]
  }
};

// Questions data (embedded from Excel)
const QUESTIONS_DATA = [
  // This will be populated from the Excel file
  // Format: { id, question, options: [], nipGroup }
];

// Component: Welcome Screen
const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-20 h-20 text-purple-300" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-5xl font-bold text-white text-center mb-4 tracking-tight">
            Neural Imprint Patterns
          </h1>
          <p className="text-xl text-purple-200 text-center mb-8">
            Self-Assessment Questionnaire
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
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Begin Assessment
          </button>
          
          <p className="text-center text-gray-400 mt-6 text-sm">
            Developed by BrainWorx™ • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

// Component: Questionnaire
const Questionnaire = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((Object.keys(answers).length / questions.length) * 100);
  }, [answers, questions.length]);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => onComplete(answers), 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;

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
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl mb-6 transform transition-all duration-300">
          <div className="mb-8">
            <div className="inline-block bg-purple-500/30 text-purple-200 px-4 py-2 rounded-full text-sm mb-4">
              {NIP_PATTERNS[question.nipGroup]?.name || question.nipGroup}
            </div>
            <h2 className="text-3xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
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
                    answers[currentQuestion] === index
                      ? 'bg-white/20'
                      : 'bg-white/10'
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

          {isAnswered && currentQuestion === questions.length - 1 && (
            <button
              onClick={() => onComplete(answers)}
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

// Component: Client Report (1-page summary)
const ClientReport = ({ results, onViewCoachReport }) => {
  const topPatterns = results.nipScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const radarData = results.nipScores.map(nip => ({
    pattern: NIP_PATTERNS[nip.nipGroup]?.code || nip.nipGroup,
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
              <h1 className="text-5xl font-bold mb-4">Neural Imprint Patterns</h1>
              <p className="text-2xl text-blue-100">Personal Assessment Report</p>
            </div>
            <Brain className="w-24 h-24 opacity-50" strokeWidth={1} />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{results.totalQuestions}</div>
              <div className="text-blue-100">Questions Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{results.completionDate}</div>
              <div className="text-blue-100">Assessment Date</div>
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
            {topPatterns.map((pattern, index) => {
              const nipInfo = NIP_PATTERNS[pattern.nipGroup];
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

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-blue-600" />
              Next Steps
            </h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              This report provides a high-level overview of your Neural Imprint Patterns. For a comprehensive 
              analysis with detailed interventions, coaching strategies, and personalized recommendations, 
              please review the full Coach Assessment Report.
            </p>
            <button
              onClick={onViewCoachReport}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
            >
              <FileText className="w-6 h-6" />
              View Full Coach Report
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-6 text-center text-gray-600">
          <p className="text-sm">Neural Imprint Patterns™ • Developed by BrainWorx™</p>
          <p className="text-xs mt-2">This report is confidential and intended for personal development purposes only.</p>
        </div>
      </div>
    </div>
  );
};

// Component: Coach Report (Detailed 45-min analysis)
const CoachReport = ({ results }) => {
  const [selectedPattern, setSelectedPattern] = useState(null);
  
  const topPatterns = results.nipScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const criticalPatterns = results.nipScores.filter(nip => {
    const pattern = NIP_PATTERNS[nip.nipGroup];
    return pattern?.impact === 'Critical' && nip.percentage >= 50;
  });

  const radarData = results.nipScores.map(nip => ({
    pattern: NIP_PATTERNS[nip.nipGroup]?.code || nip.nipGroup,
    score: nip.percentage,
    fullMark: 100
  }));

  const barData = topPatterns.map(nip => ({
    name: NIP_PATTERNS[nip.nipGroup]?.code || nip.nipGroup,
    score: nip.percentage,
    color: NIP_PATTERNS[nip.nipGroup]?.color || '#666'
  }));

  const categoryDistribution = {};
  results.nipScores.forEach(nip => {
    const category = NIP_PATTERNS[nip.nipGroup]?.category || 'Other';
    if (!categoryDistribution[category]) {
      categoryDistribution[category] = { total: 0, count: 0 };
    }
    categoryDistribution[category].total += nip.percentage;
    categoryDistribution[category].count += 1;
  });

  const categoryData = Object.entries(categoryDistribution).map(([category, data]) => ({
    category,
    average: Math.round(data.total / data.count)
  }));

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Print Header - Only visible when printing */}
        <div className="print-only hidden print:block mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-3xl">
            <h1 className="text-4xl font-bold">Neural Imprint Patterns™</h1>
            <p className="text-xl mt-2">Comprehensive Coach Assessment Report</p>
          </div>
        </div>

        {/* Screen Header - Hidden when printing */}
        <div className="print:hidden bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4">Coach Assessment Report</h1>
                <p className="text-2xl text-blue-100">Comprehensive 45-Minute Analysis</p>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Client Overview Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Brain className="w-9 h-9 text-blue-600" />
            Client Neural Imprint Profile
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Radar Chart */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Pattern Overview</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="pattern" tick={{ fontSize: 11, fill: '#475569' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Client Scores"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 10 Bar Chart */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top 10 Patterns by Score</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pattern Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8b5cf6" name="Average Score (%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Patterns Alert */}
        {criticalPatterns.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-10 mb-8">
            <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
              <AlertCircle className="w-9 h-9" />
              Critical Patterns Requiring Immediate Attention
            </h2>
            <p className="text-red-700 mb-6 text-lg leading-relaxed">
              The following patterns are rated as "Critical" impact and scored above 50%. These patterns 
              require priority attention and may benefit from professional therapeutic intervention.
            </p>
            <div className="space-y-4">
              {criticalPatterns.map(pattern => {
                const nipInfo = NIP_PATTERNS[pattern.nipGroup];
                return (
                  <div key={pattern.nipGroup} className="bg-white rounded-xl p-6 border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {nipInfo?.code} - {nipInfo?.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{nipInfo?.detailedDescription}</p>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-3xl font-bold text-red-600">{pattern.percentage}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Pattern Analysis */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Detailed Pattern Analysis & Interventions</h2>
          
          <div className="space-y-8">
            {topPatterns.map((pattern, index) => {
              const nipInfo = NIP_PATTERNS[pattern.nipGroup];
              const isExpanded = selectedPattern === pattern.nipGroup;
              
              return (
                <div
                  key={pattern.nipGroup}
                  className="border-2 rounded-2xl overflow-hidden transition-all"
                  style={{ borderColor: nipInfo?.color || '#666' }}
                >
                  <button
                    onClick={() => setSelectedPattern(isExpanded ? null : pattern.nipGroup)}
                    className="w-full p-6 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-left">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: nipInfo?.color || '#666' }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {nipInfo?.code} - {nipInfo?.name}
                          </h3>
                          <p className="text-gray-600 mt-1">{nipInfo?.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{pattern.percentage}%</div>
                        <div className="text-sm text-gray-500">Score</div>
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="p-8 bg-white border-t-2" style={{ borderTopColor: nipInfo?.color || '#666' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nipInfo?.color }}></div>
                            Pattern Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-semibold text-gray-800">{nipInfo?.category}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-600">Impact Level:</span>
                              <span className={`font-semibold px-3 py-1 rounded-full ${
                                nipInfo?.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                                nipInfo?.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {nipInfo?.impact}
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-600">Raw Score:</span>
                              <span className="font-semibold text-gray-800">{pattern.score} / {pattern.maxScore}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nipInfo?.color }}></div>
                            Clinical Description
                          </h4>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {nipInfo?.detailedDescription}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" style={{ color: nipInfo?.color }} />
                          Recommended Interventions & Coaching Strategies
                        </h4>
                        <ul className="space-y-3">
                          {nipInfo?.interventions.map((intervention, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5 flex-shrink-0"
                                style={{ backgroundColor: nipInfo?.color }}
                              >
                                {i + 1}
                              </div>
                              <span className="text-gray-700 leading-relaxed">{intervention}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-2">Coaching Notes:</h5>
                        <p className="text-gray-700 leading-relaxed">
                          With a score of {pattern.percentage}%, this pattern shows 
                          {pattern.percentage >= 70 ? ' strong' : pattern.percentage >= 50 ? ' moderate' : ' mild'} presence. 
                          {pattern.percentage >= 70 ? ' Priority intervention recommended.' : 
                           pattern.percentage >= 50 ? ' Active monitoring and targeted strategies advised.' :
                           ' Awareness and preventive strategies may be beneficial.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Coaching Recommendations Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Overall Coaching Recommendations</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Primary Focus Areas</h3>
              <ul className="space-y-3">
                {topPatterns.slice(0, 3).map((pattern, index) => {
                  const nipInfo = NIP_PATTERNS[pattern.nipGroup];
                  return (
                    <li key={pattern.nipGroup} className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: nipInfo?.color }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800">{nipInfo?.name}:</span>
                        <span className="text-gray-700 ml-2">
                          Focus on {nipInfo?.interventions[0]?.toLowerCase()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Suggested Timeline</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Weeks 1-4: Assessment & Stabilization</h4>
                  <p className="text-gray-700">Establish baseline, build rapport, and implement immediate stabilization strategies for critical patterns.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Weeks 5-12: Active Intervention</h4>
                  <p className="text-gray-700">Deep work on top 3-5 patterns with regular monitoring and adjustment of strategies.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Weeks 13-24: Integration & Maintenance</h4>
                  <p className="text-gray-700">Consolidate gains, develop long-term management strategies, and prepare for independent practice.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Referrals</h3>
              <p className="text-gray-700 mb-4">
                Based on the assessment results, consider referrals to:
              </p>
              <ul className="space-y-2">
                {criticalPatterns.length > 0 && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700"><strong>Mental Health Professional:</strong> For critical pattern management</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700"><strong>Trauma Specialist:</strong> If trauma-related patterns are present</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>Neuropsychologist:</strong> For attention/executive function patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-gray-600 mb-2">
            <strong>Neural Imprint Patterns™</strong> • Developed by BrainWorx™
          </p>
          <p className="text-sm text-gray-500">
            This report is confidential and intended for professional coaching use only.
            Assessment completed on {results.completionDate}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            © BrainWorx™ • All Rights Reserved • Not affiliated with any other commercial profiling system
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const NIPAssessment = () => {
  const [stage, setStage] = useState('welcome'); // welcome, questionnaire, clientReport, coachReport
  const [results, setResults] = useState(null);

  // Load questions from imported data
  // IMPORTANT: You need to import your questions data at the top of this file:
  // import questionsData from './data/questions-data.json';
  // Then uncomment the line below and remove the empty array:
  
  const [questions, setQuestions] = useState([]);
  // const [questions, setQuestions] = useState(questionsData); // Uncomment after importing

  useEffect(() => {
    // For deployment: Import questions-data.json and use it directly
    // This useEffect is a fallback for demo purposes
    if (questions.length === 0) {
      // Try to load from public folder as fallback
      fetch('/questions-data.json')
        .then(res => res.json())
        .then(data => setQuestions(data))
        .catch(error => {
          console.error('Failed to load questions:', error);
          alert('Please ensure questions-data.json is properly loaded. See README for instructions.');
        });
    }
  }, [questions.length]);

  const calculateResults = (answers) => {
    const nipScores = {};
    
    // Initialize scores
    Object.keys(NIP_PATTERNS).forEach(nip => {
      nipScores[nip] = { score: 0, maxScore: 0, count: 0 };
    });
    
    // Calculate scores
    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer !== undefined) {
        const nipGroup = question.nipGroup;
        nipScores[nipGroup].score += answer;
        nipScores[nipGroup].maxScore += 3; // Max answer value is 3
        nipScores[nipGroup].count += 1;
      }
    });
    
    // Convert to array and calculate percentages
    const nipScoresArray = Object.entries(nipScores).map(([nipGroup, data]) => ({
      nipGroup,
      score: data.score,
      maxScore: data.maxScore,
      count: data.count,
      percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0
    }));
    
    return {
      nipScores: nipScoresArray,
      totalQuestions: questions.length,
      completionDate: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
  };

  const handleComplete = (answers) => {
    const calculatedResults = calculateResults(answers);
    setResults(calculatedResults);
    setStage('clientReport');
  };

  const handleViewCoachReport = () => {
    setStage('coachReport');
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div>
      {stage === 'welcome' && (
        <WelcomeScreen onStart={() => setStage('questionnaire')} />
      )}
      
      {stage === 'questionnaire' && (
        <Questionnaire questions={questions} onComplete={handleComplete} />
      )}
      
      {stage === 'clientReport' && results && (
        <ClientReport results={results} onViewCoachReport={handleViewCoachReport} />
      )}
      
      {stage === 'coachReport' && results && (
        <CoachReport results={results} />
      )}

      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NIPAssessment;
