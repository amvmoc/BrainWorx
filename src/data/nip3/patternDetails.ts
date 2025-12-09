// Pattern Details for Coach Report
// Complete clinical descriptions and interventions for all 20 NIPs

export interface PatternDetail {
  description: string;
  manifestations: string;
  causes: string;
  interventions: string[];
  notes: string;
}

export const getPatternDetails = (nipCode: string, percentage: number): PatternDetail => {
  const details: Record<string, PatternDetail> = {
    'NIP01': {
      description: 'Spaces that ignore the need for conscious human growth, creating environments where individuals simply "exist" instead of evolving.',
      manifestations: 'Living or working in environments that lack support for growth, creativity stifled, no encouragement for development.',
      causes: 'Often stems from family systems that value conformity over growth, workplaces focused solely on productivity.',
      interventions: [
        'Create intentional growth spaces and rituals—dedicated time/place for learning and development',
        'Establish clear boundaries that protect time and energy for growth activities',
        'Develop a written vision for conscious evolution across life domains',
        'Identify and challenge limiting environmental patterns',
        'Build or join supportive communities focused on growth'
      ],
      notes: `At ${percentage}%, environmental changes often require external support. May need to grieve what must be left behind.`
    },
    'NIP02': {
      description: 'Substantial emotional damage causing hyper-sensitivity—often from physical, verbal, or sexual harm—with weakened sense of personal worth.',
      manifestations: 'Hyper-vigilance to criticism, difficulty trusting, shame-based self-concept, heightened emotional reactivity, people-pleasing.',
      causes: 'Results from emotional, physical, or sexual abuse; chronic criticism; betrayal; bullying; discrimination.',
      interventions: [
        'Trauma-informed therapy using EMDR, Somatic Experiencing, or Internal Family Systems',
        'Self-compassion practices including loving-kindness meditation and self-forgiveness work',
        'Boundary setting and assertiveness training to reclaim personal power',
        'Nervous system regulation techniques (breathwork, yoga, bilateral stimulation)',
        'Build safe relationships with therapeutic support'
      ],
      notes: `At ${percentage}%, ${percentage >= 60 ? 'strong' : 'moderate'} presence. Critical impact—if score >50%, prioritize trauma-specialized treatment.`
    },
    'NIP03': {
      description: 'Persistent difficulties with planning, organizing, and managing time. May misjudge task duration, lose items, or feel constantly behind.',
      manifestations: 'Chronic lateness, missed deadlines, cluttered spaces, lost items, difficulty prioritizing, feeling overwhelmed.',
      causes: 'May stem from executive function difficulties (ADHD), never learning organizational skills, nervous system dysregulation.',
      interventions: [
        'Implement structured daily routines with visual schedules and checklists',
        'Use time-blocking and calendar management—schedule everything including buffer time',
        'Break large tasks into 15-minute actionable chunks',
        'External accountability through body doubling or regular check-ins',
        'Professional organizing consultation or ADHD coaching'
      ],
      notes: `At ${percentage}%, strong presence impacting daily functioning. Consider formal ADHD evaluation. Build systems gradually.`
    },
    'NIP04': {
      description: 'Parenting styles that failed to nurture healthy emotional and cognitive growth. May involve neglect, enmeshment, or inconsistent care.',
      manifestations: 'Difficulty trusting, problems with emotional regulation, unclear boundaries, anxious or avoidant attachment patterns.',
      causes: 'Results from emotionally unavailable parents, role reversal, lack of attunement, inconsistent parenting, or abuse.',
      interventions: [
        'Attachment-focused therapy using EMDR or schema therapy',
        'Reparenting work—learn to meet own needs previously unmet in childhood',
        'Develop healthy boundaries through assertiveness training',
        'Process developmental wounds with trauma-informed approach',
        'Build corrective emotional experiences through safe relationships'
      ],
      notes: `At ${percentage}%, developmental wounds significantly impact relationships. Therapy essential for healing attachment patterns.`
    },
    'NIP05': {
      description: 'Body and mind that feel constantly "on." Struggle to relax or unwind. Rest and quiet feel uncomfortable—internal engine stuck in high gear.',
      manifestations: 'Difficulty sleeping, constant mental activity, physical restlessness, inability to relax, chronic muscle tension.',
      causes: 'Often develops from chronic stress, trauma responses (hypervigilance), perfectionism, constant environmental demands.',
      interventions: [
        'Vagal nerve toning exercises including deep breathing (4-7-8 technique), humming, cold water exposure',
        'Progressive muscle relaxation twice daily—systematically tensing/releasing muscle groups',
        'Mindfulness meditation starting with 5 minutes daily, gradually increasing',
        'Regular aerobic exercise (30-45 min, 4-5x/week) with intentional cool-down',
        'Sleep hygiene optimization: consistent schedule, dark/cool environment, calming routine'
      ],
      notes: `At ${percentage}%, strong presence often underlying other difficulties. Foundational pattern—addressing this will cascade benefits. Priority target.`
    },
    'NIP06': {
      description: 'Thinking rooted in old patterns and traditions that restrict openness to new perspectives. May involve rigid beliefs or black-and-white thinking.',
      manifestations: 'Difficulty considering alternative viewpoints, defensive when beliefs challenged, judgmental of different perspectives, cognitive inflexibility.',
      causes: 'Often stems from authoritarian upbringing, religious/cultural dogma, fear-based worldview, or trauma.',
      interventions: [
        'Cognitive flexibility training through perspective-taking exercises',
        'Exposure to diverse viewpoints in safe, controlled manner',
        'Examine origins of core beliefs—identify which serve current wellbeing',
        'Practice holding paradox—both/and thinking rather than either/or',
        'Develop intellectual humility through philosophical inquiry'
      ],
      notes: `At ${percentage}%, moderate rigidity present. Change requires psychological safety. Avoid direct confrontation of beliefs—instead, expand capacity for complexity.`
    },
    'NIP07': {
      description: 'Pattern where person tends to "jump all out" before fully thinking through consequences. Acting on urges without adequate consideration.',
      manifestations: 'Impulsive purchases, interrupting others, starting tasks without planning, difficulty delaying gratification, reactive decisions.',
      causes: 'May reflect ADHD, poor executive function, modeling from caregivers, anxiety-driven urgency, or lack of impulse control training.',
      interventions: [
        'Implement pause-and-reflect practices—count to 10 before major decisions',
        'Use decision-making frameworks that require written pros/cons',
        'Develop awareness of impulse triggers through journaling',
        'Practice delayed gratification in small ways (build the muscle)',
        'Mindfulness training to create space between urge and action'
      ],
      notes: `At ${percentage}%, impulsivity creating life challenges. May benefit from ADHD evaluation. Build impulse control through small, consistent practice.`
    },
    'NIP08': {
      description: 'Pattern where person has learned to withhold feeling as survival strategy—emotions kept at distance, often appearing "numb" or disconnected.',
      manifestations: 'Difficulty identifying emotions, intellectualizing feelings, limited empathy, emotional flatness, disconnection from body sensations.',
      causes: 'Typically develops as defense against overwhelming emotion, trauma, invalidating environment, or modeling from emotionally unavailable caregivers.',
      interventions: [
        'Somatic therapy to reconnect with body-based emotion signals',
        'Emotion identification training using feeling wheels and body scans',
        'Safe emotional expression through art, music, movement, or journaling',
        'Gradual exposure to vulnerability in therapeutic relationship',
        'Empathy development through perspective-taking and compassion practices'
      ],
      notes: `At ${percentage}%, significant emotional disconnection present. Thawing requires safety and patience. Avoid forcing emotional expression—focus on building capacity.`
    },
    'NIP09': {
      description: 'Unaddressed psychological or neurological conditions—depression, anxiety, chronic stress, or other mental health challenges requiring professional intervention.',
      manifestations: 'Persistent sadness, excessive worry, panic attacks, mood instability, concentration difficulties, sleep disturbances, loss of interest.',
      causes: 'May stem from genetic factors, trauma, chronic stress, brain chemistry, life circumstances, or combination of factors.',
      interventions: [
        'Comprehensive mental health evaluation—psychiatric and psychological',
        'Evidence-based psychotherapy (CBT, DBT, ACT) matched to symptoms',
        'Medication assessment with psychiatrist—may be indicated',
        'Lifestyle interventions: exercise, sleep hygiene, nutrition, stress management',
        'Crisis planning—develop safety plan with therapist if needed'
      ],
      notes: `At ${percentage}%, significant mental health symptoms present. Professional treatment essential. This is medical-level concern—refer appropriately.`
    },
    'NIP10': {
      description: 'Persistent anger from past experiences, marked by inability to let go of resentment or grudges. Reflects unresolved emotional wounds.',
      manifestations: 'Quick irritability, holding grudges, difficulty forgiving, ruminating on past wrongs, angry outbursts disproportionate to situation.',
      causes: 'Typically stems from past injustice, betrayal, hurt, or trauma never adequately processed.',
      interventions: [
        'Anger management therapy using CBT techniques—identify triggers, challenge anger-maintaining thoughts',
        'Forgiveness work (not condoning, but releasing its hold) through guided exercises',
        'Trauma resolution therapy to address root causes using EMDR or Somatic Experiencing',
        'Healthy anger expression: vigorous exercise, journaling, talking with supportive others',
        'Emotional regulation skills training including distress tolerance and mindfulness'
      ],
      notes: `At ${percentage}%, explore what remains unresolved. Anger often covers hurt, fear, or powerlessness. Address underlying wounds.`
    },
    'NIP11': {
      description: 'Where a person perceives the source of influence over their life decisions and outcomes. External locus = belief that outside forces control life.',
      manifestations: 'Learned helplessness, victim mentality, passive approach to problems, attributing success to luck, failure to external forces.',
      causes: 'Develops from experiences of powerlessness, unpredictable environments, overprotective or controlling caregivers, or repeated failures.',
      interventions: [
        'Agency-building exercises—start with small controllable choices',
        'Attribution retraining—identify areas of personal influence',
        'Document successes and role in creating them',
        'Problem-solving training to develop sense of efficacy',
        'Challenge victim narratives through cognitive restructuring'
      ],
      notes: `At ${percentage}%, external locus limiting growth. Building internal locus requires evidence of agency. Start small—accumulate experiences of control.`
    },
    'NIP12': {
      description: 'Recurring thought pattern where someone sees themselves as powerless against outside forces. Karpman Drama Triangle—victim, persecutor, rescuer roles.',
      manifestations: 'Attracting toxic relationships, feeling consistently wronged, blaming others, difficulty taking responsibility, rescue fantasies.',
      causes: 'Often develops from childhood experiences of genuine victimization, then becomes ingrained relational pattern.',
      interventions: [
        'Identify drama triangle patterns—recognize when entering victim role',
        'Develop empowerment mindset through choice awareness',
        'Establish and maintain healthy boundaries',
        'Process original trauma that created victim schema',
        'Build self-responsibility while validating real hurts'
      ],
      notes: `At ${percentage}%, victim patterns affecting relationships. Transformation requires both validating real wounds AND building agency.`
    },
    'NIP13': {
      description: 'Situation marked by limited access to financial means or material support. May involve scarcity mindset even when resources are adequate.',
      manifestations: 'Financial anxiety, hoarding, difficulty spending on self, comparing to others, never feeling "enough," money conflicts.',
      causes: 'May stem from actual poverty, observing parental money stress, sudden loss, or family messages about scarcity.',
      interventions: [
        'Financial literacy education—understand money management',
        'Abundance mindset cultivation through gratitude practices',
        'Examine family money scripts—identify inherited beliefs',
        'Develop healthy relationship with money through values clarification',
        'Address practical financial challenges with concrete planning'
      ],
      notes: `At ${percentage}%, scarcity mindset present. Important to distinguish actual lack from psychological scarcity. Address both practical and mindset dimensions.`
    },
    'NIP14': {
      description: 'Thinking pattern that concentrates on specifics vs. broader reasoning from high-level perspective. Imbalance in detail-focus vs. big-picture thinking.',
      manifestations: 'Getting lost in details OR missing crucial specifics, difficulty integrating information, analysis paralysis OR superficial thinking.',
      causes: 'May reflect cognitive style, ADHD, anxiety (narrows focus), or lack of training in balanced thinking.',
      interventions: [
        'Practice deliberate perspective shifts—zoom in/zoom out exercises',
        'Develop both detail and synthesis skills through structured practice',
        'Use frameworks that require both levels (mind maps, outlines)',
        'Seek feedback on blind spots in thinking style',
        'Balance analytical and intuitive thinking'
      ],
      notes: `At ${percentage}%, thinking style imbalance present. Neither extreme is optimal. Build capacity for flexible thinking—ability to shift perspective as needed.`
    },
    'NIP15': {
      description: 'Struggles to focus long enough to complete tasks, shifting rapidly between activities. May feel restless, easily distracted.',
      manifestations: 'Difficulty finishing tasks, jumping between activities, easily distracted, losing track of conversations, careless errors.',
      causes: 'May reflect ADHD, anxiety, stress-related cognitive impact, information overload, environmental factors.',
      interventions: [
        'Implement strict single-tasking practices—close unnecessary tabs, silence notifications',
        'Use Pomodoro Technique (25 min focus, 5 min break) or similar time-boxing',
        'Minimize environmental distractions: dedicated workspace, noise-canceling headphones',
        'Attention training exercises through apps or meditation',
        'Professional evaluation for ADHD screening—medication may be indicated'
      ],
      notes: `At ${percentage}%, significant attention difficulties impacting productivity. Given concurrent stress patterns, attention may improve with nervous system regulation. Consider ADHD evaluation.`
    },
    'NIP16': {
      description: 'Consistent pattern of resistance or negativity expressed toward people, relationships, responsibilities. May manifest as oppositional or defiant stance.',
      manifestations: 'Arguing with authority, refusing reasonable requests, deliberately annoying others, vindictive behavior, resentment of rules.',
      causes: 'Often stems from power struggles in childhood, trauma, feeling controlled, or modeling from caregivers.',
      interventions: [
        'Explore underlying needs beneath resistance—often autonomy or safety',
        'Develop healthy assertion that respects self and others',
        'Address trauma or wounds driving oppositional stance',
        'Practice collaboration—finding win-win solutions',
        'Build intrinsic motivation rather than external compliance'
      ],
      notes: `At ${percentage}%, resistance pattern present. Typically indicates unmet needs for autonomy or safety. Avoid power struggles—focus on underlying needs.`
    },
    'NIP17': {
      description: 'Amplified belief in one\'s own importance resulting in self-centered attitudes and choices. May lack empathy or require excessive admiration.',
      manifestations: 'Excessive self-focus, need for admiration, lack of empathy, sense of entitlement, exploitation of others, grandiose fantasies.',
      causes: 'Complex etiology—may stem from childhood neglect OR excessive praise, trauma, attachment difficulties.',
      interventions: [
        'Develop genuine empathy through perspective-taking exercises',
        'Build authentic self-esteem based on real accomplishments',
        'Practice service and contribution to others',
        'Explore childhood wounds driving self-protection',
        'Cultivate humility and interdependence awareness'
      ],
      notes: `At ${percentage}%, narcissistic traits present. Change requires psychological safety—direct confrontation typically fails. Focus on building authentic connection.`
    },
    'NIP18': {
      description: 'Repeated drive toward actions that offer momentary comfort but carry damaging results. May involve substances, behaviors, or processes.',
      manifestations: 'Compulsive engagement despite consequences, cravings, loss of control, continued use despite harm, tolerance development.',
      causes: 'Complex interaction of genetic vulnerability, trauma, mental health, social factors, availability.',
      interventions: [
        'Comprehensive addiction treatment—may require residential or intensive outpatient',
        'Address underlying trauma and mental health with dual diagnosis approach',
        '12-step or alternative recovery programs for community support',
        'Develop healthy coping skills to replace addictive behaviors',
        'Family involvement when appropriate—addiction affects systems'
      ],
      notes: `At ${percentage}%, addictive patterns significantly impacting life. This is specialized treatment area—refer to addiction professionals. Recovery possible with appropriate support.`
    },
    'NIP19': {
      description: 'Feeling older than one\'s years—mentally, emotionally, or physically—due to prolonged stress or accumulated burdens. Depleted beyond what rest can fix.',
      manifestations: 'Chronic fatigue unrelieved by rest, cynicism, loss of joy, physical stress symptoms, feeling aged beyond years.',
      causes: 'Develops from prolonged stress without adequate recovery, caregiver burden, trauma, chronic illness, accumulated responsibilities.',
      interventions: [
        'Prioritize rest and recovery with scheduled, protected downtime—treating restoration as non-negotiable',
        'Stress management including setting firm boundaries, saying no to non-essential commitments',
        'Address underlying contributors: chronic illness, relationship stress, work demands',
        'Rediscover activities that bring joy and meaning',
        'Consider temporary reduction in responsibilities if possible'
      ],
      notes: `At ${percentage}%, burnout significantly impacting functioning. Recovery requires more than rest—need to address root causes and restructure life demands.`
    },
    'NIP20': {
      description: 'Individual who masks self-serving motives with appearance of goodness or innocence. Strategic dishonesty or manipulation.',
      manifestations: 'Consistent dishonesty, manipulation, creating false impressions, exploiting trust, lack of genuine remorse.',
      causes: 'May develop from modeling, survival strategies in hostile environment, antisocial traits, or deep wounds around trust.',
      interventions: [
        'Explore motivations for dishonesty—fear, shame, survival patterns',
        'Build authentic relationships where honesty is safe',
        'Develop empathy and conscience through perspective-taking',
        'Address consequences of dishonesty in concrete terms',
        'Create accountability structures with clear expectations'
      ],
      notes: `At ${percentage}%, deception patterns present. Change requires strong motivation and accountability. Progress may be slow—building integrity is developmental process.`
    }
  };

  return details[nipCode] || {
    description: 'Pattern details not available',
    manifestations: 'See assessment for details',
    causes: 'Multiple factors may contribute',
    interventions: ['Professional consultation recommended'],
    notes: `Score: ${percentage}%`
  };
};
