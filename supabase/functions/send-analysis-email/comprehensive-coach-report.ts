export function generateComprehensiveCoachReport(
  customerName: string,
  customerEmail: string,
  franchiseOwnerName: string | undefined,
  analysis: any,
  resultsUrl: string,
  bookingUrl: string,
  siteUrl: string
): string {
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const neuralPatterns = analysis.neuralImprintPatternScores || [];
  const sortedPatterns = [...neuralPatterns].sort((a, b) => b.score - a.score);

  const highPriorityPatterns = sortedPatterns.filter(p => p.score >= 60);
  const mediumPriorityPatterns = sortedPatterns.filter(p => p.score >= 40 && p.score < 60);
  const lowPriorityPatterns = sortedPatterns.filter(p => p.score < 40);

  const getScoreClass = (score: number) => {
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  };

  const generateBarChart = () => {
    return sortedPatterns.map(pattern => `
      <div class="bar-item">
        <div class="bar-label">
          <span>${pattern.code}</span>
          <span>${pattern.score}%</span>
        </div>
        <div class="bar-container">
          <div class="bar-fill ${getScoreClass(pattern.score)}" style="width: ${pattern.score}%">
            ${pattern.score}%
          </div>
        </div>
      </div>
    `).join('');
  };

  const generatePatternDetail = (pattern: any, priority: number) => {
    return `
      <div class="pattern-detail ${getScoreClass(pattern.score)}">
        <div class="pattern-header">
          <div>
            <span class="pattern-title">${pattern.code} - ${pattern.name}</span>
            <span class="score-indicator ${getScoreClass(pattern.score)}">${getScoreLabel(pattern.score)}</span>
            <span class="badge priority-${getScoreClass(pattern.score)}">Priority ${priority}</span>
          </div>
          <span class="pattern-score ${getScoreClass(pattern.score)}">${pattern.score}%</span>
        </div>

        <div class="subsection">
          <h5>📋 Pattern Description</h5>
          <p>${pattern.description}</p>
        </div>

        <div class="subsection">
          <h5>🎯 What This Means for ${customerName}</h5>
          <p>
            This ${pattern.score >= 70 ? 'critically high' : pattern.score >= 60 ? 'high' : pattern.score >= 40 ? 'moderate' : 'low'}
            score indicates ${pattern.score >= 60 ? 'significant presence requiring attention' : pattern.score >= 40 ? 'moderate presence that should be monitored' : 'minimal presence, which is positive'}.
          </p>
        </div>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>In-Depth Coach Report - ${customerName}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { margin: 1cm; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f5f5f5;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
            }
            .cover-page {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 60px 40px;
                text-align: center;
            }
            .cover-page h1 {
                font-size: 3em;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .cover-page h2 {
                font-size: 1.8em;
                margin-bottom: 10px;
                opacity: 0.9;
            }
            .cover-page .client-info {
                margin-top: 40px;
                font-size: 1.3em;
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 10px;
                display: inline-block;
            }
            .section {
                padding: 40px;
            }
            .section-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 40px;
                margin: 0 -40px 30px -40px;
            }
            .section-header h2 {
                font-size: 2em;
                margin: 0;
            }
            h3 {
                color: #667eea;
                font-size: 1.5em;
                margin: 30px 0 15px 0;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
            }
            .client-info-box {
                background: linear-gradient(135deg, #e8f4f8 0%, #d4e6f1 100%);
                border-left: 5px solid #667eea;
                padding: 25px;
                margin-bottom: 30px;
                border-radius: 5px;
            }
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .summary-card {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 20px;
                border-radius: 10px;
                border-left: 5px solid #667eea;
            }
            .summary-card h4 {
                color: #667eea;
                margin: 0 0 10px 0;
            }
            .summary-card .number {
                font-size: 2.5em;
                font-weight: bold;
                color: #764ba2;
                margin: 10px 0;
            }
            .pattern-detail {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 25px;
                margin: 20px 0;
                border-left: 5px solid #667eea;
            }
            .pattern-detail.high {
                border-left-color: #ff6b6b;
                background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
            }
            .pattern-detail.medium {
                border-left-color: #ffa500;
                background: linear-gradient(135deg, #fffaf0 0%, #ffe4b5 100%);
            }
            .pattern-detail.low {
                border-left-color: #4a90e2;
                background: linear-gradient(135deg, #f0f8ff 0%, #e1f0ff 100%);
            }
            .pattern-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .pattern-title {
                font-size: 1.5em;
                font-weight: bold;
                color: #333;
            }
            .pattern-score {
                font-size: 2em;
                font-weight: bold;
            }
            .pattern-score.high { color: #ff6b6b; }
            .pattern-score.medium { color: #ffa500; }
            .pattern-score.low { color: #4a90e2; }
            .score-indicator {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9em;
                margin-left: 10px;
            }
            .score-indicator.high { background: #ff6b6b; color: white; }
            .score-indicator.medium { background: #ffa500; color: white; }
            .score-indicator.low { background: #4a90e2; color: white; }
            .subsection {
                margin: 20px 0;
            }
            .subsection h5 {
                color: #764ba2;
                margin-bottom: 10px;
                font-size: 1.1em;
            }
            .bar-chart {
                margin: 20px 0;
            }
            .bar-item {
                margin-bottom: 15px;
            }
            .bar-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-weight: 600;
            }
            .bar-container {
                height: 30px;
                background: #e0e0e0;
                border-radius: 15px;
                overflow: hidden;
            }
            .bar-fill {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 10px;
                color: white;
                font-weight: 600;
                border-radius: 15px;
            }
            .bar-fill.high {
                background: linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%);
            }
            .bar-fill.medium {
                background: linear-gradient(90deg, #ffa500 0%, #ff8c00 100%);
            }
            .bar-fill.low {
                background: linear-gradient(90deg, #4a90e2 0%, #357abd 100%);
            }
            .alert-box {
                background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                border: 2px solid #dc3545;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
            }
            .alert-box h4 {
                color: #721c24;
                margin-top: 0;
            }
            .recommendation-box {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                border: 2px solid #28a745;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
            }
            .recommendation-box h4 {
                color: #155724;
                margin-top: 0;
            }
            .footer {
                background: #f8f9fa;
                color: #2c3e50;
                padding: 30px 40px;
                text-align: center;
                margin-top: 40px;
                border-top: 3px solid #667eea;
            }
            .badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.85em;
                font-weight: 600;
                margin: 0 5px;
            }
            .badge.priority-high { background: #dc3545; color: white; }
            .badge.priority-medium { background: #ffc107; color: #333; }
            .badge.priority-low { background: #28a745; color: white; }
            ul, ol {
                margin-left: 30px;
                margin-bottom: 15px;
            }
            li {
                margin-bottom: 8px;
                color: #333;
            }
            p {
                margin-bottom: 15px;
                color: #333;
            }
            .legend {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 25px;
                padding-top: 25px;
                border-top: 2px solid #e0e0e0;
                flex-wrap: wrap;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .legend-color {
                width: 20px;
                height: 20px;
                border-radius: 4px;
            }
            .legend-color.high {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            }
            .legend-color.medium {
                background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
            }
            .legend-color.low {
                background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Cover Page -->
            <div class="cover-page">
                <h1>Neural Imprint Patterns™</h1>
                <h2>Comprehensive In-Depth Analysis</h2>
                <h2>Coaching Report</h2>
                <div class="client-info">
                    <p><strong>Prepared for:</strong> ${customerName}</p>
                    <p><strong>Email:</strong> ${customerEmail}</p>
                    <p><strong>Assessment Date:</strong> ${completionDate}</p>
                    ${franchiseOwnerName ? `<p><strong>Franchise Owner:</strong> ${franchiseOwnerName}</p>` : ''}
                </div>
            </div>

            <!-- Executive Summary -->
            <div class="section">
                <div class="section-header">
                    <h2>📊 Executive Summary</h2>
                </div>

                <div class="client-info-box">
                    <p><strong>Client Name:</strong> ${customerName}</p>
                    <p><strong>Assessment Completion:</strong> ${completionDate}</p>
                    <p><strong>Total Patterns Assessed:</strong> ${neuralPatterns.length}</p>
                </div>

                <!-- Scoring Chart -->
                <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; margin: 30px 0;">
                    <h3 style="margin-top: 0;">Neural Imprint Patterns - Complete Scoring Overview</h3>
                    <div class="bar-chart">
                        ${generateBarChart()}
                    </div>

                    <!-- Legend -->
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color high"></div>
                            <span><strong>High (60-100%)</strong> - Significant presence requiring immediate attention</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color medium"></div>
                            <span><strong>Medium (40-59%)</strong> - Moderate presence requiring monitoring</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color low"></div>
                            <span><strong>Low (0-39%)</strong> - Minimal presence, positive indicator</span>
                        </div>
                    </div>
                </div>

                <h3 style="margin-top: 40px;">Overall Profile Overview</h3>
                <p>
                    ${customerName}'s Neural Imprint assessment reveals an overall performance score of
                    <strong>${analysis.overallScore}%</strong>, indicating a
                    <strong>${analysis.overallScore >= 70 ? 'high intensity' : analysis.overallScore >= 40 ? 'moderate intensity' : 'balanced'} profile</strong>.
                </p>

                <div class="summary-grid">
                    <div class="summary-card">
                        <h4>High Priority Patterns</h4>
                        <div class="number">${highPriorityPatterns.length}</div>
                        <p>Patterns scoring above 60% requiring immediate attention</p>
                    </div>
                    <div class="summary-card">
                        <h4>Medium Priority</h4>
                        <div class="number">${mediumPriorityPatterns.length}</div>
                        <p>Patterns scoring 40-59% requiring monitoring</p>
                    </div>
                    <div class="summary-card">
                        <h4>Low Concern</h4>
                        <div class="number">${lowPriorityPatterns.length}</div>
                        <p>Patterns scoring below 40% showing minimal presence</p>
                    </div>
                    <div class="summary-card">
                        <h4>${sortedPatterns.length > 0 ? 'Highest Score' : 'Assessment'}</h4>
                        <div class="number">${sortedPatterns.length > 0 ? sortedPatterns[0].score + '%' : 'N/A'}</div>
                        <p>${sortedPatterns.length > 0 ? sortedPatterns[0].name + ' (' + sortedPatterns[0].code + ')' : 'No data'}</p>
                    </div>
                </div>

                ${highPriorityPatterns.length > 0 ? `
                <div class="alert-box">
                    <h4>⚠️ Critical Findings</h4>
                    <p>
                        The client presents with <strong>${highPriorityPatterns.length} high-scoring pattern${highPriorityPatterns.length > 1 ? 's' : ''}</strong>
                        that ${highPriorityPatterns.length > 1 ? 'require' : 'requires'} immediate attention and professional intervention.
                    </p>
                </div>
                ` : ''}

                <h3>Key Strengths Identified</h3>
                <ul>
                    ${lowPriorityPatterns.slice(0, 5).map(p =>
                        `<li><strong>${p.name} (${p.code}: ${p.score}%):</strong> Minimal presence, positive indicator</li>`
                    ).join('')}
                    ${lowPriorityPatterns.length === 0 ? '<li>Assessment shows areas for improvement across multiple patterns</li>' : ''}
                </ul>

                <h3>Primary Concerns</h3>
                <ul>
                    ${highPriorityPatterns.map(p =>
                        `<li><strong>${p.name} (${p.score}%):</strong> ${p.description.substring(0, 100)}...</li>`
                    ).join('')}
                    ${highPriorityPatterns.length === 0 ? '<li>No critical concerns identified</li>' : ''}
                </ul>
            </div>

            <!-- Detailed Pattern Analysis - High Priority -->
            ${highPriorityPatterns.length > 0 ? `
            <div class="section">
                <div class="section-header">
                    <h2>🔴 High Priority Patterns (60-100%)</h2>
                </div>
                ${highPriorityPatterns.map((pattern, index) => generatePatternDetail(pattern, index + 1)).join('')}
            </div>
            ` : ''}

            <!-- Medium Priority Patterns -->
            ${mediumPriorityPatterns.length > 0 ? `
            <div class="section">
                <div class="section-header">
                    <h2>🟠 Medium Priority Patterns (40-59%)</h2>
                </div>
                <p>
                    These patterns show moderate presence and should be monitored. While not immediately critical, they
                    contribute to overall stress and may become more problematic if high-priority patterns aren't addressed.
                </p>
                ${mediumPriorityPatterns.map((pattern, index) => generatePatternDetail(pattern, highPriorityPatterns.length + index + 1)).join('')}
            </div>
            ` : ''}

            <!-- Comprehensive Action Plan -->
            <div class="section">
                <div class="section-header">
                    <h2>📋 Recommended Action Plan</h2>
                </div>

                <h3>Immediate Priority Actions</h3>
                <div class="recommendation-box">
                    <h4>✅ Next Steps (Within 1-2 Weeks)</h4>
                    <ol>
                        ${analysis.recommendations.slice(0, 5).map(r => `<li>${r}</li>`).join('')}
                    </ol>
                </div>

                <h3>Important Links</h3>
                <div style="background: #fff5e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p><strong>Customer Results Link:</strong><br>
                    <a href="${resultsUrl}" style="color: #3b82f6; word-break: break-all;">${resultsUrl}</a></p>
                    ${bookingUrl !== siteUrl ? `
                    <p style="margin-top: 15px;"><strong>Booking Page:</strong><br>
                    <a href="${bookingUrl}" style="color: #3b82f6;">${bookingUrl}</a></p>
                    ` : ''}
                </div>
            </div>

            <!-- Summary & Prognosis -->
            <div class="section">
                <div class="section-header">
                    <h2>🎯 Summary & Follow-Up</h2>
                </div>

                <h3>Current Status</h3>
                <p>
                    ${customerName}'s assessment reveals ${highPriorityPatterns.length > 0 ?
                      'significant patterns requiring professional attention and intervention' :
                      'a generally balanced profile with some areas for monitoring and improvement'}.
                </p>

                <h3>Recommended Follow-Up</h3>
                <div class="recommendation-box">
                    <h4>✅ Next Steps for Coach/Franchise Owner</h4>
                    <ul>
                        <li>Review the complete assessment results with the client</li>
                        <li>Schedule follow-up consultation within 24-48 hours</li>
                        <li>Discuss recommended action plan and resources</li>
                        <li>Establish support system and check-in schedule</li>
                        <li>Monitor progress and adjust interventions as needed</li>
                    </ul>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="font-size: 1.3em; margin-bottom: 15px;">
                    <strong>This report is confidential and prepared exclusively for ${customerName}</strong>
                </p>
                <p style="margin-bottom: 10px;">
                    Neural Imprint Patterns™ Assessment & Coaching Report
                </p>
                <p style="margin-bottom: 10px;">
                    BrainWorx Professional Services
                </p>
                <p style="margin-bottom: 20px;">
                    © All copyrights belong to BrainWorx™ | All information is confidential
                </p>
                <p style="font-size: 0.9em; opacity: 0.8;">
                    This report should be reviewed in conjunction with professional therapeutic support.
                    It is not a substitute for professional medical or psychological diagnosis.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}
