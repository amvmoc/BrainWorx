import React from 'react';
import { NIPP_PATTERNS, scoreToPercentage, getSeverityLabel710, getSeverityColor710 } from '../data/adhd710AssessmentQuestions';

interface PatternScore {
  code: string;
  name: string;
  category: string;
  parentScore: number;
  teacherScore: number;
  combinedScore: number;
  parentLabel: string;
  teacherLabel: string;
  combinedLabel: string;
  percentage: number;
}

interface ADHD710ParentReportProps {
  childInfo: {
    name: string;
    age: number;
  };
  parentInfo: {
    name: string;
  };
  teacherInfo: {
    name: string;
    email?: string;
  };
  patterns: PatternScore[];
  date: string;
}

export default function ADHD710ParentReport({ childInfo, parentInfo, teacherInfo, patterns, date }: ADHD710ParentReportProps) {
  const corePatterns = patterns.filter(p => p.category === 'Core ADHD');
  const emotionalPatterns = patterns.filter(p => p.category === 'Emotional/Impact');

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f7f7fb', padding: '24px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <div>
            <div style={{
              width: '140px',
              height: '40px',
              borderRadius: '8px',
              border: '1px dashed #9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              BrainWorx / NIPP Logo
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563' }}>
              <strong>BrainWorx</strong> – Neural Imprint Patterns (NIPP)<br />
              Child Focus & Behaviour Screen (7–10 years)
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#374151', textAlign: 'right' }}>
            <div>Child Name: {childInfo.name}</div>
            <div>Age: {childInfo.age}</div>
            <div>Parent: {parentInfo.name}</div>
            <div>Teacher: {teacherInfo.name}</div>
            {teacherInfo.email && <div>Teacher email: {teacherInfo.email}</div>}
            <div>Date: {date}</div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '22px', marginBottom: '8px', marginTop: '16px' }}>
          Parent Summary Report
        </h1>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          This report gives a picture of how your child's focus, homework habits, energy and emotions
          show up at home and at school. It is not a diagnosis, but a map to guide support and possible
          next steps.
        </p>

        {/* Core ADHD Patterns */}
        <h2 style={{ fontSize: '18px', marginTop: '16px', marginBottom: '4px' }}>
          Focus, homework and impulse patterns
        </h2>
        <p style={{ fontSize: '13px', marginBottom: '12px' }}>
          These patterns show how your child manages attention, organisation and self-control for
          school-age demands.
        </p>

        <div style={{ marginBottom: '24px' }}>
          {corePatterns.map((pattern) => (
            <div key={pattern.code} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                {pattern.code} – {pattern.name}
              </div>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>At home:</strong> Average {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>At school:</strong> Average {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Overall pattern:</strong> Average {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})
              </p>
              <div style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: '#e5e7eb',
                overflow: 'hidden',
                marginTop: '4px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${pattern.percentage}%`,
                  backgroundColor: '#4f46e5'
                }} />
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                {pattern.percentage}% of maximum intensity
              </div>
            </div>
          ))}
        </div>

        {/* Emotional/Impact Patterns */}
        <h2 style={{ fontSize: '18px', marginTop: '16px', marginBottom: '4px' }}>
          Emotional and impact patterns
        </h2>
        <p style={{ fontSize: '13px', marginBottom: '12px' }}>
          These patterns look at frustration, worry, resistance and how your child experiences themselves
          and other children in this stage of school.
        </p>

        <div style={{ marginBottom: '24px' }}>
          {emotionalPatterns.map((pattern) => (
            <div key={pattern.code} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                {pattern.code} – {pattern.name}
              </div>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>At home:</strong> Average {pattern.parentScore.toFixed(2)} ({pattern.parentLabel})
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>At school:</strong> Average {pattern.teacherScore.toFixed(2)} ({pattern.teacherLabel})
              </p>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Overall pattern:</strong> Average {pattern.combinedScore.toFixed(2)} ({pattern.combinedLabel})
              </p>
              <div style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: '#e5e7eb',
                overflow: 'hidden',
                marginTop: '4px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${pattern.percentage}%`,
                  backgroundColor: '#4f46e5'
                }} />
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                {pattern.percentage}% of maximum intensity
              </div>
            </div>
          ))}
        </div>

        {/* How to Use This Report */}
        <h2 style={{ fontSize: '18px', marginTop: '24px', marginBottom: '8px' }}>
          How to use this as a parent
        </h2>

        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
          <strong>•</strong> Patterns in the <strong>Moderate</strong> or <strong>High</strong> range are good places
          to start working with your coach or a professional on practical support at home and school.
        </p>
        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
          <strong>•</strong> A higher score does not mean your child is "lazy" or "naughty". It usually shows where
          their brain needs more structure, routines and understanding.
        </p>
        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
          <strong>•</strong> This report cannot diagnose ADHD. If you are concerned, please discuss these results with
          a paediatrician, psychologist or other qualified health professional.
        </p>
      </div>
    </div>
  );
}
