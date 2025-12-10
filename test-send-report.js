// Script to send test client report email
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const testSend = async () => {
  const apiUrl = `${supabaseUrl}/functions/v1/send-client-report`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      responseId: 'f5bbb8dc-122b-4318-9ebe-889e73f4c8e2'
    })
  });

  const result = await response.json();
  console.log('Result:', result);
};

testSend();
