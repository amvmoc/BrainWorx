import React, { useState, useEffect, createContext, useContext } from 'react';

// ==================== DATA & CONSTANTS ====================

const CATEGORIES = {
  INATTENTION: 'INATTENTION',
  HYPERACTIVITY: 'HYPERACTIVITY',
  IMPULSIVITY: 'IMPULSIVITY',
  EXECUTIVE_FUNCTION: 'EXECUTIVE_FUNCTION',
  EMOTIONAL_REGULATION: 'EMOTIONAL_REGULATION',
  SOCIAL_SKILLS: 'SOCIAL_SKILLS',
  ACADEMIC_PERFORMANCE: 'ACADEMIC_PERFORMANCE',
  DAILY_FUNCTIONING: 'DAILY_FUNCTIONING'
};

const NIPP_PATTERNS = {
  FOC: { code: 'FOC', name: 'Scattered Focus', category: 'Core ADHD' },
  HYP: { code: 'HYP', name: 'High Gear', category: 'Core ADHD' },
  IMP: { code: 'IMP', name: 'Impulse Rush', category: 'Core ADHD' },
  ORG: { code: 'ORG', name: 'Time & Order', category: 'Core ADHD' },
  DIM: { code: 'DIM', name: 'Flexible Focus', category: 'Core ADHD' },
  ANG: { code: 'ANG', name: 'Anchored Anger', category: 'Emotional/Impact' },
  RES: { code: 'RES', name: 'Resistance / Attitude', category: 'Emotional/Impact' },
  INWF: { code: 'INWF', name: 'Inward Focus', category: 'Emotional/Impact' },
  BURN: { code: 'BURN', name: 'Burned Out', category: 'Emotional/Impact' },
  BULLY: { code: 'BULLY', name: 'Victim Loops', category: 'Emotional/Impact' }
};

