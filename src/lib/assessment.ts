// PathNova scientific career assessment bank.
// Each section maps to a well-known psychometric or vocational framework.
// Likert questions are answered 1..5 (Strongly disagree → Strongly agree).

export type LikertQuestion = {
  id: string;
  text: string;
  // trait key this question loads onto (e.g. big5_openness, riasec_investigative)
  trait: string;
  // if true, the score is reversed (1 becomes 5, etc.)
  reverse?: boolean;
};

export type ChoiceQuestion = {
  id: string;
  text: string;
  trait: string;
  options: { value: string; label: string; score?: number }[];
};

export type Section = {
  id: string;
  title: string;
  description: string;
  kind: "likert" | "choice" | "ranking";
  questions: (LikertQuestion | ChoiceQuestion)[];
};

// Big Five (OCEAN) — 10 items (2 per trait)
const bigFive: LikertQuestion[] = [
  { id: "b5_o1", trait: "openness", text: "I enjoy exploring abstract ideas and new perspectives." },
  { id: "b5_o2", trait: "openness", text: "I prefer routines and familiar experiences over novelty.", reverse: true },
  { id: "b5_c1", trait: "conscientiousness", text: "I plan ahead and follow through on my commitments." },
  { id: "b5_c2", trait: "conscientiousness", text: "I often leave things until the last minute.", reverse: true },
  { id: "b5_e1", trait: "extraversion", text: "I feel energized after spending time with a group of people." },
  { id: "b5_e2", trait: "extraversion", text: "I prefer working alone over collaborating in groups.", reverse: true },
  { id: "b5_a1", trait: "agreeableness", text: "I try to see situations from other people's perspectives." },
  { id: "b5_a2", trait: "agreeableness", text: "I tend to be blunt even if it upsets others.", reverse: true },
  { id: "b5_n1", trait: "neuroticism", text: "I often feel anxious or worry about outcomes." },
  { id: "b5_n2", trait: "neuroticism", text: "I stay calm under pressure.", reverse: true },
];

// RIASEC interests — 12 items (2 per type)
const riasec: LikertQuestion[] = [
  { id: "ri_r1", trait: "realistic", text: "I enjoy building or fixing physical things with my hands." },
  { id: "ri_r2", trait: "realistic", text: "I like working outdoors or with machines and tools." },
  { id: "ri_i1", trait: "investigative", text: "I love investigating why things work the way they do." },
  { id: "ri_i2", trait: "investigative", text: "I enjoy analyzing complex problems and data." },
  { id: "ri_a1", trait: "artistic", text: "I express myself through art, writing, music, or design." },
  { id: "ri_a2", trait: "artistic", text: "I value original, creative work over conventional work." },
  { id: "ri_s1", trait: "social", text: "I find fulfillment in teaching or helping other people." },
  { id: "ri_s2", trait: "social", text: "I'm often the one others come to for advice." },
  { id: "ri_e1", trait: "enterprising", text: "I enjoy leading projects and persuading people to my ideas." },
  { id: "ri_e2", trait: "enterprising", text: "I'd rather start something new than maintain something existing." },
  { id: "ri_c1", trait: "conventional", text: "I like organized systems, clear rules, and structured tasks." },
  { id: "ri_c2", trait: "conventional", text: "I take pride in accuracy and attention to detail." },
];

// Aptitude — one item per domain, quick correctness check
const aptitude: ChoiceQuestion[] = [
  {
    id: "ap_log1", trait: "logical",
    text: "All Novans are Pathfinders. Some Pathfinders are Explorers. Therefore:",
    options: [
      { value: "a", label: "All Novans are Explorers.", score: 0 },
      { value: "b", label: "Some Novans may be Explorers.", score: 1 },
      { value: "c", label: "No Novans are Explorers.", score: 0 },
      { value: "d", label: "All Explorers are Novans.", score: 0 },
    ],
  },
  {
    id: "ap_num1", trait: "numerical",
    text: "A course price rises from $80 to $100. What is the percentage increase?",
    options: [
      { value: "a", label: "20%", score: 0 },
      { value: "b", label: "25%", score: 1 },
      { value: "c", label: "80%", score: 0 },
      { value: "d", label: "120%", score: 0 },
    ],
  },
  {
    id: "ap_verb1", trait: "verbal",
    text: "Choose the word that best completes: 'Her argument was so ___ that no one could refute it.'",
    options: [
      { value: "a", label: "cogent", score: 1 },
      { value: "b", label: "obtuse", score: 0 },
      { value: "c", label: "arbitrary", score: 0 },
      { value: "d", label: "casual", score: 0 },
    ],
  },
  {
    id: "ap_spat1", trait: "spatial",
    text: "If you fold a square piece of paper in half twice, then cut a small triangle from the folded corner and unfold — how many triangular holes appear?",
    options: [
      { value: "a", label: "1", score: 0 },
      { value: "b", label: "2", score: 0 },
      { value: "c", label: "4", score: 1 },
      { value: "d", label: "8", score: 0 },
    ],
  },
  {
    id: "ap_abs1", trait: "abstract",
    text: "Sequence: 2, 6, 12, 20, 30, ? — what comes next?",
    options: [
      { value: "a", label: "36", score: 0 },
      { value: "b", label: "40", score: 0 },
      { value: "c", label: "42", score: 1 },
      { value: "d", label: "48", score: 0 },
    ],
  },
];

