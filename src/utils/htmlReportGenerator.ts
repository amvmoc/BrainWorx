interface ReportData {
  customerName: string;
  completedAt: Date;
  questionCount: number;
  overallScore: number;
  categoryScores: Array<{
    category: string;
    score: number;
    severity: string;
    description: string;
  }>;
  topPatterns: Array<{
    pattern: string;
    score: number;
    description: string;
  }>;
  interpretation: string;
}

export function generateStandaloneHTML(reportData: ReportData): string {
  const {
    customerName,
    completedAt,
    questionCount,
    overallScore,
    categoryScores,
    topPatterns,
    interpretation,
  } = reportData;

  const formattedDate = completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrainWorx Assessment Results - ${customerName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #E6E9EF 0%, #ffffff 100%);
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(10, 42, 94, 0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #0A2A5E 0%, #3DB3E3 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .header .subtitle {
      font-size: 18px;
      opacity: 0.9;
    }

    .content {
      padding: 40px;
    }

    .info-box {
      background: linear-gradient(135deg, #E6E9EF 0%, #f8f9fa 100%);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      border-left: 4px solid #3DB3E3;
    }

    .info-box h2 {
      color: #0A2A5E;
      font-size: 20px;
      margin-bottom: 12px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-label {
      font-weight: 600;
      color: #0A2A5E;
    }

    .score-hero {
      background: linear-gradient(135deg, #3DB3E3 0%, #1FAFA3 100%);
      color: white;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      margin-bottom: 32px;
      box-shadow: 0 8px 24px rgba(61, 179, 227, 0.3);
    }

    .score-hero h2 {
      font-size: 24px;
      margin-bottom: 16px;
      opacity: 0.95;
    }

    .score-value {
      font-size: 72px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 12px;
    }

    .score-interpretation {
      font-size: 20px;
      opacity: 0.9;
      margin-top: 8px;
    }

    .section {
      margin-bottom: 48px;
    }

    .section-title {
      color: #0A2A5E;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 3px solid #3DB3E3;
    }

    .category-grid {
      display: grid;
      gap: 20px;
      margin-bottom: 24px;
    }

    .category-card {
      background: white;
      border: 2px solid #E6E9EF;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      border-color: #3DB3E3;
      box-shadow: 0 4px 16px rgba(61, 179, 227, 0.15);
      transform: translateY(-2px);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .category-name {
      font-size: 20px;
      font-weight: 600;
      color: #0A2A5E;
    }

    .category-score {
      font-size: 24px;
      font-weight: 700;
      color: #3DB3E3;
    }

    .severity-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .severity-high {
      background: #fee;
      color: #c33;
    }

    .severity-moderate {
      background: #ffeaa7;
      color: #d63031;
    }

    .severity-low {
      background: #dfe6e9;
      color: #636e72;
    }

    .category-description {
      color: #666;
      line-height: 1.6;
    }

    .progress-bar {
      height: 12px;
      background: #E6E9EF;
      border-radius: 6px;
      overflow: hidden;
      margin-top: 12px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3DB3E3 0%, #1FAFA3 100%);
      border-radius: 6px;
      transition: width 0.5s ease;
    }

    .patterns-grid {
      display: grid;
      gap: 16px;
    }

    .pattern-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #E6E9EF 100%);
      border-left: 4px solid #3DB3E3;
      padding: 20px;
      border-radius: 8px;
    }

    .pattern-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .pattern-name {
      font-size: 18px;
      font-weight: 600;
      color: #0A2A5E;
    }

    .pattern-score {
      font-size: 20px;
      font-weight: 700;
      color: #3DB3E3;
    }

    .pattern-description {
      color: #666;
      font-size: 15px;
      line-height: 1.6;
    }

    .interpretation-box {
      background: linear-gradient(135deg, #E6E9EF 0%, #ffffff 100%);
      border: 2px solid #3DB3E3;
      border-radius: 12px;
      padding: 32px;
      margin-top: 24px;
    }

    .interpretation-box h3 {
      color: #0A2A5E;
      font-size: 22px;
      margin-bottom: 16px;
    }

    .interpretation-box p {
      color: #444;
      line-height: 1.8;
      font-size: 16px;
    }

    .footer {
      background: #0A2A5E;
      color: white;
      padding: 32px 40px;
      text-align: center;
    }

    .footer-logo {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .footer-text {
      color: #E6E9EF;
      font-size: 14px;
      margin-top: 8px;
    }

    .disclaimer {
      background: #fff9e6;
      border-left: 4px solid #f39c12;
      padding: 20px;
      border-radius: 8px;
      margin-top: 32px;
    }

    .disclaimer h4 {
      color: #e67e22;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .disclaimer p {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
      }

      .category-card:hover {
        transform: none;
      }
    }

    @media (max-width: 768px) {
      .content {
        padding: 24px;
      }

      .header {
        padding: 24px;
      }

      .header h1 {
        font-size: 28px;
      }

      .score-value {
        font-size: 56px;
      }

      .section-title {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BrainWorx Assessment Results</h1>
      <p class="subtitle">Neural Imprint Pattern Analysis Report</p>
    </div>

    <div class="content">
      <div class="info-box">
        <h2>Assessment Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Participant:</span>
            <span>${customerName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date:</span>
            <span>${formattedDate}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Questions:</span>
            <span>${questionCount}</span>
          </div>
        </div>
      </div>

      <div class="score-hero">
        <h2>Overall Profile Score</h2>
        <div class="score-value">${overallScore}%</div>
        <div class="score-interpretation">
          ${
            overallScore >= 70
              ? 'High Intensity Profile'
              : overallScore >= 40
              ? 'Moderate Intensity Profile'
              : 'Balanced Profile'
          }
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Neural Imprint Categories</h2>
        <div class="category-grid">
          ${categoryScores
            .map(
              (category) => `
            <div class="category-card">
              <div class="category-header">
                <span class="category-name">${category.category}</span>
                <span class="category-score">${category.score}%</span>
              </div>
              <span class="severity-badge severity-${category.severity.toLowerCase()}">${
                category.severity
              } Severity</span>
              <p class="category-description">${category.description}</p>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${category.score}%"></div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Top Neural Imprint Patterns</h2>
        <div class="patterns-grid">
          ${topPatterns
            .map(
              (pattern) => `
            <div class="pattern-card">
              <div class="pattern-header">
                <span class="pattern-name">${pattern.pattern}</span>
                <span class="pattern-score">${pattern.score}%</span>
              </div>
              <p class="pattern-description">${pattern.description}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="interpretation-box">
        <h3>Clinical Interpretation</h3>
        <p>${interpretation}</p>
      </div>

      <div class="disclaimer">
        <h4>Important Disclaimer</h4>
        <p>
          This assessment is for informational and coaching purposes only. It is not a diagnostic tool
          and should not be used as a substitute for professional medical or psychological advice, diagnosis,
          or treatment. Always seek the advice of your physician or other qualified health provider with any
          questions you may have regarding a medical or psychological condition.
        </p>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">BrainWorx</div>
      <p class="footer-text">Transform Your Mind, Reach The World</p>
      <p class="footer-text" style="margin-top: 16px;">&copy; 2025 BrainWorx. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadHTMLReport(reportData: ReportData, filename?: string): void {
  const html = generateStandaloneHTML(reportData);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `BrainWorx-Assessment-${reportData.customerName.replace(/\s+/g, '-')}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
