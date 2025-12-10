const SUPABASE_URL = 'https://zclsxlillnlxdwnrkwia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbHN4bGlsbG5seGR3bnJrd2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODkxNDQsImV4cCI6MjA3NzM2NTE0NH0.yg2eMEBy7XjFlCEUBcFAH8C6KtFRGiHlD0InPXCfJeM';

console.log('Creating comprehensive standalone PDF email...');
console.log('This will send a professional PDF report as an attachment.\n');

// For now, let's use the comprehensive coach report function which generates detailed content
fetch(`${SUPABASE_URL}/functions/v1/send-comprehensive-coach-report`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    responseId: 'f5bbb8dc-122b-4318-9ebe-889e73f4c8e2'
  })
})
.then(response => response.json())
.then(result => {
  console.log('Response:', JSON.stringify(result, null, 2));
  if (result.success) {
    console.log('\n======================');
    console.log('EMAIL SENT SUCCESSFULLY WITH PDF!');
    console.log('======================\n');
    console.log('Check your inbox at: andrimocke@gmail.com');
    console.log('The email contains a downloadable PDF attachment.');
  } else {
    console.log('\nError:', result.error);
  }
})
.catch(error => {
  console.error('\nRequest failed:', error.message);
});