const QUESTIONS = [
  // INATTENTION (10 questions)
  { id: 1, category: 'INATTENTION', text: 'Has trouble keeping attention on tasks or play activities' },
  { id: 2, category: 'INATTENTION', text: 'Doesn\'t seem to listen when spoken to directly' },
  { id: 3, category: 'INATTENTION', text: 'Doesn\'t follow through on instructions and fails to finish schoolwork' },
  { id: 4, category: 'INATTENTION', text: 'Has difficulty organizing tasks and activities' },
  { id: 5, category: 'INATTENTION', text: 'Avoids tasks that require sustained mental effort' },
  { id: 6, category: 'INATTENTION', text: 'Loses things necessary for tasks or activities' },
  { id: 7, category: 'INATTENTION', text: 'Is easily distracted by external stimuli' },
  { id: 8, category: 'INATTENTION', text: 'Is forgetful in daily activities' },
  { id: 9, category: 'INATTENTION', text: 'Makes careless mistakes in schoolwork' },
  { id: 10, category: 'INATTENTION', text: 'Has difficulty sustaining attention during lectures or reading' },
  
  // HYPERACTIVITY (10 questions)
  { id: 11, category: 'HYPERACTIVITY', text: 'Fidgets with hands or feet or squirms in seat' },
  { id: 12, category: 'HYPERACTIVITY', text: 'Leaves seat when remaining seated is expected' },
  { id: 13, category: 'HYPERACTIVITY', text: 'Runs about or climbs excessively in inappropriate situations' },
  { id: 14, category: 'HYPERACTIVITY', text: 'Has difficulty playing or engaging in leisure activities quietly' },
  { id: 15, category: 'HYPERACTIVITY', text: 'Is "on the go" or acts as if "driven by a motor"' },
  { id: 16, category: 'HYPERACTIVITY', text: 'Talks excessively' },
  { id: 17, category: 'HYPERACTIVITY', text: 'Has difficulty sitting still for meals' },
  { id: 18, category: 'HYPERACTIVITY', text: 'Seems restless or unable to relax' },
  { id: 19, category: 'HYPERACTIVITY', text: 'Has high energy levels that are hard to manage' },
  { id: 20, category: 'HYPERACTIVITY', text: 'Moves constantly even when trying to focus' },
  
  // IMPULSIVITY (10 questions)
  { id: 21, category: 'IMPULSIVITY', text: 'Blurts out answers before questions have been completed' },
  { id: 22, category: 'IMPULSIVITY', text: 'Has difficulty waiting their turn' },
  { id: 23, category: 'IMPULSIVITY', text: 'Interrupts or intrudes on others' },
  { id: 24, category: 'IMPULSIVITY', text: 'Acts without thinking about consequences' },
  { id: 25, category: 'IMPULSIVITY', text: 'Has difficulty controlling impulses' },
  { id: 26, category: 'IMPULSIVITY', text: 'Rushes through tasks without checking work' },
  { id: 27, category: 'IMPULSIVITY', text: 'Makes quick decisions without considering alternatives' },
  { id: 28, category: 'IMPULSIVITY', text: 'Has trouble stopping an activity when told to' },
  { id: 29, category: 'IMPULSIVITY', text: 'Grabs things from others without asking' },
  { id: 30, category: 'IMPULSIVITY', text: 'Reacts immediately without pausing to think' },
  
  // EXECUTIVE_FUNCTION (10 questions)
  { id: 31, category: 'EXECUTIVE_FUNCTION', text: 'Has difficulty planning ahead for tasks' },
  { id: 32, category: 'EXECUTIVE_FUNCTION', text: 'Struggles to estimate how long tasks will take' },
  { id: 33, category: 'EXECUTIVE_FUNCTION', text: 'Has trouble organizing belongings and materials' },
  { id: 34, category: 'EXECUTIVE_FUNCTION', text: 'Forgets to bring home necessary materials' },
  { id: 35, category: 'EXECUTIVE_FUNCTION', text: 'Has difficulty managing time effectively' },
  { id: 36, category: 'EXECUTIVE_FUNCTION', text: 'Struggles with multi-step directions' },
  { id: 37, category: 'EXECUTIVE_FUNCTION', text: 'Has messy backpack, desk, or room' },
  { id: 38, category: 'EXECUTIVE_FUNCTION', text: 'Loses track of assignments or deadlines' },
  { id: 39, category: 'EXECUTIVE_FUNCTION', text: 'Has difficulty prioritizing tasks' },
  { id: 40, category: 'EXECUTIVE_FUNCTION', text: 'Needs reminders to complete basic routines' },
  
  // EMOTIONAL_REGULATION (10 questions)
  { id: 41, category: 'EMOTIONAL_REGULATION', text: 'Has frequent angry outbursts' },
  { id: 42, category: 'EMOTIONAL_REGULATION', text: 'Gets frustrated easily with tasks' },
  { id: 43, category: 'EMOTIONAL_REGULATION', text: 'Has difficulty calming down once upset' },
  { id: 44, category: 'EMOTIONAL_REGULATION', text: 'Reacts intensely to small disappointments' },
  { id: 45, category: 'EMOTIONAL_REGULATION', text: 'Shows irritability or bad temper' },
  { id: 46, category: 'EMOTIONAL_REGULATION', text: 'Has meltdowns or tantrums' },
  { id: 47, category: 'EMOTIONAL_REGULATION', text: 'Struggles with transitions between activities' },
  { id: 48, category: 'EMOTIONAL_REGULATION', text: 'Gets anxious or worried frequently' },
  { id: 49, category: 'EMOTIONAL_REGULATION', text: 'Has negative thoughts about themselves' },
  { id: 50, category: 'EMOTIONAL_REGULATION', text: 'Feels ashamed or embarrassed often' },
  
  // SOCIAL_SKILLS (10 questions)
  { id: 51, category: 'SOCIAL_SKILLS', text: 'Has difficulty making or keeping friends' },
  { id: 52, category: 'SOCIAL_SKILLS', text: 'Experiences conflict with peers frequently' },
  { id: 53, category: 'SOCIAL_SKILLS', text: 'Is teased or bullied by other children' },
  { id: 54, category: 'SOCIAL_SKILLS', text: 'Feels left out or excluded by peers' },
  { id: 55, category: 'SOCIAL_SKILLS', text: 'Withdraws from social situations' },
  { id: 56, category: 'SOCIAL_SKILLS', text: 'Is overly sensitive to peer rejection' },
  { id: 57, category: 'SOCIAL_SKILLS', text: 'Has trouble reading social cues' },
  { id: 58, category: 'SOCIAL_SKILLS', text: 'Struggles with cooperative play' },
  { id: 59, category: 'SOCIAL_SKILLS', text: 'Reports feeling "different" from other kids' },
  { id: 60, category: 'SOCIAL_SKILLS', text: 'Avoids group activities or recess' },
  
  // ACADEMIC_PERFORMANCE (10 questions)
  { id: 61, category: 'ACADEMIC_PERFORMANCE', text: 'Starts assignments but doesn\'t finish them' },
  { id: 62, category: 'ACADEMIC_PERFORMANCE', text: 'Has inconsistent academic performance' },
  { id: 63, category: 'ACADEMIC_PERFORMANCE', text: 'Loses track during reading or listening' },
  { id: 64, category: 'ACADEMIC_PERFORMANCE', text: 'Performance varies greatly day to day' },
  { id: 65, category: 'ACADEMIC_PERFORMANCE', text: 'Struggles to keep up with classwork' },
  { id: 66, category: 'ACADEMIC_PERFORMANCE', text: 'Shows mental fatigue during homework' },
  { id: 67, category: 'ACADEMIC_PERFORMANCE', text: 'Gives up easily on difficult tasks' },
  { id: 68, category: 'ACADEMIC_PERFORMANCE', text: 'Has difficulty retaining information' },
  { id: 69, category: 'ACADEMIC_PERFORMANCE', text: 'Needs constant help with schoolwork' },
  { id: 70, category: 'ACADEMIC_PERFORMANCE', text: 'Falls behind despite effort' },
  
  // DAILY_FUNCTIONING (10 questions)
  { id: 71, category: 'DAILY_FUNCTIONING', text: 'Resists or argues about daily routines' },
  { id: 72, category: 'DAILY_FUNCTIONING', text: 'Avoids or delays homework time' },
  { id: 73, category: 'DAILY_FUNCTIONING', text: 'Pushes back against chores or responsibilities' },
  { id: 74, category: 'DAILY_FUNCTIONING', text: 'Has difficulty with morning or bedtime routines' },
  { id: 75, category: 'DAILY_FUNCTIONING', text: 'Complains about being overwhelmed' },
  { id: 76, category: 'DAILY_FUNCTIONING', text: 'Seems tired or exhausted frequently' },
  { id: 77, category: 'DAILY_FUNCTIONING', text: 'Has meltdowns after school' },
  { id: 78, category: 'DAILY_FUNCTIONING', text: 'Needs excessive downtime to recover' },
  { id: 79, category: 'DAILY_FUNCTIONING', text: 'Refuses to participate in family activities' },
  { id: 80, category: 'DAILY_FUNCTIONING', text: 'Shows oppositional behavior at home' }
];