// Values — Likert on 8 core work values (1 each)
const values: LikertQuestion[] = [
  { id: "va_auto", trait: "autonomy", text: "Freedom to decide how I do my work is essential to me." },
  { id: "va_mast", trait: "mastery", text: "I'm driven by getting deeply skilled at a craft." },
  { id: "va_impact", trait: "impact", text: "I need my work to make a visible difference to others." },
  { id: "va_sec", trait: "security", text: "Financial stability and predictability matter a lot to me." },
  { id: "va_prest", trait: "prestige", text: "Being respected for my achievements is important." },
  { id: "va_bal", trait: "balance", text: "I want work that leaves plenty of room for life outside it." },
  { id: "va_creat", trait: "creativity", text: "I need space to create original work." },
  { id: "va_team", trait: "belonging", text: "Feeling part of a close-knit team energizes me." },
];

// Work style
const workStyle: LikertQuestion[] = [
  { id: "ws_struct", trait: "structure", text: "I do my best work with clear structure and deadlines." },
  { id: "ws_flex", trait: "flexibility", text: "I prefer flexible schedules and changing priorities." },
  { id: "ws_collab", trait: "collaboration", text: "I get more done collaborating than working alone." },
  { id: "ws_deep", trait: "deep_focus", text: "Long stretches of uninterrupted focus is when I thrive." },
];

// Motivation — pick top drivers
const motivation: ChoiceQuestion[] = [
  {
    id: "mo_primary", trait: "primary_motivator",
    text: "Which of these would keep you engaged in a career for 10+ years?",
    options: [
      { value: "solve", label: "Solving hard, novel problems" },
      { value: "help", label: "Helping and empowering people" },
      { value: "build", label: "Building things others use" },
      { value: "lead", label: "Leading teams and setting direction" },
      { value: "create", label: "Making original, expressive work" },
      { value: "explore", label: "Exploring the unknown and researching" },
    ],
  },
];

// Emotional intelligence — Likert
const emotional: LikertQuestion[] = [
  { id: "eq_self", trait: "self_awareness", text: "I notice my emotions as they arise and can name them." },
  { id: "eq_reg", trait: "self_regulation", text: "I can stay composed when things go wrong." },
  { id: "eq_emp", trait: "empathy", text: "I can accurately sense what others are feeling." },
  { id: "eq_soc", trait: "social_skill", text: "I navigate disagreements without damaging the relationship." },
];

// Learning preferences — choice
const learning: ChoiceQuestion[] = [
  {
    id: "lr_style", trait: "learning_style",
    text: "How do you learn something new fastest?",
    options: [
      { value: "visual", label: "Watching demos and diagrams" },
      { value: "hands", label: "Trying it hands-on immediately" },
      { value: "reading", label: "Reading and taking notes" },
      { value: "discuss", label: "Discussing it with others" },
    ],
  },
];

// Career goals — choice
const goals: ChoiceQuestion[] = [
  {
    id: "go_horizon", trait: "goal_horizon",
    text: "Which best describes what you want in your first career?",
    options: [
      { value: "impact", label: "Meaningful impact, even if slower growth" },
      { value: "growth", label: "Fastest possible learning curve" },
      { value: "money", label: "Strong income within 5 years" },
      { value: "explore", label: "Exposure across many fields before committing" },
    ],
  },
];

export const SECTIONS: Section[] = [
  { id: "big_five", title: "Personality (Big Five)", description: "How your mind is wired.", kind: "likert", questions: bigFive },
  { id: "riasec", title: "Interests (RIASEC)", description: "The kinds of work that pull you in.", kind: "likert", questions: riasec },
  { id: "aptitude", title: "Cognitive Aptitude", description: "Quick check across five reasoning domains.", kind: "choice", questions: aptitude },
  { id: "values", title: "Values", description: "What must be true for work to feel right.", kind: "likert", questions: values },
  { id: "work_style", title: "Work Style", description: "How you like to operate day-to-day.", kind: "likert", questions: workStyle },
  { id: "emotional", title: "Emotional Intelligence", description: "How you handle self and others.", kind: "likert", questions: emotional },
  { id: "motivation", title: "Motivation", description: "What keeps you engaged long-term.", kind: "choice", questions: motivation },
  { id: "learning", title: "Learning Preferences", description: "How you absorb new information.", kind: "choice", questions: learning },
  { id: "goals", title: "Career Goals", description: "What outcome you want first.", kind: "choice", questions: goals },
];

export const TOTAL_QUESTIONS = SECTIONS.reduce((n, s) => n + s.questions.length, 0);

// Score summarizer — used both client-side (preview) and server-side (AI input).
export function summarizeResponses(responses: Record<string, number | string>) {
  const traitTotals: Record<string, { sum: number; count: number }> = {};
  const choices: Record<string, string> = {};
  const aptitudeScores: Record<string, number> = {};

  for (const section of SECTIONS) {
    for (const q of section.questions) {
      const raw = responses[q.id];
      if (raw == null) continue;
      if (section.kind === "likert") {
        const lq = q as LikertQuestion;
        const v = Number(raw);
        const score = lq.reverse ? 6 - v : v;
        const t = traitTotals[lq.trait] ??= { sum: 0, count: 0 };
        t.sum += score;
        t.count += 1;
      } else if (section.id === "aptitude") {
        const cq = q as ChoiceQuestion;
        const opt = cq.options.find((o) => o.value === raw);
        aptitudeScores[cq.trait] = opt?.score ?? 0;
      } else {
        choices[q.id] = String(raw);
      }
    }
  }

  const traitAvg: Record<string, number> = {};
  for (const [k, v] of Object.entries(traitTotals)) {
    traitAvg[k] = Math.round((v.sum / v.count) * 20); // 0..100
  }

  return { traitAvg, aptitudeScores, choices };
}
