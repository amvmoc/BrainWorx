const https = require('https');
const fs = require('fs');

// Read the analysis results
const analysis = JSON.parse(fs.readFileSync('./nip3-analysis-result.json', 'utf8'));

// Generate complete NIP3 Coach Report HTML
function generateNIP3CoachReportHTML(results, completionDate, customerName) {
  const NIP_PATTERNS = {
    'NIP01': { code: 'ED', name: 'Emotional Deprivation', color: '#FFB800', category: 'Environmental', impact: 'High' },
    'NIP02': { code: 'AB', name: 'Abandonment/Instability', color: '#FF6B6B', category: 'Trauma', impact: 'Critical' },
    'NIP03': { code: 'MA', name: 'Mistrust/Abuse', color: '#DAA520', category: 'Executive Function', impact: 'High' },
    'NIP04': { code: 'SI', name: 'Social Isolation/Alienation', color: '#90C695', category: 'Developmental', impact: 'High' },
    'NIP05': { code: 'DS', name: 'Defectiveness/Shame', color: '#B0B0E0', category: 'Arousal', impact: 'High' },
    'NIP06': { code: 'FA', name: 'Failure', color: '#87CEEB', category: 'Cognitive', impact: 'Medium' },
    'NIP07': { code: 'DI', name: 'Dependence/Incompetence', color: '#FFD700', category: 'Impulse Control', impact: 'Medium' },
    'NIP08': { code: 'VH', name: 'Vulnerability to Harm or Illness', color: '#FFB6C1', category: 'Emotional', impact: 'Critical' },
    'NIP09': { code: 'EM', name: 'Enmeshment/Undeveloped Self', color: '#4A90E2', category: 'Mental Health', impact: 'Critical' },
    'NIP10': { code: 'SB', name: 'Subjugation', color: '#DC143C', category: 'Emotional', impact: 'High' },
    'NIP11': { code: 'SS', name: 'Self-Sacrifice', color: '#2C3E50', category: 'Locus of Control', impact: 'High' },
    'NIP12': { code: 'EI', name: 'Emotional Inhibition', color: '#9370DB', category: 'Behavioral', impact: 'Medium' },
    'NIP13': { code: 'US', name: 'Unrelenting Standards/Hypercriticalness', color: '#696969', category: 'Scarcity Mindset', impact: 'Medium' },
    'NIP14': { code: 'ET', name: 'Entitlement/Grandiosity', color: '#B0C4DE', category: 'Attention', impact: 'Medium' },
    'NIP15': { code: 'IS', name: 'Insufficient Self-Control/Self-Discipline', color: '#CD5C5C', category: 'Attention', impact: 'High' },
    'NIP16': { code: 'AS', name: 'Approval-Seeking/Recognition-Seeking', color: '#9ACD32', category: 'Attitude', impact: 'Medium' },
    'NIP17': { code: 'NP', name: 'Negativity/Pessimism', color: '#D2691E', category: 'Self-Perception', impact: 'Medium' },
    'NIP18': { code: 'PU', name: 'Punitiveness', color: '#DC143C', category: 'Addiction', impact: 'Critical' },
    'NIP19': { code: 'AS2', name: 'Approval-Seeking/Recognition-Seeking', color: '#A9A9A9', category: 'Depletion', impact: 'High' },
    'NIP20': { code: 'NP2', name: 'Negativity/Pessimism', color: '#4B0082', category: 'Interpersonal', impact: 'High' }
  };

  const getImpactStyle = (impact) => {
    if (impact === 'Critical') return 'background: #dc2626; color: white;';
    if (impact === 'High') return 'background: #ea580c; color: white;';
    return 'background: #ca8a04; color: white;';
  };

  const patternDetailsHTML = results.map((result, index) => {
    const nipInfo = NIP_PATTERNS[result.code];
    const color = nipInfo.color;

    return `
      <div style="margin: 32px 0; padding: 32px; background: #ffffff; border-left: 8px solid ${color}; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
          <div style="flex: 1;">
            <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 26px; font-weight: 700;">
              #${index + 1}. ${nipInfo.code} - ${result.name}
            </h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <span style="display: inline-block; padding: 6px 16px; background: #F3F4F6; color: #374151; border-radius: 20px; font-size: 14px; font-weight: 600;">${nipInfo.category}</span>
              <span style="display: inline-block; padding: 6px 16px; ${getImpactStyle(nipInfo.impact)} border-radius: 20px; font-size: 14px; font-weight: 600;">${nipInfo.impact} Impact</span>
              <span style="display: inline-block; padding: 6px 16px; background: #EEF2FF; color: #4F46E5; border-radius: 20px; font-size: 14px; font-weight: 600;">${result.totalQuestions} Questions</span>
            </div>
          </div>
          <div style="text-align: right; margin-left: 24px;">
            <div style="font-size: 48px; font-weight: 700; color: ${color}; line-height: 1;">${result.score}%</div>
            <div style="font-size: 15px; color: #6B7280; margin-top: 6px;">${result.actualScore}/${result.maxScore} points</div>
          </div>
        </div>

        <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">📋 Clinical Description</h4>
          <p style="margin: 0; color: #4B5563; line-height: 1.7;">This pattern represents ${result.name.toLowerCase()} characteristics that significantly influence behavior and emotional responses. Score of ${result.score}% indicates ${result.score >= 60 ? 'strong' : result.score >= 40 ? 'moderate' : 'minimal'} presence.</p>
        </div>

        <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">🔍 Typical Manifestations</h4>
          <p style="margin: 0; color: #4B5563; line-height: 1.7;">Individuals with elevated ${result.name} patterns often demonstrate specific behavioral and emotional tendencies that require clinical attention and intervention strategies.</p>
        </div>

        <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">🌱 Root Causes & Development</h4>
          <p style="margin: 0; color: #4B5563; line-height: 1.7;">This pattern typically develops through early life experiences, environmental factors, and repeated exposure to specific circumstances that reinforce these neural pathways.</p>
        </div>

        <div style="background: #DCFCE7; border-radius: 12px; padding: 20px;">
          <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #14532D;">💊 Evidence-Based Interventions</h4>
          <ul style="margin: 0; padding-left: 24px; color: #14532D; line-height: 1.8;">
            <li>Cognitive Behavioral Therapy (CBT) focusing on pattern recognition and restructuring</li>
            <li>Schema Therapy techniques to address core emotional needs</li>
            <li>Mindfulness-based interventions for increased self-awareness</li>
            <li>Experiential exercises to build healthier coping mechanisms</li>
            <li>Regular progress monitoring and adjustment of therapeutic approach</li>
          </ul>
        </div>

        <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0; color: #78350F; font-weight: 600;">
            <strong>💡 Coaching Notes:</strong> This ${result.score}% score warrants ${result.score >= 60 ? 'immediate therapeutic focus' : result.score >= 40 ? 'active monitoring and intervention' : 'awareness and preventive strategies'}. Prioritize based on client's overall profile and presenting concerns.
          </p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BrainWorx NIP3 Comprehensive Coach Report</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #F3F4F6;">
      <div style="max-width: 900px; margin: 0 auto; background: white;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; text-align: center;">
          <div style="font-size: 52px; margin-bottom: 20px;">🧠</div>
          <h1 style="margin: 0 0 16px 0; font-size: 44px; font-weight: 800;">BrainWorx™</h1>
          <div style="width: 100px; height: 4px; background: white; margin: 0 auto 28px auto; opacity: 0.9;"></div>
          <h2 style="margin: 0 0 36px 0; font-size: 30px; font-weight: 600;">Neural Imprint Patterns™</h2>
          <h3 style="margin: 0 0 32px 0; font-size: 24px; font-weight: 500; opacity: 0.95;">Comprehensive Coach Assessment Report</h3>

          <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 28px; display: inline-block; text-align: left; min-width: 320px;">
            <div style="margin-bottom: 16px;">
              <div style="font-size: 13px; opacity: 0.9; margin-bottom: 6px; letter-spacing: 1px;">CLIENT NAME</div>
              <div style="font-size: 20px; font-weight: 600;">${customerName}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 13px; opacity: 0.9; margin-bottom: 6px; letter-spacing: 1px;">ASSESSMENT DATE</div>
              <div style="font-size: 20px; font-weight: 600;">${completionDate}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 13px; opacity: 0.9; margin-bottom: 6px; letter-spacing: 1px;">QUESTIONS COMPLETED</div>
              <div style="font-size: 20px; font-weight: 600;">343</div>
            </div>
            <div>
              <div style="font-size: 13px; opacity: 0.9; margin-bottom: 6px; letter-spacing: 1px;">NIP CATEGORIES</div>
              <div style="font-size: 20px; font-weight: 600;">20</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 48px 40px;">
          <h2 style="margin: 0 0 32px 0; font-size: 36px; font-weight: 800; color: #111827; border-bottom: 5px solid #667eea; padding-bottom: 16px;">
            📊 All 20 Neural Imprint Patterns
          </h2>

          <!-- Pattern Details -->
          ${patternDetailsHTML}
        </div>

        <!-- Footer -->
        <div style="background: #111827; color: white; padding: 48px 40px; text-align: center;">
          <div style="font-size: 16px; margin-bottom: 20px; font-weight: 600;">
            CONFIDENTIAL PROFESSIONAL REPORT
          </div>
          <div style="font-size: 14px; opacity: 0.9; line-height: 1.7;">
            This document contains sensitive clinical information and is intended solely for use by qualified practitioners.
          </div>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px; opacity: 0.8;">
            © ${new Date().getFullYear()} BrainWorx™. All rights reserved.<br>
            Neural Imprint Patterns™ Assessment System<br>
            Generated: ${new Date().toLocaleString()}
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

const htmlReport = generateNIP3CoachReportHTML(
  analysis.neuralImprintPatternScores,
  'December 11, 2025',
  'Maranata Chantell Mocke'
);

// Send email using send-nip3-results function
const supabaseUrl = 'https://zclsxlillnlxdwnrkwia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbHN4bGlsbG5seGR3bnJrd2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODkxNDQsImV4cCI6MjA3NzM2NTE0NH0.yg2eMEBy7XjFlCEUBcFAH8C6KtFRGiHlD0InPXCfJeM';

const postDataObj = {
  recipients: ['kobus@brainworx.co.za'],
  results: analysis.neuralImprintPatternScores.map(nip => ({
    code: nip.code,
    shortName: nip.name,
    percentage: nip.score,
    actualScore: nip.actualScore,
    maxScore: nip.maxScore,
    totalQuestions: nip.totalQuestions,
    level: nip.score >= 70 ? 'Strongly Present' : nip.score >= 50 ? 'Moderately Present' : nip.score >= 30 ? 'Mild Pattern' : 'Minimal Pattern'
  })),
  completedAt: analysis.completedAt,
  htmlReport: htmlReport
};

console.log('Sending data:', JSON.stringify(postDataObj, null, 2).substring(0, 500) + '...');
const postData = JSON.stringify(postDataObj);

const url = new URL(`${supabaseUrl}/functions/v1/send-nip3-results`);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending NIP3 coach report to franchise holder...');

const req = https.request(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('\n✅ NIP3 coach report sent successfully to kobus@brainworx.co.za');
    } else {
      console.error('\n❌ Failed to send report');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();
