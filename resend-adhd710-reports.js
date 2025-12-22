const assessmentIds = [
  'c1472140-73cf-4a5c-9d3a-c632c6b4efd1', // rub, age 8
  'd9b79bf6-a567-4896-83be-7d144e20cf81', // Peter, age 7
  '671c9068-9abc-4fa4-b2a7-10fe0947b2b6', // rub, age 8
  'f223d55a-b160-4cfe-b65e-f075c612c6a9'  // div, age 7
];

const SUPABASE_URL = 'https://zclsxlillnlxdwnrkwia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbHN4bGlsbG5seGR3bnJrd2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODkxNDQsImV4cCI6MjA3NzM2NTE0NH0.yg2eMEBy7XjFlCEUBcFAH8C6KtFRGiHlD0InPXCfJeM';

async function sendReports() {
  console.log('Starting to send reports for', assessmentIds.length, 'assessments...\n');

  for (const assessmentId of assessmentIds) {
    try {
      console.log(`Sending reports for assessment: ${assessmentId}...`);

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/send-adhd710-reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ assessmentId }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`✓ Success! Sent ${result.emailsSent} emails for assessment ${assessmentId}`);
      } else {
        console.error(`✗ Error for ${assessmentId}:`, result.error);
      }
    } catch (error) {
      console.error(`✗ Failed to send reports for ${assessmentId}:`, error.message);
    }
    console.log('');
  }

  console.log('Finished sending all reports!');
}

sendReports();
