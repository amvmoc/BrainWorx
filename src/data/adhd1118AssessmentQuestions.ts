export type PatternId =
  | "FOC"
  | "DIM"
  | "ORG"
  | "HYP"
  | "IMP"
  | "ANG"
  | "INWF"
  | "RES"
  | "BURN"
  | "BULLY";

export interface Question {
  id: string;
  pattern: PatternId;
  text: string;
  category: "Core ADHD" | "Impact / Emotional";
}

export interface PatternMeta {
  code: PatternId;
  name: string;
  category: "Core ADHD" | "Impact / Emotional";
  shortDescription: string;
  fullDescription: string;
}

export const PATTERN_INFO: Record<PatternId, PatternMeta> = {
  FOC: {
    code: "FOC",
    name: "Scattered Focus",
    category: "Core ADHD",
    shortDescription: "Mind drifting, zoning out, missing details while listening or working.",
    fullDescription: "Difficulty sustaining attention, mind wandering, missing important information during tasks or conversations."
  },
  DIM: {
    code: "DIM",
    name: "Flexible Focus",
    category: "Core ADHD",
    shortDescription: "Focus jumping between things or hyper-focusing on the wrong things.",
    fullDescription: "Inconsistent focus that shifts between hyperfocus on preferred activities and inability to focus on less interesting tasks."
  },
  ORG: {
    code: "ORG",
    name: "Time & Order",
    category: "Core ADHD",
    shortDescription: "Planning, organising, starting and finishing tasks, time management.",
    fullDescription: "Challenges with organization, planning, task initiation, and time management in daily activities."
  },
  HYP: {
    code: "HYP",
    name: "High Gear",
    category: "Core ADHD",
    shortDescription: "Restlessness, high energy, struggling to sit still or relax.",
    fullDescription: "Excessive physical and mental activity, restlessness, difficulty relaxing or sitting still."
  },
  IMP: {
    code: "IMP",
    name: "Impulse Rush",
    category: "Core ADHD",
    shortDescription: "Acting or speaking before thinking, difficulty waiting your turn.",
    fullDescription: "Acting without thinking, difficulty with self-control, interrupting, impulsive decisions."
  },
  ANG: {
    code: "ANG",
    name: "Anchored Anger",
    category: "Impact / Emotional",
    shortDescription: "Irritation, anger, frustration after many struggles or corrections.",
    fullDescription: "Frequent frustration, anger, and irritability often resulting from accumulated challenges and corrections."
  },
  INWF: {
    code: "INWF",
    name: "Inward Focus",
    category: "Impact / Emotional",
    shortDescription: "Strong self-talk, shame, worrying about failure, feeling not good enough.",
    fullDescription: "Negative self-perception, excessive worry about performance, feeling inadequate or 'not good enough'."
  },
  RES: {
    code: "RES",
    name: "Resistance / Attitude",
    category: "Impact / Emotional",
    shortDescription: "Pushing back, arguing, acting like you don't care even when you do.",
    fullDescription: "Oppositional behavior, resistance to authority, defensive attitude often masking underlying concerns."
  },
  BURN: {
    code: "BURN",
    name: "Burned Out",
    category: "Impact / Emotional",
    shortDescription: "Emotional and mental exhaustion from always trying to keep up.",
    fullDescription: "Mental and emotional fatigue from constant effort to meet demands and expectations."
  },
  BULLY: {
    code: "BULLY",
    name: "Victim Loops",
    category: "Impact / Emotional",
    shortDescription: "Feeling picked on, blamed or misunderstood by others.",
    fullDescription: "Sense of being unfairly targeted, misunderstood, or blamed more than others."
  },
};