// ==================== HELPER FUNCTIONS ====================

const calculateNIPPScores = (categoryScores) => ({
  FOC: categoryScores.INATTENTION,
  HYP: categoryScores.HYPERACTIVITY,
  IMP: categoryScores.IMPULSIVITY,
  ORG: categoryScores.EXECUTIVE_FUNCTION,
  DIM: categoryScores.ACADEMIC_PERFORMANCE,
  ANG: categoryScores.EMOTIONAL_REGULATION,
  RES: categoryScores.DAILY_FUNCTIONING,
  INWF: (categoryScores.EMOTIONAL_REGULATION + categoryScores.SOCIAL_SKILLS) / 2,
  BURN: (categoryScores.ACADEMIC_PERFORMANCE + categoryScores.DAILY_FUNCTIONING) / 2,
  BULLY: categoryScores.SOCIAL_SKILLS
});

const getSeverityLabel = (score) => {
  if (score < 1.5) return 'Low / Minimal';
  if (score < 2.5) return 'Mild / Occasional';
  if (score < 3.5) return 'Moderate';
  return 'High';
};

const getADHDInterpretation = (nippScores) => {
  const corePatterns = ['FOC', 'HYP', 'IMP', 'ORG', 'DIM'];
  const coreScores = corePatterns.map(p => nippScores[p]);
  const moderateOrHighCount = coreScores.filter(s => s >= 2.5).length;
  const avgCoreScore = coreScores.reduce((a, b) => a + b, 0) / coreScores.length;
  
  let interpretation = '';
  if (moderateOrHighCount >= 4 && avgCoreScore >= 3.0) {
    interpretation = 'Parent + teacher ratings show a strong ADHD-style pattern across several core domains (attention, organisation, activity level and impulse control). This is highly suggestive of clinically significant ADHD traits. A formal diagnostic assessment by a psychologist or psychiatrist is strongly recommended.';
  } else if (moderateOrHighCount >= 3 && avgCoreScore >= 2.5) {
    interpretation = 'Ratings indicate moderate ADHD-style patterns across multiple domains. Several areas show consistent elevation. A professional evaluation is recommended to determine if formal assessment is warranted.';
  } else if (moderateOrHighCount >= 2) {
    interpretation = 'Some ADHD-style patterns are present. Consider discussing these results with a qualified professional to determine appropriate support strategies.';
  } else {
    interpretation = 'Current ratings show limited ADHD-style patterns. Continue monitoring and provide support in areas showing mild elevation.';
  }
  
  return { moderateOrHighCount, avgCoreScore: avgCoreScore.toFixed(2), interpretation };
};

const scoreToPercentage = (score) => Math.round(((score - 1) / 3) * 100);

// ==================== CONTEXT ====================

const AssessmentContext = createContext();

