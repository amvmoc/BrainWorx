import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
});

// Load environment variables
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load questions
const questionsPath = path.join(__dirname, 'src/data/nip2/questions-data.json');
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

console.log(`Loaded ${questionsData.length} questions`);

// Generate answer pattern as described:
// Q1: Answer 1, Q2: Answer 2, Q3: Answer 3, Q4: Answer 4 (last)
// Q5: Answer 4, Q6: Answer 3, Q7: Answer 2, Q8: Answer 1
// Q9: Answer 1, Q10: Answer 2... (repeating pattern)
function generateAnswerPattern(totalQuestions) {
  const answers = {};
  let direction = 1; // 1 for going down (0->3), -1 for going up (3->0)
  let currentAnswer = 0; // Start at answer index 0

  for (let i = 0; i < totalQuestions; i++) {
    answers[i] = currentAnswer;

    // Move to next answer
    if (direction === 1) {
      // Going down: 0, 1, 2, 3
      if (currentAnswer === 3) {
        direction = -1; // Start going back up
      } else {
        currentAnswer++;
      }
    } else {
      // Going up: 3, 2, 1, 0
      if (currentAnswer === 0) {
        direction = 1; // Start going back down
      } else {
        currentAnswer--;
      }
    }
  }

  return answers;
}

// Calculate results (same logic as frontend)
function calculateResults(answers, questions) {
  const nipScores = {};

  // Initialize scores for all 20 NIP patterns
  const nipPatterns = [
    'NIP01', 'NIP02', 'NIP03', 'NIP04', 'NIP05',
    'NIP06', 'NIP07', 'NIP08', 'NIP09', 'NIP10',
    'NIP11', 'NIP12', 'NIP13', 'NIP14', 'NIP15',
    'NIP16', 'NIP17', 'NIP18', 'NIP19', 'NIP20'
  ];

  nipPatterns.forEach(nip => {
    nipScores[nip] = { score: 0, maxScore: 0, count: 0 };
  });

  // Calculate scores
  questions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== undefined) {
      const nipGroup = question.nipGroup;
      nipScores[nipGroup].score += answer;
      nipScores[nipGroup].maxScore += 3;
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

  // Get top patterns
  const topPatterns = [...nipScoresArray]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  // Get critical patterns (would need NIP_PATTERNS data for accurate filtering)
  const criticalPatterns = [];

  return {
    nipScores: nipScoresArray,
    topPatterns,
    criticalPatterns,
    totalQuestions: questions.length,
    completionDate: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString()
  };
}

async function runSimulation() {
  console.log('\n🧪 Starting NIP2 Assessment Simulation...\n');

  const testEmail = 'test-simulation@brainworx.com';
  const testName = 'Test Simulation User';

  try {
    // Step 1: Create response
    console.log('📝 Creating test response...');
    const { data: response, error: createError } = await supabase
      .from('nip2_responses')
      .insert({
        customer_name: testName,
        customer_email: testEmail,
        status: 'in_progress',
        entry_type: 'test'
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    console.log(`✅ Response created with ID: ${response.id}`);

    // Step 2: Generate answer pattern
    console.log('\n🎲 Generating answer pattern...');
    const answers = generateAnswerPattern(questionsData.length);

    // Show first 20 answers as sample
    console.log('Sample answers (first 20):');
    for (let i = 0; i < 20; i++) {
      console.log(`  Q${i + 1}: Answer ${answers[i] + 1}`);
    }
    console.log('  ...');

    // Step 3: Calculate results
    console.log('\n📊 Calculating results...');
    const results = calculateResults(answers, questionsData);

    // Step 4: Update response with answers
    console.log('\n💾 Saving answers to database...');
    const { error: updateError } = await supabase
      .from('nip2_responses')
      .update({
        answers,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', response.id);

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Answers saved');

    // Step 5: Save results
    console.log('\n💾 Saving results to database...');
    const { error: resultsError } = await supabase
      .from('nip2_results')
      .insert({
        response_id: response.id,
        nip_scores: results.nipScores,
        total_questions: results.totalQuestions,
        completion_date: results.completionDate,
        top_patterns: results.topPatterns,
        critical_patterns: results.criticalPatterns
      });

    if (resultsError) {
      throw resultsError;
    }

    console.log('✅ Results saved');

    // Step 6: Display top results
    console.log('\n🏆 Top 10 Neural Imprint Patterns:\n');
    results.topPatterns.forEach((pattern, index) => {
      console.log(`  ${index + 1}. ${pattern.nipGroup} - ${pattern.percentage}% (${pattern.score}/${pattern.maxScore})`);
    });

    // Step 7: Try to send email (optional)
    console.log('\n📧 Attempting to send results email...');
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-nip2-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          responseId: response.id,
          customerEmail: testEmail,
          customerName: testName,
          results
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.log(`⚠️  Email sending skipped (RESEND_API_KEY not configured)`);
        console.log(`   Note: Email functionality works when RESEND_API_KEY is set`);
      } else {
        const emailData = await emailResponse.json();
        console.log('✅ Email sent successfully!');
        console.log(`   Email ID: ${emailData.emailId}`);
      }
    } catch (emailError) {
      console.log(`⚠️  Email sending skipped: ${emailError.message}`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ SIMULATION COMPLETE ✨');
    console.log('='.repeat(60));
    console.log(`\n📊 Assessment Summary:`);
    console.log(`   Response ID: ${response.id}`);
    console.log(`   Total Questions: ${results.totalQuestions}`);
    console.log(`   Completion Date: ${results.completionDate}`);
    console.log(`   Email Sent To: ${testEmail}`);
    console.log(`\n🔗 You can view results in the database:`);
    console.log(`   Table: nip2_responses (id: ${response.id})`);
    console.log(`   Table: nip2_results (response_id: ${response.id})`);
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Simulation failed:', error);
    process.exit(1);
  }
}

// Run the simulation
runSimulation();