export const QUESTIONS: Question[] = [
  // FOC – Scattered Focus
  {
    id: "FOC1",
    pattern: "FOC",
    text: "In class or when I study, my mind drifts away even if I want to listen.",
    category: "Core ADHD"
  },
  {
    id: "FOC2",
    pattern: "FOC",
    text: "I start thinking about other things in the middle of a task without noticing it.",
    category: "Core ADHD"
  },
  {
    id: "FOC3",
    pattern: "FOC",
    text: "When someone talks to me for a while, I realise I missed half of what they said.",
    category: "Core ADHD"
  },
  {
    id: "FOC4",
    pattern: "FOC",
    text: "I need people to repeat instructions because my mind went somewhere else.",
    category: "Core ADHD"
  },
  {
    id: "FOC5",
    pattern: "FOC",
    text: "I daydream or 'zone out' and only realise it when someone calls my name.",
    category: "Core ADHD"
  },

  // DIM – Flexible Focus
  {
    id: "DIM1",
    pattern: "DIM",
    text: "I can focus really well on things I enjoy, but almost not at all on boring work.",
    category: "Core ADHD"
  },
  {
    id: "DIM2",
    pattern: "DIM",
    text: "I change what I'm busy with before I finish, even if it's important.",
    category: "Core ADHD"
  },
  {
    id: "DIM3",
    pattern: "DIM",
    text: "I sometimes ignore important tasks because something more interesting caught my attention.",
    category: "Core ADHD"
  },
  {
    id: "DIM4",
    pattern: "DIM",
    text: "I struggle to switch my focus back to work after being on my phone or gaming.",
    category: "Core ADHD"
  },
  {
    id: "DIM5",
    pattern: "DIM",
    text: "I can get 'stuck' on a game, video or hobby and forget about time and responsibilities.",
    category: "Core ADHD"
  },

  // ORG – Time & Order
  {
    id: "ORG1",
    pattern: "ORG",
    text: "My school bag, room or desk is usually messy or disorganised.",
    category: "Core ADHD"
  },
  {
    id: "ORG2",
    pattern: "ORG",
    text: "I often forget to bring the right books, clothes or equipment for school or activities.",
    category: "Core ADHD"
  },
  {
    id: "ORG3",
    pattern: "ORG",
    text: "I leave assignments or studying until the last minute.",
    category: "Core ADHD"
  },
  {
    id: "ORG4",
    pattern: "ORG",
    text: "I know what I must do, but I struggle to start, even on small tasks.",
    category: "Core ADHD"
  },
  {
    id: "ORG5",
    pattern: "ORG",
    text: "I lose track of time and then I am late or rushed for things.",
    category: "Core ADHD"
  },

  // HYP – High Gear
  {
    id: "HYP1",
    pattern: "HYP",
    text: "I feel restless, like there is 'extra energy' in my body most of the time.",
    category: "Core ADHD"
  },
  {
    id: "HYP2",
    pattern: "HYP",
    text: "I fidget a lot (with my hands, feet, pen, etc.) even when I try to sit still.",
    category: "Core ADHD"
  },
  {
    id: "HYP3",
    pattern: "HYP",
    text: "Sitting through a whole class, lesson or meeting feels very hard for me.",
    category: "Core ADHD"
  },
  {
    id: "HYP4",
    pattern: "HYP",
    text: "People tell me I talk too much or that I talk very fast.",
    category: "Core ADHD"
  },
  {
    id: "HYP5",
    pattern: "HYP",
    text: "I find it difficult to relax; my body or brain feels like it's always 'on'.",
    category: "Core ADHD"
  },

  // IMP – Impulse Rush
  {
    id: "IMP1",
    pattern: "IMP",
    text: "I blurt things out before thinking about how it will sound.",
    category: "Core ADHD"
  },
  {
    id: "IMP2",
    pattern: "IMP",
    text: "I interrupt other people when they are talking.",
    category: "Core ADHD"
  },
  {
    id: "IMP3",
    pattern: "IMP",
    text: "I make fast decisions (like saying yes or no, or buying something) and regret it later.",
    category: "Core ADHD"
  },
  {
    id: "IMP4",
    pattern: "IMP",
    text: "I do things 'in the moment' even when I know it could get me into trouble.",
    category: "Core ADHD"
  },
  {
    id: "IMP5",
    pattern: "IMP",
    text: "I find it hard to wait my turn (for example in a line, game or conversation).",
    category: "Core ADHD"
  },

  // ANG – Anchored Anger
  {
    id: "ANG1",
    pattern: "ANG",
    text: "I get angry or irritated quickly when things don't go my way.",
    category: "Impact / Emotional"
  },
  {
    id: "ANG2",
    pattern: "ANG",
    text: "When people correct me, I feel like they are attacking me.",
    category: "Impact / Emotional"
  },
  {
    id: "ANG3",
    pattern: "ANG",
    text: "I've been in trouble so often that I sometimes explode over small things.",
    category: "Impact / Emotional"
  },
  {
    id: "ANG4",
    pattern: "ANG",
    text: "I lose my temper and later feel bad about what I said or did.",
    category: "Impact / Emotional"
  },
  {
    id: "ANG5",
    pattern: "ANG",
    text: "I feel like people don't understand how hard things are for me, and it makes me angry.",
    category: "Impact / Emotional"
  },

  // INWF – Inward Focus
  {
    id: "INWF1",
    pattern: "INWF",
    text: "I often replay my mistakes in my head and feel stupid or useless.",
    category: "Impact / Emotional"
  },
  {
    id: "INWF2",
    pattern: "INWF",
    text: "I worry that I will fail or disappoint people, even before I start.",
    category: "Impact / Emotional"
  },
  {
    id: "INWF3",
    pattern: "INWF",
    text: "When I get into trouble, I feel like there is something wrong with me as a person.",
    category: "Impact / Emotional"
  },
  {
    id: "INWF4",
    pattern: "INWF",
    text: "I compare myself to others and feel like I'm 'behind' or not good enough.",
    category: "Impact / Emotional"
  },
  {
    id: "INWF5",
    pattern: "INWF",
    text: "I keep a lot of my feelings inside because I'm scared people won't understand.",
    category: "Impact / Emotional"
  },

  // RES – Resistance / Attitude
  {
    id: "RES1",
    pattern: "RES",
    text: "When adults tell me what to do, my first reaction is to push back or resist.",
    category: "Impact / Emotional"
  },
  {
    id: "RES2",
    pattern: "RES",
    text: "I sometimes act like I don't care, even when I actually do care.",
    category: "Impact / Emotional"
  },
  {
    id: "RES3",
    pattern: "RES",
    text: "After being corrected many times, I feel like 'why even try?'.",
    category: "Impact / Emotional"
  },
  {
    id: "RES4",
    pattern: "RES",
    text: "I argue with teachers, parents or coaches more than most teens I know.",
    category: "Impact / Emotional"
  },
  {
    id: "RES5",
    pattern: "RES",
    text: "I sometimes do the opposite of what I'm told just to feel in control.",
    category: "Impact / Emotional"
  },

  // BURN – Burned Out
  {
    id: "BURN1",
    pattern: "BURN",
    text: "I feel tired or drained, even when I haven't done that much physically.",
    category: "Impact / Emotional"
  },
  {
    id: "BURN2",
    pattern: "BURN",
    text: "School or daily life feels like a never-ending fight to keep up.",
    category: "Impact / Emotional"
  },
  {
    id: "BURN3",
    pattern: "BURN",
    text: "I've tried to change some habits, but I feel like nothing really helps for long.",
    category: "Impact / Emotional"
  },
  {
    id: "BURN4",
    pattern: "BURN",
    text: "There are days when I just want to give up and not try anymore.",
    category: "Impact / Emotional"
  },
  {
    id: "BURN5",
    pattern: "BURN",
    text: "I feel mentally exhausted from always trying to remember, focus and stay out of trouble.",
    category: "Impact / Emotional"
  },

  // BULLY – Victim Loops
  {
    id: "BULLY1",
    pattern: "BULLY",
    text: "I often feel like teachers, parents or others pick on me more than on others.",
    category: "Impact / Emotional"
  },
  {
    id: "BULLY2",
    pattern: "BULLY",
    text: "I feel misunderstood, like people don't see how hard I'm trying.",
    category: "Impact / Emotional"
  },
  {
    id: "BULLY3",
    pattern: "BULLY",
    text: "I feel like I'm the one who always gets blamed when something goes wrong.",
    category: "Impact / Emotional"
  },
  {
    id: "BULLY4",
    pattern: "BULLY",
    text: "I sometimes believe that 'life is just against me' or 'nothing works out for me'.",
    category: "Impact / Emotional"
  },
  {
    id: "BULLY5",
    pattern: "BULLY",
    text: "Past bullying, teasing or unfair treatment still affects how I feel about myself today.",
    category: "Impact / Emotional"
  },
];

