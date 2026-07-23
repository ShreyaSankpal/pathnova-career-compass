import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PathNova — Find your career north star" },
      { name: "description", content: "Scientific psychometrics + AI to match students with careers they'll thrive in. Assessment, personalized report, and immersive career simulations." },
      { property: "og:title", content: "PathNova — Find your career north star" },
      { property: "og:description", content: "Scientific psychometrics + AI to match students with careers they'll thrive in." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <MarketingNav />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="flex flex-col items-center pt-24 pb-20 text-center">
          <span className="animate-reveal mb-6 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Scientific discovery engine</span>
          <h1 className="animate-reveal max-w-[850px] text-balance text-5xl font-extrabold tracking-tight md:text-7xl" style={{ animationDelay: "80ms" }}>
            Find your center in the <span className="text-primary">modern economy.</span>
          </h1>
          <p className="animate-reveal mt-8 max-w-[600px] text-balance text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "160ms" }}>
            PathNova uses high-fidelity psychometrics and AI to align your cognitive DNA with the careers that actually demand it.
          </p>
          <div className="animate-reveal mt-10 flex gap-3" style={{ animationDelay: "240ms" }}>
            <Link to="/auth" search={{ mode: "signup" }} className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90">
              Start free assessment
            </Link>
            <a href="#assessment" className="rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-secondary">
              See how it works
            </a>
          </div>

          <div className="animate-reveal mt-20 w-full max-w-[960px]" style={{ animationDelay: "320ms" }}>
            <DashboardPreview />
          </div>
        </section>

        {/* Feature highlights */}
        <section className="grid gap-12 border-t border-border py-24 md:grid-cols-3">
          <Feature title="Precision Aptitude" tint="bg-primary/5 ring-primary/20" dot="bg-primary"
            desc="Big Five, RIASEC, spatial, logical, numerical, verbal, and abstract reasoning — measured, not guessed." />
          <Feature title="Explainable Matches" tint="bg-accent/5 ring-accent/20" dot="bg-accent"
            desc="Every recommendation shows why it fits you, mapped to your trait scores and values." />
          <Feature title="Live Simulation" tint="bg-foreground/5 ring-foreground/20" dot="bg-foreground"
            desc="Test-drive 10 careers with realistic day-in-the-life scenarios before you commit." />
        </section>

        {/* Assessment */}
        <section id="assessment" className="border-t border-border py-24">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">01 / Assessment</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">A telescope for your talent.</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Nine scientific sections — from Big Five personality to work values and emotional intelligence — combined into one high-signal profile in under 20 minutes.
              </p>
              <div className="mt-8 flex gap-3">
                <div className="h-1 w-12 rounded-full bg-primary" />
                <div className="h-1 w-12 rounded-full bg-secondary" />
                <div className="h-1 w-12 rounded-full bg-secondary" />
                <div className="h-1 w-12 rounded-full bg-secondary" />
              </div>
            </div>
            <QuestionCard />
          </div>
        </section>

        {/* Discovery */}
        <section id="discovery" className="border-t border-border py-24">
          <div className="mb-16 flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">02 / Discovery</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Your north star.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-12">
            <RecommendationCard />
            <ExperienceTile />
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-6 border-t border-border py-12 md:flex-row">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">© PathNova {new Date().getFullYear()}</span>
          <div className="flex gap-8 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-foreground">Methodology</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">For schools</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Feature({ title, desc, tint, dot }: { title: string; desc: string; tint: string; dot: string }) {
  return (
    <div className="space-y-4">
      <div className={`flex size-10 items-center justify-center rounded-lg ring-1 ${tint}`}>
        <div className={`size-4 rounded-sm ${dot}`} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-secondary" />
          <div className="size-2.5 rounded-full bg-secondary" />
          <div className="size-2.5 rounded-full bg-secondary" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">REPORT / VISUALIZATION</span>
      </div>
      <div className="grid grid-cols-3 gap-4 p-6">
        {[
          { label: "Investigative", value: 92 },
          { label: "Openness", value: 88 },
          { label: "Analytical", value: 84 },
          { label: "Empathy", value: 71 },
          { label: "Autonomy", value: 86 },
          { label: "Mastery", value: 91 },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{t.label}</p>
            <p className="mt-2 text-2xl font-bold">{t.value}</p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${t.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Top match</p>
            <p className="mt-1 text-lg font-semibold">Data Scientist · 94% match</p>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">+ 4 more</div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">Q. 14 / 60</span>
        <span className="text-[11px] font-bold text-primary">APTITUDE BLOCK</span>
      </div>
      <p className="text-xl font-medium leading-snug">
        When presented with an unstructured dataset, do you instinctively look for chronological patterns or hierarchical groupings?
      </p>
      <div className="mt-10 space-y-3">
        <button className="w-full rounded-xl border border-border px-5 py-4 text-left text-sm font-medium hover:border-primary/50 hover:bg-primary/[0.02]">
          Chronological patterns
        </button>
        <button className="w-full rounded-xl border border-border bg-secondary px-5 py-4 text-left text-sm font-medium ring-1 ring-foreground/5">
          Hierarchical groupings
        </button>
      </div>
    </div>
  );
}

function RecommendationCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:col-span-7">
      <div className="flex-1 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">Systems Architect</h3>
            <p className="mt-1 text-muted-foreground">Engineering & Design</p>
          </div>
          <MatchRing pct={98} />
        </div>
        <div className="mt-10">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Why this fits you</h4>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3"><span className="text-accent">•</span><span>Your <strong>high abstract reasoning</strong> aligns with the structural modeling required.</span></li>
            <li className="flex gap-3"><span className="text-accent">•</span><span>Preference for <strong>Investigative / Realistic</strong> roles matches the theory-and-execution balance.</span></li>
            <li className="flex gap-3"><span className="text-accent">•</span><span>Values <strong>Autonomy</strong> and <strong>Mastery</strong>, key drivers for senior architecture positions.</span></li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border bg-surface-2 px-8 py-4">
        <span className="text-[12px] font-medium text-muted-foreground">Salary Range: $140k – $220k</span>
        <span className="text-[12px] font-bold text-primary">View roadmap →</span>
      </div>
    </div>
  );
}

function MatchRing({ pct }: { pct: number }) {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative size-20">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r="30" strokeWidth="6" fill="none" className="stroke-secondary" />
        <circle cx="36" cy="36" r="30" strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="stroke-accent transition-all" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{pct}%</span>
        <span className="font-mono text-[8px] uppercase text-muted-foreground">Match</span>
      </div>
    </div>
  );
}

function ExperienceTile() {
  return (
    <div id="experience" className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:col-span-5">
      <div className="relative aspect-video w-full overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.7 0.2 262 / 0.6), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.72 0.148 165 / 0.5), transparent 50%)"
        }} />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-background/70">Experience module</span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded bg-foreground px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-background">SIM</span>
          <span className="font-mono text-[11px] uppercase text-muted-foreground">25 min</span>
        </div>
        <h4 className="text-lg font-bold">Scale-Up Simulation</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Manage a virtual infrastructure failing under heavy load. Test your instinct for structural resilience.
        </p>
        <Link to="/auth" search={{ mode: "signup" }} className="mt-6 block rounded-lg border border-border py-2.5 text-center text-sm font-semibold hover:bg-secondary">
          Start experience
        </Link>
      </div>
    </div>
  );
}
