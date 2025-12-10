const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'payments@brainworx.co.za',
    pass: 'iuhzjjhughbnwsvf'
  }
});

const bookingLink = 'https://brainworx.co.za/book/ADMIN001';

const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your BrainWorx Assessment Results</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0A2A5E 0%, #3DB3E3 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 40px; border: 1px solid #ddd; border-top: none; }
    .section { margin-bottom: 30px; }
    h1 { margin: 0; font-size: 28px; }
    h2 { color: #0A2A5E; margin-top: 0; }
    .cta-button { display: inline-block; background: #3DB3E3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧠 BrainWorx</h1>
      <p style="font-size: 18px; margin-top: 10px;">Your Neural Imprint Patterns Assessment Results</p>
    </div>

    <div class="content">
      <div class="section">
        <h2>Dear Andri Mocke,</h2>
        <p>Thank you for completing your Neural Imprint Patterns Assessment. Your comprehensive report is ready!</p>
      </div>

      <div class="section">
        <h2>📊 Your Assessment Results</h2>
        <p>Your assessment has identified key patterns that influence your cognitive and emotional responses. The detailed report includes:</p>
        <ul>
          <li>20 Neural Imprint Pattern scores</li>
          <li>Personalized insights and analysis</li>
          <li>Strengths and areas for growth</li>
          <li>Actionable recommendations</li>
        </ul>
      </div>

      <div class="section">
        <h2>📅 Book Your Follow-Up Session</h2>
        <p>To discuss your results in detail and create a personalized action plan, we invite you to book a follow-up session with our team.</p>
        <a href="${bookingLink}" class="cta-button">Book Your Session Now</a>
        <p><small>Or copy this link: ${bookingLink}</small></p>
      </div>

      <div class="section">
        <h2>📋 Key Highlights</h2>
        <p><strong>Mind In Distress (DIS):</strong> 75% - Indicates anxiety or mood-disrupting conditions affecting daily functioning.</p>
        <p><strong>High Gear (HYP):</strong> 68% - Body and mind constantly on, struggling to relax.</p>
        <p><strong>Anchored Anger (ANG):</strong> 61% - Persistent anger, inability to let go of resentment.</p>
        <p style="margin-top: 20px;"><em>These patterns suggest areas that would benefit from professional support and targeted interventions.</em></p>
      </div>

      <div class="section">
        <h2>✨ What's Next?</h2>
        <ol>
          <li><strong>Review your full report</strong> (attached to this email)</li>
          <li><strong>Book a follow-up session</strong> using the link above</li>
          <li><strong>Prepare questions</strong> you'd like to discuss</li>
          <li><strong>Consider your goals</strong> for personal development</li>
        </ol>
      </div>

      <div class="section">
        <p><strong>Questions?</strong> Reply to this email or contact us at <a href="mailto:info@brainworx.co.za">info@brainworx.co.za</a></p>
      </div>
    </div>

    <div class="footer">
      <p><strong>BrainWorx</strong></p>
      <p>www.brainworx.co.za | info@brainworx.co.za</p>
      <p style="margin-top: 10px;">© 2024 BrainWorx. All rights reserved.</p>
      <p style="margin-top: 5px;"><small>This email contains confidential assessment results. Please handle with care.</small></p>
    </div>
  </div>
</body>
</html>
`;

async function sendEmail() {
  try {
    await transporter.sendMail({
      from: 'BrainWorx <payments@brainworx.co.za>',
      to: 'andrimocke@gmail.com',
      subject: 'Your BrainWorx Neural Imprint Patterns Assessment Results - Book Your Session',
      html: emailBody
    });
    console.log('✅ Email sent successfully to andrimocke@gmail.com');
    console.log('📧 Booking link included:', bookingLink);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendEmail();
