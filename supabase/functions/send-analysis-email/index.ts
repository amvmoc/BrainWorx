import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createTransport } from "npm:nodemailer@6.9.7";
import { generateComprehensiveCoachReport } from "./comprehensive-coach-report.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  customerName: string;
  customerEmail: string;
  franchiseOwnerEmail?: string;
  franchiseOwnerName?: string;
  responseId: string;
  analysis: {
    overallScore: number;
    categoryScores: Record<string, number>;
    strengths: string[];
    areasForGrowth: string[];
    recommendations: string[];
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    let customerName: string, customerEmail: string, franchiseOwnerEmail: string | undefined, franchiseOwnerName: string | undefined, responseId: string, analysis: any;

    // If only responseId is provided, fetch the data from the database
    if (body.responseId && !body.analysis) {
      const { createClient } = await import('npm:@supabase/supabase-js@2.39.0');
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: response, error } = await supabase
        .from('responses')
        .select('customer_name, customer_email, analysis_results, franchise_owner_id')
        .eq('id', body.responseId)
        .single();

      if (error || !response) {
        throw new Error('Response not found');
      }

      customerName = response.customer_name;
      customerEmail = response.customer_email;
      responseId = body.responseId;
      analysis = response.analysis_results;

      // Fetch franchise owner info if exists
      if (response.franchise_owner_id) {
        const { data: franchiseOwner } = await supabase
          .from('franchise_owners')
          .select('email, name')
          .eq('id', response.franchise_owner_id)
          .single();

        if (franchiseOwner) {
          franchiseOwnerEmail = franchiseOwner.email;
          franchiseOwnerName = franchiseOwner.name;
        }
      }
    } else {
      // Use provided data
      ({ customerName, customerEmail, franchiseOwnerEmail, franchiseOwnerName, responseId, analysis } = body);
    }

    const BRAINWORX_EMAIL = 'info@brainworx.co.za';
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://brainworx.co.za';

    // Create or reuse Supabase client
    const { createClient } = await import('npm:@supabase/supabase-js@2.39.0');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: response } = await supabase
      .from('responses')
      .select('share_token, franchise_owner_id')
      .eq('id', responseId)
      .single();

    let franchiseCode = '';
    if (response?.franchise_owner_id) {
      const { data: franchiseOwner } = await supabase
        .from('franchise_owners')
        .select('unique_link_code')
        .eq('id', response.franchise_owner_id)
        .single();

      franchiseCode = franchiseOwner?.unique_link_code || '';
    }

    const resultsUrl = `${SITE_URL}/results/${response?.share_token}`;
    const bookingUrl = franchiseCode ? `${SITE_URL}/book/${franchiseCode}` : `${SITE_URL}`;

    const customerEmailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3DB3E3, #1FAFA3); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 10px; }
          .score { font-size: 48px; font-weight: bold; color: #3DB3E3; text-align: center; margin: 20px 0; }
          .section { margin: 20px 0; }
          .section h3 { color: #0A2A5E; border-bottom: 2px solid #3DB3E3; padding-bottom: 10px; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BrainWorx Assessment Results</h1>
            <p>Your Comprehensive Analysis Report</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for completing the BrainWorx Comprehensive Assessment. Your results have been analyzed and are ready for review.</p>
            
            <div class="score">${analysis.overallScore}%</div>
            <p style="text-align: center; color: #666;">Overall Performance Score</p>
            
            <div class="section">
              <h3>Your Top Strengths</h3>
              <ul>
                ${analysis.strengths.map(s => `<li>✓ ${s}</li>`).join('')}
              </ul>
            </div>
            
            <div class="section">
              <h3>Growth Opportunities</h3>
              <ul>
                ${analysis.areasForGrowth.map(a => `<li>→ ${a}</li>`).join('')}
              </ul>
            </div>
            
            <div class="section">
              <h3>Personalized Recommendations</h3>
              <ul>
                ${analysis.recommendations.map(r => `<li>• ${r}</li>`).join('')}
              </ul>
            </div>
            
            <p style="margin-top: 30px; padding: 20px; background: #E6E9EF; border-radius: 10px;">
              <strong>Next Steps:</strong> Review your full results and book a consultation to discuss personalized program options.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resultsUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3DB3E3, #1FAFA3); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                View Full Results
              </a>
              ${bookingUrl !== SITE_URL ? `
              <a href="${bookingUrl}" style="display: inline-block; padding: 15px 30px; background: #0A2A5E; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                Book Consultation
              </a>
              ` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 BrainWorx. All rights reserved.</p>
            <p>Transform Your Mind, Reach The World</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const franchiseEmailBody = generateComprehensiveCoachReport(
      customerName,
      customerEmail,
      franchiseOwnerName,
      analysis,
      resultsUrl,
      bookingUrl,
      SITE_URL
    );

    const GMAIL_USER = "payments@brainworx.co.za";
    const GMAIL_PASSWORD = "iuhzjjhughbnwsvf";

    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    const emailResults = {
      customer: { sent: false, error: null as string | null },
      franchiseOwner: { sent: false, error: null as string | null },
      brainworx: { sent: false, error: null as string | null }
    };

    try {
      await transporter.sendMail({
        from: `BrainWorx <${GMAIL_USER}>`,
        to: customerEmail,
        subject: "Your BrainWorx Assessment Results",
        html: customerEmailBody,
      });

      emailResults.customer.sent = true;
      console.log('✓ Customer email sent to:', customerEmail);
    } catch (error) {
      emailResults.customer.error = error.message;
      console.error('✗ Error sending customer email:', error);
    }

    if (franchiseOwnerEmail) {
      try {
        await transporter.sendMail({
          from: `BrainWorx <${GMAIL_USER}>`,
          to: franchiseOwnerEmail,
          subject: `NIP Assessment Report - ${customerName} - Comprehensive Coach Analysis`,
          html: franchiseEmailBody,
        });

        emailResults.franchiseOwner.sent = true;
        console.log('✓ Franchise owner email sent to:', franchiseOwnerEmail);
      } catch (error) {
        emailResults.franchiseOwner.error = error.message;
        console.error('✗ Error sending franchise owner email:', error);
      }
    }

    try {
      await transporter.sendMail({
        from: `BrainWorx <${GMAIL_USER}>`,
        to: BRAINWORX_EMAIL,
        subject: `NIP Assessment Report - ${customerName} - Comprehensive Coach Analysis`,
        html: franchiseEmailBody,
      });

      emailResults.brainworx.sent = true;
      console.log('✓ Admin email sent to:', BRAINWORX_EMAIL);
    } catch (error) {
      emailResults.brainworx.error = error.message;
      console.error('✗ Error sending admin email:', error);
    }

    try {
      await transporter.sendMail({
        from: `BrainWorx <${GMAIL_USER}>`,
        to: 'kobus@brainworx.co.za',
        subject: `NIP Assessment Report - ${customerName} - Comprehensive Coach Analysis`,
        html: franchiseEmailBody,
      });

      console.log('✓ Kobus email sent to: kobus@brainworx.co.za');
    } catch (error) {
      console.error('✗ Error sending Kobus email:', error);
    }

    console.log('=== Email Delivery Summary ===');
    console.log('Customer:', emailResults.customer.sent ? '✓ Sent' : '✗ Failed');
    console.log('Franchise Owner:', franchiseOwnerEmail ? (emailResults.franchiseOwner.sent ? '✓ Sent' : '✗ Failed') : 'N/A');
    console.log('Admin (info@brainworx.co.za):', emailResults.brainworx.sent ? '✓ Sent' : '✗ Failed');
    console.log('Kobus (kobus@brainworx.co.za): ✓ Sent');
    console.log('Results URL:', resultsUrl);
    console.log('Booking URL:', bookingUrl);
    console.log('==============================');

    return new Response(
      JSON.stringify({
        success: emailResults.customer.sent,
        message: emailResults.customer.sent ? 'Emails sent successfully' : 'Failed to send customer email',
        emailResults,
        links: {
          resultsUrl,
          bookingUrl
        },
        analysis: {
          score: analysis.overallScore,
          strengths: analysis.strengths.length,
          areasForGrowth: analysis.areasForGrowth.length
        }
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
