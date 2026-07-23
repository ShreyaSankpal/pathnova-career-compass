// 10 Career Experience modules. Each career has a day-in-the-life scenario with
// decision points that produce feedback and a skill score.

export type CareerDecision = {
  id: string;
  scene: string;
  prompt: string;
  options: {
    value: string;
    label: string;
    // per-trait signal produced by this choice
    signal: string;
    // rubric: what a strong pick looks like — the highest weight is "ideal"
    weight: number;
  }[];
};

export type Career = {
  slug: string;
  title: string;
  tagline: string;
  color: string;                         // background hex for tile
  domain: string;
  salaryRange: string;
  demand: "Very High" | "High" | "Moderate";
  educationPath: string[];
  coreSkills: string[];
  matchTraits: string[];                 // trait keys that fit
  scenario: {
    intro: string;
    decisions: CareerDecision[];
  };
};

export const CAREERS: Career[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer",
    tagline: "Build the systems the world runs on.",
    color: "#0066FF",
    domain: "Technology",
    salaryRange: "$85k – $220k",
    demand: "Very High",
    educationPath: [
      "CS fundamentals: data structures, algorithms, discrete math",
      "Full-stack project portfolio in a modern stack (TypeScript, React, Node)",
      "Internship or open-source contribution",
      "Bachelor's in CS/related, or accredited bootcamp + strong portfolio",
    ],
    coreSkills: ["Programming", "Systems thinking", "Debugging", "Collaboration"],
    matchTraits: ["investigative", "conventional", "mastery", "deep_focus"],
    scenario: {
      intro: "Monday, 9:14 AM. A senior engineer pings you: 'Checkout is failing intermittently for ~2% of users. Can you take point?'",
      decisions: [
        {
          id: "d1",
          scene: "You open the error dashboard and see 47 stack traces across 3 services in the last hour.",
          prompt: "What's your first move?",
          options: [
            { value: "reproduce", label: "Try to reproduce the failure locally with a real user's session id.", signal: "diagnostic_rigor", weight: 3 },
            { value: "revert", label: "Revert last night's deploy immediately and investigate after.", signal: "risk_aversion", weight: 1 },
            { value: "guess", label: "Push a hotfix based on the most common stack trace.", signal: "speed_over_care", weight: 0 },
            { value: "escalate", label: "Loop in the on-call engineer and the product manager.", signal: "collaboration", weight: 2 },
          ],
        },
        {
          id: "d2",
          scene: "You've isolated it to a race condition in the payment service under peak load.",
          prompt: "How do you ship a fix?",
          options: [
            { value: "mutex", label: "Add a distributed lock, write a load test, deploy with a feature flag.", signal: "engineering_discipline", weight: 3 },
            { value: "retry", label: "Add retries — the payment library will handle it.", signal: "shortcut", weight: 0 },
            { value: "rewrite", label: "Rewrite the whole payment service properly this quarter.", signal: "scope_creep", weight: 1 },
            { value: "queue", label: "Move payment writes to a queue so they can't race.", signal: "architectural_thinking", weight: 3 },
          ],
        },
        {
          id: "d3",
          scene: "It's 4 PM. Fix deployed, no new errors. Your teammate wants your code review on their pull request.",
          prompt: "How do you respond?",
          options: [
            { value: "careful", label: "Review it carefully now — small reviews compound into team velocity.", signal: "team_first", weight: 3 },
            { value: "tomorrow", label: "Ask them to wait until tomorrow, you need to decompress.", signal: "self_care", weight: 2 },
            { value: "skim", label: "Skim and approve — you trust their judgment.", signal: "shortcut", weight: 0 },
          ],
        },
      ],
    },
  },
  {
    slug: "doctor",
    title: "Doctor",
    tagline: "Heal, diagnose, and stand at the front line of human wellbeing.",
    color: "#10B981",
    domain: "Medicine & Health",
    salaryRange: "$220k – $500k+",
    demand: "Very High",
    educationPath: [
      "Strong biology + chemistry through high school",
      "Undergraduate pre-med (biology, biochem, or related)",
      "MCAT + medical school (4 years)",
      "Residency (3–7 years) + optional fellowship",
    ],
    coreSkills: ["Diagnostic reasoning", "Empathy", "Precision", "Emotional stamina"],
    matchTraits: ["investigative", "social", "impact", "conscientiousness"],
    scenario: {
      intro: "It's 7:20 AM in the ER. A patient arrives with chest pain, sweating, and shortness of breath.",
      decisions: [
        { id: "d1", scene: "The nurse hands you initial vitals: BP 165/95, HR 118, SpO2 96%.",
          prompt: "First order of investigation?",
          options: [
            { value: "ecg", label: "12-lead ECG + troponin panel immediately.", signal: "clinical_priority", weight: 3 },
            { value: "history", label: "Take a 20-minute detailed history first.", signal: "slow", weight: 1 },
            { value: "morphine", label: "Give morphine for the pain, then decide.", signal: "risky", weight: 0 },
            { value: "consult", label: "Page cardiology and wait.", signal: "over-caution", weight: 1 },
          ],
        },
        { id: "d2", scene: "ECG shows ST-elevation. The patient is anxious and asks: 'Am I going to die?'",
          prompt: "How do you respond?",
          options: [
            { value: "honest", label: "Calmly explain: 'You're having a heart attack. We know exactly what to do and we're moving fast.'", signal: "empathy_clarity", weight: 3 },
            { value: "shield", label: "'Don't worry, everything is fine.'", signal: "dishonest_comfort", weight: 0 },
            { value: "silent", label: "Focus on treatment, address it later.", signal: "task-only", weight: 1 },
          ],
        },
      ],
    },
  },
  {
    slug: "lawyer",
    title: "Lawyer",
    tagline: "Turn language into leverage. Argue, negotiate, and protect.",
    color: "#7C3AED",
    domain: "Law & Policy",
    salaryRange: "$90k – $300k+",
    demand: "High",
    educationPath: ["Undergraduate degree in any field", "LSAT + Law school (JD, 3 years)", "Bar exam", "Associate → Partner track or in-house counsel"],
    coreSkills: ["Argument construction", "Research", "Writing", "Composure under pressure"],
    matchTraits: ["verbal", "enterprising", "conscientiousness", "prestige"],
    scenario: {
      intro: "A startup client emails you at 11 PM: a former co-founder is threatening to sue over IP ownership.",
      decisions: [
        { id: "d1", scene: "You have their original founder agreement, but the IP assignment clause is ambiguous.",
          prompt: "First step?",
          options: [
            { value: "docs", label: "Pull every document, commit history, and Slack export before responding.", signal: "evidence_first", weight: 3 },
            { value: "call", label: "Call the ex-founder to feel out their position.", signal: "diplomacy", weight: 2 },
            { value: "letter", label: "Send a firm cease-and-desist letter right away.", signal: "aggressive", weight: 0 },
          ],
        },
      ],
    },
  },
  {
    slug: "architect",
    title: "Architect",
    tagline: "Shape how humans live inside space.",
    color: "#F59E0B",
    domain: "Design & Build",
    salaryRange: "$70k – $180k",
    demand: "Moderate",
    educationPath: ["B.Arch or M.Arch (accredited)", "Architectural internship (2–3 years)", "Licensing exam (ARE)", "Firm practice or independent studio"],
    coreSkills: ["Spatial reasoning", "Client communication", "CAD/BIM", "Aesthetic judgement"],
    matchTraits: ["spatial", "artistic", "realistic", "creativity"],
    scenario: {
      intro: "A young couple wants a 1,400 sq ft home on a sloped, tree-covered lot. Budget: modest. Wishlist: ambitious.",
      decisions: [
        { id: "d1", scene: "Their must-haves add up to about 2,000 sq ft.",
          prompt: "How do you respond in the first meeting?",
          options: [
            { value: "honest", label: "Show them what 1,400 sq ft actually looks like with three real precedents.", signal: "grounded", weight: 3 },
            { value: "yes", label: "Say yes to everything and figure it out later.", signal: "people-pleaser", weight: 0 },
            { value: "reframe", label: "Reframe the brief around how they'll actually live in the space.", signal: "insight", weight: 3 },
          ],
        },
      ],
    },
  },
  {
    slug: "entrepreneur",
    title: "Entrepreneur",
    tagline: "Start something the world doesn't have yet.",
    color: "#EF4444",
    domain: "Business & Startups",
    salaryRange: "Volatile ($0 – $millions)",
    demand: "High",
    educationPath: ["Any degree (or none) — output > credentials", "Build something people pay for, small or big", "Learn sales, product, and finance in the field", "Optional: accelerator (YC, Techstars)"],
    coreSkills: ["Selling", "Prioritization", "Resilience", "Storytelling"],
    matchTraits: ["enterprising", "openness", "autonomy", "impact"],
    scenario: {
      intro: "Three months into your startup. You have $18k in the bank, 40 beta users, and no paying customer yet.",
      decisions: [
        { id: "d1", scene: "A user offers to pay $1,200/year if you build one specific feature they need.",
          prompt: "What do you do?",
          options: [
            { value: "build", label: "Build it — one paying customer changes everything.", signal: "customer_led", weight: 3 },
            { value: "poll", label: "Ask your other 39 users if they'd want it too, then decide.", signal: "signal_seeking", weight: 2 },
            { value: "vision", label: "Stick to your roadmap; this is a distraction.", signal: "rigid", weight: 0 },
          ],
        },
      ],
    },
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    tagline: "Turn messy data into decisions.",
    color: "#0EA5E9",
    domain: "Technology & Analytics",
    salaryRange: "$95k – $210k",
    demand: "Very High",
    educationPath: ["Strong math (stats, linear algebra, probability)", "Python + SQL + one visualization library", "Kaggle or portfolio projects", "BS/MS in stats, CS, or applied math"],
    coreSkills: ["Statistical thinking", "Programming", "Communication of findings"],
    matchTraits: ["investigative", "numerical", "abstract", "mastery"],
    scenario: {
      intro: "Product asks: 'Users are churning after week 2. Why?' You have 6M events across 12 tables.",
      decisions: [
        { id: "d1", scene: "You could jump to modeling — or start with descriptives.",
          prompt: "First move?",
          options: [
            { value: "descriptive", label: "Plot the retention curve and segment by acquisition channel.", signal: "sound_stats", weight: 3 },
            { value: "model", label: "Train a churn classifier and look at feature importance.", signal: "premature_modeling", weight: 1 },
            { value: "interview", label: "Ask product to interview 10 churned users first.", signal: "mixed_methods", weight: 2 },
          ],
        },
      ],
    },
  },
  {
    slug: "ux-designer",
    title: "UX Designer",
    tagline: "Design products that feel obvious.",
    color: "#EC4899",
    domain: "Design & Product",
    salaryRange: "$75k – $170k",
    demand: "High",
    educationPath: ["Design fundamentals (typography, hierarchy, color)", "Figma + a portfolio of 3–5 case studies", "Learn user research methods", "Degree in design, HCI, or self-taught with portfolio"],
    coreSkills: ["Empathy", "Visual craft", "Prototyping", "Communication"],
    matchTraits: ["artistic", "social", "creativity", "empathy"],
    scenario: {
      intro: "A stakeholder demands the CTA button be red 'because red converts.' You have 5 days until launch.",
      decisions: [
        { id: "d1", scene: "You disagree — red would clash with the brand's calm palette.",
          prompt: "How do you handle it?",
          options: [
            { value: "test", label: "Propose a small A/B test of two versions during launch week.", signal: "evidence_led", weight: 3 },
            { value: "comply", label: "Change it — stakeholders make final calls.", signal: "conflict_avoidant", weight: 0 },
            { value: "reframe", label: "Ask what problem they're really trying to solve. Maybe it's not the color.", signal: "designer_thinking", weight: 3 },
          ],
        },
      ],
    },
  },
  {
    slug: "psychologist",
    title: "Psychologist",
    tagline: "Understand minds and help people build better ones.",
    color: "#8B5CF6",
    domain: "Mental Health & Research",
    salaryRange: "$70k – $150k",
    demand: "High",
    educationPath: ["Bachelor's in psychology", "Master's or Doctorate (PsyD/PhD)", "Supervised clinical hours", "Licensing exam (EPPP)"],
    coreSkills: ["Listening", "Ethical judgement", "Research literacy", "Presence"],
    matchTraits: ["social", "empathy", "investigative", "self_awareness"],
    scenario: {
      intro: "A first-time client sits down, arms folded. 'I don't really believe in this, but my partner made me come.'",
      decisions: [
        { id: "d1", scene: "You have 50 minutes.",
          prompt: "How do you open?",
          options: [
            { value: "acknowledge", label: "Acknowledge their skepticism honestly and let them set the pace.", signal: "attunement", weight: 3 },
            { value: "convince", label: "Explain why therapy works, citing research.", signal: "expert_stance", weight: 1 },
            { value: "structure", label: "Start the intake form immediately to build structure.", signal: "procedural", weight: 1 },
          ],
        },
      ],
    },
  },
  {
    slug: "pilot",
    title: "Pilot",
    tagline: "Hold responsibility for hundreds of lives at 35,000 feet.",
    color: "#0891B2",
    domain: "Aviation",
    salaryRange: "$80k – $350k",
    demand: "High",
    educationPath: ["Private Pilot License → Instrument Rating → Commercial License", "1,500 flight hours (ATP)", "Type rating for specific aircraft", "Airline training program"],
    coreSkills: ["Situational awareness", "Discipline", "Calm under pressure", "Precision"],
    matchTraits: ["conscientiousness", "self_regulation", "spatial", "realistic"],
    scenario: {
      intro: "Cruise at FL370. Cabin crew reports smoke from the rear galley.",
      decisions: [
        { id: "d1", scene: "You're 80 minutes from your destination and 25 minutes from a diversion airport.",
          prompt: "First action?",
          options: [
            { value: "checklist", label: "Run the QRH smoke checklist, declare emergency, plan diversion.", signal: "protocol", weight: 3 },
            { value: "continue", label: "Continue — smoke may clear.", signal: "unsafe", weight: 0 },
            { value: "descend", label: "Immediate rapid descent without diversion.", signal: "reactive", weight: 1 },
          ],
        },
      ],
    },
  },
  {
    slug: "teacher",
    title: "Teacher",
    tagline: "Shape the next generation — one classroom at a time.",
    color: "#22C55E",
    domain: "Education",
    salaryRange: "$45k – $95k",
    demand: "High",
    educationPath: ["Bachelor's in education or a subject + teaching credential", "Student teaching (1 semester)", "State certification", "Continuing education / Master's often required"],
    coreSkills: ["Communication", "Patience", "Curriculum design", "Classroom management"],
    matchTraits: ["social", "impact", "conscientiousness", "empathy"],
    scenario: {
      intro: "Fourth period, Friday. A bright student who's usually engaged has been silent all week.",
      decisions: [
        { id: "d1", scene: "The bell rings.",
          prompt: "What do you do?",
          options: [
            { value: "ask", label: "Ask them to stay one minute after class — check in privately.", signal: "attuned", weight: 3 },
            { value: "email", label: "Email their parents that afternoon.", signal: "escalatory", weight: 1 },
            { value: "wait", label: "Give them space; they'll come around.", signal: "hands-off", weight: 0 },
          ],
        },
      ],
    },
  },
];

export const CAREER_BY_SLUG: Record<string, Career> = Object.fromEntries(CAREERS.map((c) => [c.slug, c]));
