// types.ts - TypeScript type definitions for the assessment

export type NIPCode = 
  | 'NIP01' | 'NIP02' | 'NIP03' | 'NIP04' | 'NIP05'
  | 'NIP06' | 'NIP07' | 'NIP08' | 'NIP09' | 'NIP10'
  | 'NIP11' | 'NIP12' | 'NIP13' | 'NIP14' | 'NIP15'
  | 'NIP16' | 'NIP17' | 'NIP18' | 'NIP19' | 'NIP20';

export type AnswerValue = 0 | 1 | 2 | 3;

export type AnswerOption = 
  | 'Not at all true of me'
  | 'A little true of me'
  | 'Often true of me'
  | 'Completely true of me';

export interface Question {
  id: number;
  text: string;
  nipCode: NIPCode;
  reverseScored: boolean;
}

export interface Answer {
  questionId: number;
  value: AnswerValue;
  option: AnswerOption;
}

export interface NIPResult {
  code: NIPCode;
  name: string;
  description: string;
  totalQuestions: number;
  actualScore: number;
  maxScore: number;
  percentage: number;
  level: 'Strongly Present' | 'Moderately Present' | 'Mild Pattern' | 'Minimal Pattern';
  recommendation: string;
}

export interface AssessmentResults {
  answers: Answer[];
  nipResults: NIPResult[];
  completedAt: Date;
  overallPercentage: number;
}

export interface NIPDefinition {
  code: NIPCode;
  name: string;
  shortName: string;
  description: string;
  characteristics: string[];
  interventions: string[];
}

export const ANSWER_OPTIONS: { label: AnswerOption; value: AnswerValue }[] = [
  { label: 'Not at all true of me', value: 0 },
  { label: 'A little true of me', value: 1 },
  { label: 'Often true of me', value: 2 },
  { label: 'Completely true of me', value: 3 },
];