const AssessmentProvider = ({ children }) => {
  const [screen, setScreen] = useState('start');
  const [childInfo, setChildInfo] = useState({ name: '', age: '', parent: '', teacher: '', teacherEmail: '', coach: '' });
  const [parentAnswers, setParentAnswers] = useState({});
  const [teacherAnswers, setTeacherAnswers] = useState({});
  const [results, setResults] = useState(null);

  const calculateResults = () => {
    const parentCategoryScores = {};
    Object.values(CATEGORIES).forEach(cat => {
      const questions = QUESTIONS.filter(q => q.category === cat);
      const answers = questions.map(q => parentAnswers[q.id] || 0);
      parentCategoryScores[cat] = answers.reduce((a, b) => a + b, 0) / answers.length;
    });

    const teacherCategoryScores = {};
    Object.values(CATEGORIES).forEach(cat => {
      const questions = QUESTIONS.filter(q => q.category === cat);
      const answers = questions.map(q => teacherAnswers[q.id] || 0);
      teacherCategoryScores[cat] = answers.reduce((a, b) => a + b, 0) / answers.length;
    });

    const parentNIPP = calculateNIPPScores(parentCategoryScores);
    const teacherNIPP = calculateNIPPScores(teacherCategoryScores);
    const combinedNIPP = {};
    Object.keys(parentNIPP).forEach(pattern => {
      combinedNIPP[pattern] = (parentNIPP[pattern] + teacherNIPP[pattern]) / 2;
    });

    const resultsArray = Object.keys(NIPP_PATTERNS).map(code => ({
      code,
      name: NIPP_PATTERNS[code].name,
      category: NIPP_PATTERNS[code].category,
      parentScore: parentNIPP[code],
      teacherScore: teacherNIPP[code],
      combinedScore: combinedNIPP[code],
      parentLabel: getSeverityLabel(parentNIPP[code]),
      teacherLabel: getSeverityLabel(teacherNIPP[code]),
      combinedLabel: getSeverityLabel(combinedNIPP[code]),
      percentage: scoreToPercentage(combinedNIPP[code])
    }));

    resultsArray.sort((a, b) => b.combinedScore - a.combinedScore);
    const interpretation = getADHDInterpretation(combinedNIPP);
    
    setResults({
      patterns: resultsArray,
      interpretation,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    setScreen('results');
  };

  return (
    <AssessmentContext.Provider value={{
      screen, setScreen, childInfo, setChildInfo,
      parentAnswers, setParentAnswers, teacherAnswers, setTeacherAnswers,
      results, calculateResults
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

const useAssessment = () => useContext(AssessmentContext);

// ==================== COMPONENTS ====================

const StartScreen = () => {
  const { setScreen, childInfo, setChildInfo } = useAssessment();
  const [errors, setErrors] = useState({});

  const handleStart = () => {
    const newErrors = {};
    if (!childInfo.name) newErrors.name = 'Required';
    if (!childInfo.age) newErrors.age = 'Required';
    if (!childInfo.parent) newErrors.parent = 'Required';
    if (!childInfo.teacher) newErrors.teacher = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setScreen('parent');
  };

  return (
    <div style={styles.startScreen}>
      <div style={styles.startContainer}>
        <div style={styles.logoSection}>
          <div style={styles.logoPlaceholder}>BrainWorx / NIPP Logo</div>
          <h1 style={styles.mainHeading}>BrainWorx Neural Imprint Patterns (NIPP)</h1>
          <p style={styles.subtitle}>Child Focus & Behaviour Screen (7–10 years)</p>
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.sectionHeading}>Assessment Information</h2>
          <p style={styles.infoText}>This assessment evaluates ADHD-style patterns and related emotional/impact domains for school-aged children.</p>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Child Name *</label>
            <input 
              type="text"
              value={childInfo.name}
              onChange={(e) => setChildInfo({...childInfo, name: e.target.value})}
              style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Age *</label>
            <input 
              type="number"
              min="7"
              max="10"
              value={childInfo.age}
              onChange={(e) => setChildInfo({...childInfo, age: e.target.value})}
              style={{...styles.input, ...(errors.age ? styles.inputError : {})}}
            />
            {errors.age && <span style={styles.errorText}>{errors.age}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Parent Name *</label>
            <input 
              type="text"
              value={childInfo.parent}
              onChange={(e) => setChildInfo({...childInfo, parent: e.target.value})}
              style={{...styles.input, ...(errors.parent ? styles.inputError : {})}}
            />
            {errors.parent && <span style={styles.errorText}>{errors.parent}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Teacher Name *</label>
            <input 
              type="text"
              value={childInfo.teacher}
              onChange={(e) => setChildInfo({...childInfo, teacher: e.target.value})}
              style={{...styles.input, ...(errors.teacher ? styles.inputError : {})}}
            />
            {errors.teacher && <span style={styles.errorText}>{errors.teacher}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Teacher Email</label>
            <input 
              type="email"
              value={childInfo.teacherEmail}
              onChange={(e) => setChildInfo({...childInfo, teacherEmail: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Coach Name (optional)</label>
            <input 
              type="text"
              value={childInfo.coach}
              onChange={(e) => setChildInfo({...childInfo, coach: e.target.value})}
              style={styles.input}
            />
          </div>

          <button style={styles.startButton} onClick={handleStart}>
            Begin Assessment →
          </button>
        </div>
      </div>
    </div>
  );
};

const QuestionnaireScreen = ({ type }) => {
  const { childInfo, parentAnswers, setParentAnswers, teacherAnswers, setTeacherAnswers, setScreen } = useAssessment();
  const answers = type === 'parent' ? parentAnswers : teacherAnswers;
  const setAnswers = type === 'parent' ? setParentAnswers : setTeacherAnswers;

  const handleAnswer = (questionId, value) => {
    setAnswers({...answers, [questionId]: value});
  };

  const isComplete = QUESTIONS.every(q => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  const handleNext = () => {
    if (!isComplete) {
      alert('Please answer all questions before continuing.');
      return;
    }
    if (type === 'parent') {
      setScreen('teacher');
    } else {
      setScreen('processing');
    }
  };

  return (
    <div style={styles.questionnaireScreen}>
      <div style={styles.questionnaireHeader}>
        <div style={styles.logoSmall}>BrainWorx NIPP</div>
        <div style={styles.childInfoSmall}>
          {childInfo.name} (Age {childInfo.age})
        </div>
      </div>

      <div style={styles.questionnaireContainer}>
        <div style={styles.questionnaireTitle}>
          <h1 style={styles.questionnaireH1}>{type === 'parent' ? 'Parent' : 'Teacher'} Assessment</h1>
          <p style={styles.raterName}>
            Completed by: {type === 'parent' ? childInfo.parent : childInfo.teacher}
          </p>
          <p style={styles.progressText}>
            {answeredCount} of {QUESTIONS.length} questions answered
          </p>
        </div>

        <div style={styles.instructions}>
          <p style={styles.instructionsText}>Rate how true each statement is for this child on a scale of 1-4:</p>
          <div style={styles.scaleLegend}>
            <span style={styles.scaleItem}>1 = Not at all true</span>
            <span style={styles.scaleItem}>2 = Somewhat true</span>
            <span style={styles.scaleItem}>3 = Mostly true</span>
            <span style={styles.scaleItem}>4 = Completely true</span>
          </div>
        </div>

        <div style={styles.questionsList}>
          {QUESTIONS.map(question => (
            <div key={question.id} style={styles.questionItem}>
              <div style={styles.questionText}>
                <span style={styles.questionNumber}>Q{question.id}.</span>
                {question.text}
              </div>
              <div style={styles.answerOptions}>
                {[1, 2, 3, 4].map(value => (
                  <button
                    key={value}
                    style={{
                      ...styles.answerBtn,
                      ...(answers[question.id] === value ? styles.answerBtnSelected : {})
                    }}
                    onClick={() => handleAnswer(question.id, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.questionnaireFooter}>
          <button 
            style={{
              ...styles.nextButton,
              ...(isComplete ? {} : styles.nextButtonDisabled)
            }}
            onClick={handleNext}
            disabled={!isComplete}
          >
            {type === 'parent' ? 'Continue to Teacher Assessment →' : 'Generate Reports →'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProcessingScreen = () => {
  const { calculateResults } = useAssessment();

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResults();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.processingScreen}>
      <div style={styles.processingContainer}>
        <div style={styles.spinner}></div>
        <h2 style={styles.processingH2}>Calculating Results...</h2>
        <p style={styles.processingText}>Analyzing parent and teacher responses</p>
      </div>
    </div>
  );
};

const ResultsSelectionScreen = () => {
  const { setScreen } = useAssessment();

  return (
    <div style={styles.resultsScreen}>
      <div style={styles.selectionContainer}>
        <h1 style={styles.selectionH1}>Reports Generated Successfully!</h1>
        <p style={styles.selectionSubtitle}>Choose which report you'd like to view:</p>

        <div style={styles.reportCards}>
          <div style={styles.reportCard} onClick={() => setScreen('parent-report')}>
            <div style={styles.reportIcon}>📊</div>
            <h3 style={styles.reportCardH3}>Parent Summary Report</h3>
            <p style={styles.reportCardText}>Easy-to-read overview with visual charts and practical guidance for home and school support.</p>
            <button style={styles.viewReportBtn}>View Parent Report →</button>
          </div>

          <div style={styles.reportCard} onClick={() => setScreen('coach-report')}>
            <div style={styles.reportIcon}>🎓</div>
            <h3 style={styles.reportCardH3}>Professional / Coach Report</h3>
            <p style={styles.reportCardText}>Detailed clinical analysis with cross-setting comparisons and coaching focus suggestions.</p>
            <button style={styles.viewReportBtn}>View Coach Report →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParentSummaryReport = () => {
  const { results, childInfo, setScreen } = useAssessment();
  const corePatterns = results.patterns.filter(p => p.category === 'Core ADHD');
  const emotionalPatterns = results.patterns.filter(p => p.category === 'Emotional/Impact');

  return (
    <div style={styles.reportPage}>
      <button style={styles.backButton} onClick={() => setScreen('results')}>
        ← Back to Report Selection
      </button>

      <div style={styles.pageHeader}>
        <div>
          <div style={styles.logoPlaceholder}>BrainWorx / NIPP Logo</div>
          <div style={styles.brandText}>
            <strong>BrainWorx</strong> – Neural Imprint Patterns (NIPP)<br/>
            Child Focus & Behaviour Screen (7–10 years)
          </div>
        </div>
        <div style={styles.clientInfo}>
          <div>Child Name: {childInfo.name}</div>
          <div>Age: {childInfo.age}</div>
          <div>Parent: {childInfo.parent}</div>
          <div>Teacher: {childInfo.teacher}</div>
          {childInfo.teacherEmail && <div>Teacher email: {childInfo.teacherEmail}</div>}
          <div>Date: {results.date}</div>
        </div>
      </div>

      <h1 style={styles.reportH1}>Parent Summary Report</h1>
      <p style={styles.smallText}>
        This report gives a picture of how your child's focus, homework habits, energy and emotions
        show up at home and at school. It is not a diagnosis, but a map to guide support and possible
        next steps.
      </p>

      <h2 style={styles.reportH2}>Focus, homework and impulse patterns</h2>
      <p style={styles.smallText}>
        These patterns show how your child manages attention, organisation and self-control for
        school-age demands.
      </p>

      {corePatterns.map(pattern => (
        <div key={pattern.code} style={styles.patternCard}>
          <div style={styles.patternTitle}>{pattern.code} – {pattern.name}</div>
          <p style={styles.smallText}><strong>At home:</strong> Average {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})</p>
          <p style={styles.smallText}><strong>At school:</strong> Average {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})</p>
          <p style={styles.smallText}><strong>Overall pattern:</strong> Average {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})</p>
          <div style={styles.barContainer}>
            <div style={{...styles.barFill, width: `${pattern.percentage}%`}}></div>
          </div>
          <div style={styles.barLabel}>{pattern.percentage}% of maximum intensity</div>
        </div>
      ))}

      <h2 style={styles.reportH2}>Emotional and impact patterns</h2>
      <p style={styles.smallText}>
        These patterns look at frustration, worry, resistance and how your child experiences themselves
        and other children in this stage of school.
      </p>

      {emotionalPatterns.map(pattern => (
        <div key={pattern.code} style={styles.patternCard}>
          <div style={styles.patternTitle}>{pattern.code} – {pattern.name}</div>
          <p style={styles.smallText}><strong>At home:</strong> Average {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})</p>
          <p style={styles.smallText}><strong>At school:</strong> Average {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})</p>
          <p style={styles.smallText}><strong>Overall pattern:</strong> Average {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})</p>
          <div style={styles.barContainer}>
            <div style={{...styles.barFill, width: `${pattern.percentage}%`}}></div>
          </div>
          <div style={styles.barLabel}>{pattern.percentage}% of maximum intensity</div>
        </div>
      ))}

      <h2 style={styles.reportH2}>How to use this as a parent</h2>
      <p style={styles.smallText}>
        • Patterns in the <strong>Moderate</strong> or <strong>High</strong> range are good places
        to start working with your coach or a professional on practical support at home and school.
      </p>
      <p style={styles.smallText}>
        • A higher score does not mean your child is "lazy" or "naughty". It usually shows where
        their brain needs more structure, routines and understanding.
      </p>
      <p style={styles.smallText}>
        • This report cannot diagnose ADHD. If you are concerned, please discuss these results with
        a paediatrician, psychologist or other qualified health professional.
      </p>
    </div>
  );
};

const CoachReport = () => {
  const { results, childInfo, setScreen } = useAssessment();
  const corePatterns = results.patterns.filter(p => p.category === 'Core ADHD');
  const emotionalPatterns = results.patterns.filter(p => p.category === 'Emotional/Impact');

  return (
    <div style={styles.reportPage}>
      <button style={styles.backButton} onClick={() => setScreen('results')}>
        ← Back to Report Selection
      </button>

      <div style={styles.pageHeader}>
        <div>
          <div style={styles.logoPlaceholder}>BrainWorx / NIPP Logo</div>
          <div style={styles.brandText}>
            <strong>BrainWorx</strong> – Neural Imprint Patterns (NIPP)<br/>
            Child Focus & Behaviour Screen (7–10 years)
          </div>
        </div>
        <div style={styles.clientInfo}>
          <div>Child Name: {childInfo.name}</div>
          <div>Age: {childInfo.age}</div>
          {childInfo.coach && <div>Coach: {childInfo.coach}</div>}
          <div>Teacher: {childInfo.teacher}</div>
          {childInfo.teacherEmail && <div>Teacher email: {childInfo.teacherEmail}</div>}
          <div>Date: {results.date}</div>
        </div>
      </div>

      <h1 style={styles.reportH1}>Professional / Coach Report</h1>
      <p style={styles.smallText}>
        This report summarises parent and teacher observations of ADHD-style patterns and related
        emotional/impact domains for a school-aged child (7–10). It is a screening and coaching tool
        and does not replace a full diagnostic assessment.
      </p>

      <h2 style={styles.reportH2}>Overall ADHD pattern indicator</h2>
      <p style={styles.smallText}>
        <strong>Core patterns with Moderate/High combined scores:</strong> {results.interpretation.moderateOrHighCount} out of 5
      </p>
      <p style={styles.smallText}>
        <strong>Average combined core ADHD score:</strong> {results.interpretation.avgCoreScore} (1.00–4.00 scale)
      </p>
      <p style={styles.smallText}>
        <strong>Interpretation summary:</strong> {results.interpretation.interpretation}
      </p>
      <p style={styles.noteText}>
        Summary based solely on these rating scales. Integrate with history, direct observation,
        developmental expectations and any additional assessment data.
      </p>

      <h2 style={styles.reportH2}>Core ADHD domains</h2>

      {corePatterns.map(pattern => (
        <div key={pattern.code} style={styles.patternCard}>
          <div style={styles.patternTitle}>{pattern.code} – {pattern.name}</div>
          <p style={styles.smallText}><strong>Parent:</strong> Avg {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})</p>
          <p style={styles.smallText}><strong>Teacher:</strong> Avg {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})</p>
          <p style={styles.smallText}><strong>Combined:</strong> {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})</p>
          <div style={styles.barContainer}>
            <div style={{...styles.barFill, width: `${pattern.percentage}%`}}></div>
          </div>
          <div style={styles.barLabel}>{pattern.percentage}% of maximum intensity</div>
          <p style={styles.noteText}>
            Examine cross-setting consistency. Pervasive elevation (home + school) supports an
            ADHD-style profile; context-specific elevation can highlight environmental/relational
            contributors.
          </p>
        </div>
      ))}

      <h2 style={styles.reportH2}>Emotional / impact domains</h2>

      {emotionalPatterns.map(pattern => (
        <div key={pattern.code} style={styles.patternCard}>
          <div style={styles.patternTitle}>{pattern.code} – {pattern.name}</div>
          <p style={styles.smallText}><strong>Parent:</strong> Avg {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})</p>
          <p style={styles.smallText}><strong>Teacher:</strong> Avg {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})</p>
          <p style={styles.smallText}><strong>Combined:</strong> {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})</p>
          <div style={styles.barContainer}>
            <div style={{...styles.barFill, width: `${pattern.percentage}%`}}></div>
          </div>
          <div style={styles.barLabel}>{pattern.percentage}% of maximum intensity</div>
          <p style={styles.noteText}>
            Examine cross-setting consistency. Pervasive elevation (home + school) supports an
            ADHD-style profile; context-specific elevation can highlight environmental/relational
            contributors.
          </p>
        </div>
      ))}

      <h2 style={styles.reportH2}>Coaching / clinical focus suggestions</h2>
      <p style={styles.smallText}>
        • Prioritise domains with <strong>Moderate</strong> or <strong>High</strong> combined scores,
        especially in FOC/HYP/IMP/ORG/DIM plus emotional patterns (ANG, INWF, BURN).
      </p>
      <p style={styles.smallText}>
        • Explore discrepancies between parent and teacher ratings. High scores in only one setting
        may indicate contextual triggers, relationship dynamics or inconsistent structure.
      </p>
      <p style={styles.smallText}>
        • Use this profile as a structured starting point for further assessment or for guiding
        classroom strategies, homework routines and self-esteem support.
      </p>
    </div>
  );
};

// ==================== MAIN APP ====================

const App = () => {
  const { screen } = useAssessment();

  return (
    <div>
      {screen === 'start' && <StartScreen />}
      {screen === 'parent' && <QuestionnaireScreen type="parent" />}
      {screen === 'teacher' && <QuestionnaireScreen type="teacher" />}
      {screen === 'processing' && <ProcessingScreen />}
      {screen === 'results' && <ResultsSelectionScreen />}
      {screen === 'parent-report' && <ParentSummaryReport />}
      {screen === 'coach-report' && <CoachReport />}
    </div>
  );
};

const Root = () => (
  <AssessmentProvider>
    <App />
  </AssessmentProvider>
);

export default Root;

// ==================== INLINE STYLES ====================

const styles = {
  startScreen: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  startContainer: { maxWidth: '600px', background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' },
  logoSection: { textAlign: 'center', marginBottom: '2rem' },
  logoPlaceholder: { width: '140px', height: '40px', borderRadius: '8px', border: '1px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#6b7280', margin: '0 auto 1rem' },
  mainHeading: { fontSize: '1.75rem', color: '#1e293b', marginBottom: '0.5rem' },
  subtitle: { fontSize: '1rem', color: '#64748b' },
  infoSection: {},
  sectionHeading: { fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem' },
  infoText: { color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' },
  inputGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', boxSizing: 'border-box' },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' },
  startButton: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  questionnaireScreen: { minHeight: '100vh', background: '#f8fafc' },
  questionnaireHeader: { background: 'white', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoSmall: { fontWeight: '700', color: '#4f46e5' },
  childInfoSmall: { fontSize: '0.875rem', color: '#6b7280' },
  questionnaireContainer: { maxWidth: '900px', margin: '2rem auto', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)' },
  questionnaireTitle: {},
  questionnaireH1: { fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem' },
  raterName: { fontSize: '1rem', color: '#6b7280', marginBottom: '0.5rem' },
  progressText: { fontSize: '0.875rem', color: '#4f46e5', fontWeight: '600' },
  instructions: { background: '#eff6ff', padding: '1rem', borderRadius: '8px', margin: '1.5rem 0' },
  instructionsText: { fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' },
  scaleLegend: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: '#475569' },
  scaleItem: {},
  questionsList: { margin: '2rem 0' },
  questionItem: { padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  questionText: { flex: 1, fontSize: '0.875rem', color: '#374151' },
  questionNumber: { fontWeight: '600', color: '#6b7280', marginRight: '0.5rem' },
  answerOptions: { display: 'flex', gap: '0.5rem' },
  answerBtn: { width: '40px', height: '40px', border: '2px solid #e5e7eb', background: 'white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  answerBtnSelected: { background: '#4f46e5', color: 'white', borderColor: '#4f46e5' },
  questionnaireFooter: { marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' },
  nextButton: { padding: '1rem 2rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  nextButtonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  processingScreen: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  processingContainer: { textAlign: 'center', color: 'white' },
  spinner: { width: '60px', height: '60px', border: '4px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' },
  processingH2: { fontSize: '1.75rem', marginBottom: '0.5rem' },
  processingText: { fontSize: '1rem', opacity: 0.9 },
  resultsScreen: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  selectionContainer: { maxWidth: '900px', textAlign: 'center' },
  selectionH1: { fontSize: '2.5rem', color: 'white', marginBottom: '1rem' },
  selectionSubtitle: { fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem' },
  reportCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
  reportCard: { background: 'white', borderRadius: '16px', padding: '2rem', cursor: 'pointer', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' },
  reportIcon: { fontSize: '3rem', marginBottom: '1rem' },
  reportCardH3: { fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' },
  reportCardText: { color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' },
  viewReportBtn: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  reportPage: { backgroundColor: '#f7f7fb', padding: '24px', minHeight: '100vh' },
  backButton: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #4f46e5', color: '#4f46e5', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginBottom: '1rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)' },
  brandText: { fontSize: '12px', color: '#4b5563' },
  clientInfo: { fontSize: '11px', color: '#374151', textAlign: 'right' },
  reportH1: { fontSize: '22px', marginBottom: '8px', color: '#1e293b' },
  reportH2: { fontSize: '18px', marginTop: '16px', marginBottom: '4px', color: '#1e293b' },
  smallText: { fontSize: '13px', marginBottom: '4px', color: '#374151', lineHeight: '1.5' },
  noteText: { fontSize: '11px', color: '#6b7280', marginTop: '4px', lineHeight: '1.4' },
  patternCard: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', marginBottom: '8px', backgroundColor: '#ffffff' },
  patternTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: '#1e293b' },
  barContainer: { width: '100%', height: '8px', borderRadius: '999px', backgroundColor: '#e5e7eb', overflow: 'hidden', marginTop: '4px' },
  barFill: { height: '100%', backgroundColor: '#4f46e5', transition: 'width 0.5s ease' },
  barLabel: { fontSize: '10px', color: '#6b7280', marginTop: '2px' }
};
