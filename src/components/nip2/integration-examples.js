// ============================================================================
// INTEGRATION EXAMPLE
// How to use the NIPAssessment component in your React application
// ============================================================================

// Method 1: Direct Import (Recommended for Bolt.new)
// ----------------------------------------------------
// Step 1: Place questions-data.json in src/data/
// Step 2: Add this to your App.jsx:

import React from 'react';
import NIPAssessment from './NIPAssessment'; // Adjust path as needed
import questionsData from './data/questions-data.json';

function App() {
  return (
    <div className="App">
      <NIPAssessment questionsData={questionsData} />
    </div>
  );
}

export default App;

// ============================================================================

// Method 2: Standalone Usage
// ----------------------------------------------------
// If NIPAssessment is your main app, just ensure questions load correctly.
// The component handles everything internally.

// In NIPAssessment.jsx, update the useState line:
// const [questions, setQuestions] = useState(questionsData);

// And add the import at the top:
// import questionsData from './data/questions-data.json';

// ============================================================================

// Method 3: Fetch from API
// ----------------------------------------------------
// If questions come from a backend API:

import React, { useState, useEffect } from 'react';
import NIPAssessment from './NIPAssessment';

function App() {
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/nip-questions')
      .then(res => res.json())
      .then(data => {
        setQuestionsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading assessment...</div>
    </div>;
  }

  if (!questionsData) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-600">Failed to load questions</div>
    </div>;
  }

  return <NIPAssessment questionsData={questionsData} />;
}

export default App;

// ============================================================================

// Method 4: With User Authentication
// ----------------------------------------------------
// Wrap with authentication logic:

import React, { useState } from 'react';
import NIPAssessment from './NIPAssessment';
import LoginPage from './LoginPage';
import questionsData from './data/questions-data.json';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <h1>Welcome, {user.name}</h1>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      </header>
      <NIPAssessment questionsData={questionsData} userId={user.id} />
    </div>
  );
}

export default App;

// ============================================================================

// Method 5: With Data Persistence
// ----------------------------------------------------
// Save and load assessment progress:

import React, { useState, useEffect } from 'react';
import NIPAssessment from './NIPAssessment';
import questionsData from './data/questions-data.json';

function App() {
  const [savedAnswers, setSavedAnswers] = useState(null);

  useEffect(() => {
    // Load saved progress from localStorage
    const saved = localStorage.getItem('nip-assessment-progress');
    if (saved) {
      setSavedAnswers(JSON.parse(saved));
    }
  }, []);

  const handleSaveProgress = (answers) => {
    localStorage.setItem('nip-assessment-progress', JSON.stringify(answers));
  };

  const handleComplete = (results) => {
    // Save results to your backend
    fetch('/api/save-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    });
    
    // Clear saved progress
    localStorage.removeItem('nip-assessment-progress');
  };

  return (
    <NIPAssessment 
      questionsData={questionsData}
      initialAnswers={savedAnswers}
      onSaveProgress={handleSaveProgress}
      onComplete={handleComplete}
    />
  );
}

export default App;

// ============================================================================

// Customization Examples
// ============================================================================

// 1. Custom Branding
// -------------------
// In NIPAssessment.jsx, find and replace:
// - "BrainWorx™" → "Your Company Name"
// - <Brain /> → <YourLogo />
// - Modify gradient colors in className strings

// 2. Custom Styling
// ------------------
// Add custom Tailwind classes or CSS:
const customTheme = {
  primary: 'from-your-color-600 to-your-color-700',
  secondary: 'from-another-600 to-another-700',
};

// Then in component: className={`bg-gradient-to-r ${customTheme.primary}`}

// 3. Add Analytics
// -----------------
// Track user progress:
const trackEvent = (eventName, data) => {
  // Your analytics service
  analytics.track(eventName, data);
};

// In NIPAssessment, add:
// trackEvent('assessment_started', { timestamp: new Date() });
// trackEvent('question_answered', { questionId, answer });
// trackEvent('assessment_completed', { results });

// 4. Email Reports
// -----------------
const sendEmailReport = async (email, reportData) => {
  await fetch('/api/send-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, reportData })
  });
};

// 5. PDF Generation
// ------------------
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = async () => {
  const report = document.getElementById('coach-report');
  const canvas = await html2canvas(report);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  pdf.save('nip-assessment-report.pdf');
};

// ============================================================================

// Troubleshooting
// ============================================================================

// Issue: Questions not loading
// Solution:
// 1. Check import path: import questionsData from './data/questions-data.json';
// 2. Verify file exists in correct location
// 3. Check for JSON syntax errors in questions-data.json

// Issue: Charts not rendering
// Solution:
// 1. Ensure Recharts is installed: npm install recharts
// 2. Check ResponsiveContainer parent has height
// 3. Verify data structure matches chart requirements

// Issue: Styles not applying
// Solution:
// 1. Verify Tailwind CSS is configured
// 2. Check tailwind.config.js content paths
// 3. Ensure index.css has Tailwind directives

// Issue: Icons not showing
// Solution:
// 1. Install lucide-react: npm install lucide-react
// 2. Check imports at top of file
// 3. Verify icon names are correct

// ============================================================================

// Best Practices
// ============================================================================

// 1. Error Boundaries
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <NIPAssessment questionsData={questionsData} />
    </ErrorBoundary>
  );
}

// 2. Loading States
const [loading, setLoading] = useState(true);

// Show skeleton or spinner while loading
if (loading) return <LoadingSpinner />;

// 3. Responsive Design
// Component is already responsive, but test on:
// - Desktop (1920x1080, 1366x768)
// - Tablet (768x1024)
// - Mobile (375x667, 414x896)

// 4. Performance
// - Use React.memo for child components
// - Lazy load heavy components
// - Optimize chart rendering
// - Debounce user interactions

// 5. Accessibility
// - Add ARIA labels
// - Ensure keyboard navigation
// - Test with screen readers
// - Maintain color contrast ratios

// ============================================================================

// That's it! You're ready to integrate the NIP Assessment into your application.
// For more details, see README.md and QUICKSTART.md

// ============================================================================