export const NIP_DEFINITIONS: Record<NIPCode, NIPDefinition> = {
  NIP01: {
    code: 'NIP01',
    name: 'TRAP - Home/Work Environment',
    shortName: 'Home/Work',
    description: 'Spaces that ignore the need for conscious human growth—simply "exist" instead of evolving',
    characteristics: [
      'Lacks psychological safety',
      'Poor leadership support',
      'Limited resources for success',
      'Toxic workplace culture',
      'High turnover environment'
    ],
    interventions: [
      'Environment assessment',
      'Advocacy for change',
      'Strategic exit planning',
      'Boundary setting',
      'Support network building'
    ]
  },
  NIP02: {
    code: 'NIP02',
    name: 'SHT - Shattered Worth',
    shortName: 'Shattered Worth',
    description: 'An individual who has endured emotional damage—weakened sense of personal worth and dignity',
    characteristics: [
      'Low self-esteem',
      'External validation dependence',
      'Self-doubt and insecurity',
      'Shame-based identity',
      'Difficulty accepting love'
    ],
    interventions: [
      'Self-compassion practices',
      'Cognitive reframing',
      'Trauma-informed therapy',
      'Positive affirmations',
      'Achievement tracking'
    ]
  },
  NIP03: {
    code: 'NIP03',
    name: 'ORG - Time & Order',
    shortName: 'Time & Order',
    description: 'Persistent difficulties with planning, organizing, and managing time',
    characteristics: [
      'Chronic disorganization',
      'Missed deadlines',
      'Procrastination patterns',
      'Overwhelm with tasks',
      'Poor time estimation'
    ],
    interventions: [
      'Time management tools',
      'Organizational systems',
      'Task breakdown strategies',
      'Executive function coaching',
      'Accountability partnerships'
    ]
  },
  NIP04: {
    code: 'NIP04',
    name: 'NEGP - Unmet Needs (Parenting)',
    shortName: 'Unmet Needs',
    description: 'Parenting styles that failed to nurture healthy emotional and cognitive growth',
    characteristics: [
      'Unmet childhood needs',
      'Attachment difficulties',
      'Emotional regulation challenges',
      'Boundary confusion',
      'Relationship patterns from childhood'
    ],
    interventions: [
      'Developmental trauma work',
      'Attachment repair',
      'Reparenting practices',
      'Boundary development',
      'Corrective emotional experiences'
    ]
  },
  NIP05: {
    code: 'NIP05',
    name: 'HYP - High Gear (Hyperarousal)',
    shortName: 'High Gear',
    description: 'Body and mind that feel constantly "on"—struggle to relax, internal engine stuck in high gear',
    characteristics: [
      'Physical tension',
      'Racing thoughts',
      'Difficulty relaxing',
      'Hypervigilance',
      'Sleep difficulties'
    ],
    interventions: [
      'Somatic practices',
      'Mindfulness meditation',
      'Nervous system regulation',
      'Progressive relaxation',
      'Breathwork'
    ]
  },
  NIP06: {
    code: 'NIP06',
    name: 'DOG - Dogmatic Chains',
    shortName: 'Dogmatic',
    description: 'A way of thinking rooted in old patterns and traditions that restrict openness to new perspectives',
    characteristics: [
      'Rigid thinking',
      'Ideological inflexibility',
      'Resistance to change',
      'Black-and-white thinking',
      'Difficulty with ambiguity'
    ],
    interventions: [
      'Perspective-taking exercises',
      'Cognitive flexibility training',
      'Exposure to diverse views',
      'Critical thinking development',
      'Belief examination'
    ]
  },
  NIP07: {
    code: 'NIP07',
    name: 'IMP - Impulse Rush',
    shortName: 'Impulse',
    description: 'Pattern where person tends to "jump all out" before fully thinking through consequences',
    characteristics: [
      'Impulsive decisions',
      'Difficulty delaying gratification',
      'Risk-taking behavior',
      'Interrupting others',
      'Quick emotional reactions'
    ],
    interventions: [
      'Impulse control training',
      'Pause-and-reflect practices',
      'Consequence mapping',
      'Mindfulness techniques',
      'Decision-making frameworks'
    ]
  },
  NIP08: {
    code: 'NIP08',
    name: 'NUH - Numb Heart',
    shortName: 'Numb Heart',
    description: 'Pattern where person has learned to withhold feeling as survival strategy—emotions kept at distance',
    characteristics: [
      'Emotional numbing',
      'Difficulty expressing feelings',
      'Limited empathy',
      'Intellectualization of emotions',
      'Emotional distance in relationships'
    ],
    interventions: [
      'Emotional literacy development',
      'Feeling identification exercises',
      'Empathy training',
      'Vulnerability practice',
      'Somatic experiencing'
    ]
  },
  NIP09: {
    code: 'NIP09',
    name: 'DIS - Mind In Distress',
    shortName: 'Distress',
    description: 'Unaddressed psychological or neurological conditions—depression, anxiety, chronic stress',
    characteristics: [
      'Anxiety symptoms',
      'Depressive patterns',
      'Mood instability',
      'Panic attacks',
      'Sleep disturbances'
    ],
    interventions: [
      'Professional mental health care',
      'Medication evaluation',
      'Therapy (CBT, DBT)',
      'Lifestyle modifications',
      'Stress management'
    ]
  },
  NIP10: {
    code: 'NIP10',
    name: 'ANG - Anchored Anger',
    shortName: 'Anger',
    description: 'Persistent anger from past experiences, marked by inability to let go of resentment or grudges',
    characteristics: [
      'Chronic resentment',
      'Difficulty forgiving',
      'Anger rumination',
      'Vengeful thoughts',
      'Hostile attitude'
    ],
    interventions: [
      'Anger management',
      'Forgiveness work',
      'Trauma processing',
      'Communication skills',
      'Perspective reframing'
    ]
  },
  NIP11: {
    code: 'NIP11',
    name: 'INFL - Inside Out (Locus of Control)',
    shortName: 'Locus Control',
    description: 'Where a person perceives the source of influence over their life decisions and outcomes',
    characteristics: [
      'External locus of control',
      'Learned helplessness',
      'Victim mentality',
      'Low self-efficacy',
      'Passive approach to life'
    ],
    interventions: [
      'Agency building',
      'Empowerment exercises',
      'Attribution retraining',
      'Success documentation',
      'Choice expansion'
    ]
  },
  NIP12: {
    code: 'NIP12',
    name: 'BULLY - Victim Loops',
    shortName: 'Victim',
    description: 'Recurring thought pattern where someone sees themselves as powerless against outside forces',
    characteristics: [
      'Victim mentality',
      'Drama triangle participation',
      'Powerlessness beliefs',
      'Attracting toxic relationships',
      'Blame patterns'
    ],
    interventions: [
      'Empowerment coaching',
      'Responsibility claiming',
      'Boundary work',
      'Relationship pattern analysis',
      'Choice recognition'
    ]
  },
  NIP13: {
    code: 'NIP13',
    name: 'LACK - Lack State',
    shortName: 'Lack',
    description: 'Situation marked by limited access to financial means or material support',
    characteristics: [
      'Scarcity mindset',
      'Financial anxiety',
      'Materialism',
      'Resource comparison',
      'Money relationship issues'
    ],
    interventions: [
      'Abundance mindset shift',
      'Financial literacy',
      'Values clarification',
      'Generosity practice',
      'Gratitude cultivation'
    ]
  },
  NIP14: {
    code: 'NIP14',
    name: 'DIM - Left/Right Brain',
    shortName: 'Thinking Style',
    description: 'Thinking pattern that concentrates on specifics vs. broader reasoning from high-level perspective',
    characteristics: [
      'Detail fixation OR big picture only',
      'Missing forest for trees',
      'Analytical paralysis',
      'Lack of integration',
      'Imbalanced thinking'
    ],
    interventions: [
      'Balanced thinking practices',
      'Zoom in/out exercises',
      'Integration training',
      'Perspective shifting',
      'Holistic analysis'
    ]
  },
  NIP15: {
    code: 'NIP15',
    name: 'FOC - Scatter Focus',
    shortName: 'Scatter Focus',
    description: 'Struggles to focus long enough to complete tasks, shifting rapidly between activities',
    characteristics: [
      'Attention difficulties',
      'Task incompletion',
      'Mind wandering',
      'Forgetfulness',
      'Concentration challenges'
    ],
    interventions: [
      'Attention training',
      'Environmental optimization',
      'Task management systems',
      'Mindfulness practice',
      'Medical evaluation'
    ]
  },
  NIP16: {
    code: 'NIP16',
    name: 'RES - Attitude (Resistance)',
    shortName: 'Resistance',
    description: 'Consistent pattern of resistance or negativity expressed toward people, relationships, responsibilities',
    characteristics: [
      'Oppositional behavior',
      'Authority resistance',
      'Negativity bias',
      'Sabotaging patterns',
      'Conflict creation'
    ],
    interventions: [
      'Resistance exploration',
      'Underlying needs identification',
      'Communication improvement',
      'Autonomy restoration',
      'Cooperation building'
    ]
  },
  NIP17: {
    code: 'NIP17',
    name: 'INWF - Inward Focus (Narcissism)',
    shortName: 'Narcissism',
    description: 'Amplified belief in one\'s own importance resulting in self-centered attitudes and choices',
    characteristics: [
      'Self-centeredness',
      'Need for admiration',
      'Lack of empathy',
      'Entitlement',
      'Superiority beliefs'
    ],
    interventions: [
      'Empathy development',
      'Perspective-taking',
      'Humility cultivation',
      'Service activities',
      'Feedback receptivity'
    ]
  },
  NIP18: {
    code: 'NIP18',
    name: 'CPL - Addictive Loops',
    shortName: 'Addiction',
    description: 'Repeated drive toward actions that offer momentary comfort but carry damaging results',
    characteristics: [
      'Compulsive behaviors',
      'Substance dependence',
      'Process addictions',
      'Difficulty stopping',
      'Negative consequences'
    ],
    interventions: [
      'Addiction treatment',
      'Support groups',
      'Underlying trauma work',
      'Healthy coping skills',
      'Relapse prevention'
    ]
  },
  NIP19: {
    code: 'NIP19',
    name: 'BURN - Burned Out',
    shortName: 'Burnout',
    description: 'Person feels or behaves older than their years due to weariness, stress overload, or persistent health issues',
    characteristics: [
      'Chronic exhaustion',
      'Emotional depletion',
      'Cynicism',
      'Reduced effectiveness',
      'Physical symptoms'
    ],
    interventions: [
      'Rest and recovery',
      'Boundary setting',
      'Workload reduction',
      'Self-care practices',
      'Lifestyle changes'
    ]
  },
  NIP20: {
    code: 'NIP20',
    name: 'DEC - Deceiver',
    shortName: 'Deception',
    description: 'Individual who masks self-serving motives with appearance of goodness or innocence',
    characteristics: [
      'Dishonesty patterns',
      'Manipulation',
      'False presentation',
      'Strategic deception',
      'Lack of integrity'
    ],
    interventions: [
      'Integrity development',
      'Honesty practice',
      'Consequences awareness',
      'Values alignment',
      'Accountability structures'
    ]
  }
};