export const ANSWER_OPTIONS = [
  { value: 1, label: "Almost never true for me" },
  { value: 2, label: "Sometimes true for me" },
  { value: 3, label: "Often true for me" },
  { value: 4, label: "Almost always true for me" },
];

export interface NIPPScores {
  FOC: number;
  DIM: number;
  ORG: number;
  HYP: number;
  IMP: number;
  ANG: number;
  INWF: number;
  RES: number;
  BURN: number;
  BULLY: number;
}

export function calculateNIPPScores1118(responses: Record<string, number>): NIPPScores {
  const patternScores: Record<PatternId, number[]> = {
    FOC: [],
    DIM: [],
    ORG: [],
    HYP: [],
    IMP: [],
    ANG: [],
    INWF: [],
    RES: [],
    BURN: [],
    BULLY: [],
  };

  QUESTIONS.forEach(question => {
    const value = responses[question.id];
    if (value !== undefined && value !== null) {
      patternScores[question.pattern].push(value);
    }
  });

  const result: NIPPScores = {} as NIPPScores;

  for (const pattern in patternScores) {
    const scores = patternScores[pattern as PatternId];
    const average = scores.length > 0
      ? scores.reduce((sum, val) => sum + val, 0) / scores.length
      : 0;
    result[pattern as PatternId] = Math.round(average * 100) / 100;
  }

  return result;
}

export function getSeverityLabel1118(score: number): string {
  if (score < 1.75) return "Low";
  if (score < 2.5) return "Mild / Occasional";
  if (score < 3.25) return "Moderate";
  return "High";
}

export function scoreToPercentage(score: number): number {
  return Math.round((score / 4.0) * 100);
}
