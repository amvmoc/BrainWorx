// Simple PDF generation using jsPDF
import { jsPDF } from "npm:jspdf@2.5.2";

export function generatePDFFromHTML(html: string, filename: string): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Remove HTML tags and extract text content
  const textContent = html
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Add title
  doc.setFontSize(16);
  doc.text('BrainWorx Neural Imprint Patterns Report', 20, 20);
  
  // Add content with word wrap
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(textContent, 170);
  doc.text(lines, 20, 35);

  // Convert to buffer
  const pdfBuffer = doc.output('arraybuffer');
  return Buffer.from(pdfBuffer);
}

export async function generateAdvancedPDF(
  customerName: string,
  analysis: any,
  completionDate: string
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPos = 20;

  // Header
  doc.setFillColor(10, 42, 94); // Navy blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('BrainWorx', 20, 20);
  
  doc.setFontSize(14);
  doc.text('Neural Imprint Patterns Report', 20, 30);

  yPos = 55;
  doc.setTextColor(0, 0, 0);
  
  // Client Info
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Report for: ${customerName}`, 20, yPos);
  yPos += 7;
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Completion Date: ${completionDate}`, 20, yPos);
  yPos += 15;

  // Neural Patterns Section
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Neural Imprint Pattern Scores', 20, yPos);
  yPos += 10;

  const patterns = analysis.neuralImprintPatternScores || [];
  const sortedPatterns = [...patterns].sort((a: any, b: any) => b.score - a.score);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  sortedPatterns.slice(0, 10).forEach((pattern: any) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    // Pattern code and score
    doc.text(`${pattern.code}: ${pattern.score}%`, 25, yPos);
    
    // Draw bar
    const barWidth = (pattern.score / 100) * 150;
    let barColor: [number, number, number] = [200, 200, 200];
    if (pattern.score >= 60) barColor = [220, 53, 69]; // Red for high
    else if (pattern.score >= 40) barColor = [255, 193, 7]; // Yellow for medium
    else barColor = [40, 167, 69]; // Green for low

    doc.setFillColor(...barColor);
    doc.rect(25, yPos + 2, barWidth, 4, 'F');
    
    yPos += 10;
  });

  yPos += 10;

  // Key Insights
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Key Insights', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  if (analysis.strengths && analysis.strengths.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Strengths:', 25, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');

    analysis.strengths.slice(0, 5).forEach((strength: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const lines = doc.splitTextToSize(`• ${strength}`, 165);
      doc.text(lines, 30, yPos);
      yPos += 5 * lines.length + 2;
    });
    yPos += 5;
  }

  if (analysis.areasForGrowth && analysis.areasForGrowth.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont(undefined, 'bold');
    doc.text('Areas for Growth:', 25, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');

    analysis.areasForGrowth.slice(0, 5).forEach((area: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const lines = doc.splitTextToSize(`• ${area}`, 165);
      doc.text(lines, 30, yPos);
      yPos += 5 * lines.length + 2;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'BrainWorx • www.brainworx.co.za • info@brainworx.co.za',
      105,
      290,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
  }

  const pdfBuffer = doc.output('arraybuffer');
  return Buffer.from(pdfBuffer);
}
