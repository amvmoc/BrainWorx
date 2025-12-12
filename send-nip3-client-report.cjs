const https = require('https');
const fs = require('fs');

// Read the analysis results
const analysis = JSON.parse(fs.readFileSync('./nip3-analysis-result.json', 'utf8'));

// Send email using send-nip3-results function
const supabaseUrl = 'https://zclsxlillnlxdwnrkwia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbHN4bGlsbG5seGR3bnJrd2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODkxNDQsImV4cCI6MjA3NzM2NTE0NH0.yg2eMEBy7XjFlCEUBcFAH8C6KtFRGiHlD0InPXCfJeM';

const postDataObj = {
  recipients: ['Chantellmocke14@gmail.com'],
  results: analysis.neuralImprintPatternScores.map(nip => ({
    code: nip.code,
    shortName: nip.name,
    percentage: nip.score,
    actualScore: nip.actualScore,
    maxScore: nip.maxScore,
    totalQuestions: nip.totalQuestions,
    level: nip.score >= 70 ? 'Strongly Present' : nip.score >= 50 ? 'Moderately Present' : nip.score >= 30 ? 'Mild Pattern' : 'Minimal Pattern'
  })),
  completedAt: analysis.completedAt
};

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

console.log('Sending NIP3 client report to Chantelle...');

const req = https.request(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('\n✅ NIP3 client report sent successfully to Chantellmocke14@gmail.com');
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
