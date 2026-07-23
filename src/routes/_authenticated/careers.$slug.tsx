import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AppNav } from "@/components/app-nav";
import { CAREER_BY_SLUG } from "@/lib/careers";
import { supabase } from "@/integrations/supabase/client";
import { generateCareerFeedback } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/careers/$slug")({
  head: ({ params }) => {
    const c = CAREER_BY_SLUG[params.slug];
    const title = c ? `${c.title} — PathNova experience` : "Career — PathNova";
    const desc = c ? `${c.tagline} Salary range ${c.salaryRange}. ${c.demand} demand. Try the day-in-the-life simulation.` : "Career simulation";
    return { meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { name: "robots", content: "noindex" },
    ] };
  },
  loader: ({ params }) => {
    const career = CAREER_BY_SLUG[params.slug];
    if (!career) throw notFound();
    return { career };
  },
  component: CareerPage,
  notFoundComponent: () => <CareerMissing />,
});

function CareerMissing() {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-destructive">Not found</p>
        <h1 className="mt-3 text-2xl font-bold">That career doesn't exist yet.</h1>
        <Link to="/careers" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
          Browse all careers
        </Link>
      </main>
    </div>
  );
}

type Feedback = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof generateCareerFeedback>>>>;

function CareerPage() {
  const { career } = Route.useLoaderData();
  const runFeedback = useServerFn(generateCareerFeedback);
  const [phase, setPhase] = useState<"overview" | "sim" | "result">("overview");
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [decisions, setDecisions] = useState<{ id: string; value: string; label: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<Feedback | null>(null);

  async function toggleSaved() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (saved) {
      await supabase.from("saved_careers").delete().eq("user_id", u.user.id).eq("career_slug", career.slug);
    } else {
      await supabase.from("saved_careers").insert({ user_id: u.user.id, career_slug: career.slug });
    }
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Saved to your dashboard");
  }

  function pick(opt: { value: string; label: string }) {
    const d = career.scenario.decisions[decisionIdx];
    const next = [...decisions, { id: d.id, value: opt.value, label: opt.label }];
    setDecisions(next);
    if (decisionIdx < career.scenario.decisions.length - 1) {
      setDecisionIdx(decisionIdx + 1);
    } else {
      finish(next);
    }
  }

  async function finish(all: typeof decisions) {
    setBusy(true);
    try {
      const out = await runFeedback({ data: { careerSlug: career.slug, decisions: all } });
      setResult(out);
      setPhase("result");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Feedback failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="h-40 rounded-2xl" style={{ background: `linear-gradient(135deg, ${career.color}, ${career.color}aa)` }} />
        <div className="-mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{career.domain}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">{career.title}</h1>
              <p className="mt-2 text-muted-foreground">{career.tagline}</p>
            </div>
            <button onClick={toggleSaved}
              className={`rounded-full border px-4 py-2 text-xs font-medium ${saved ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-secondary"}`}>
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {phase === "overview" && <Overview career={career} onStart={() => setPhase("sim")} />}
        {phase === "sim" && (
          <SimStep
            career={career}
            decisionIdx={decisionIdx}
            busy={busy}
            onPick={pick}
          />
        )}
        {phase === "result" && result && <Result feedback={result} careerColor={career.color} />}
      </main>
    </div>
  );
}

function Overview({ career, onStart }: { career: ReturnType<typeof Route.useLoaderData>["career"]; onStart: () => void }) {
  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Salary" value={career.salaryRange} />
        <Stat label="Demand" value={career.demand} />
        <Stat label="Core skills" value={String(career.coreSkills.length)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Education path</h2>
        <ol className="mt-4 space-y-3">
          {career.educationPath.map((p, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">{i + 1}</span>
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Core skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {career.coreSkills.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs">{s}</span>)}
        </div>
      </div>

      <button onClick={onStart} className="w-full rounded-full bg-foreground py-4 text-sm font-medium text-background hover:bg-foreground/90">
        Start day-in-the-life simulation →
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function SimStep({ career, decisionIdx, busy, onPick }: {
  career: ReturnType<typeof Route.useLoaderData>["career"];
  decisionIdx: number;
  busy: boolean;
  onPick: (opt: { value: string; label: string }) => void;
}) {
  const d = career.scenario.decisions[decisionIdx];
  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Scene {decisionIdx + 1} / {career.scenario.decisions.length}
        </p>
        {decisionIdx === 0 && <p className="mt-3 text-sm italic text-muted-foreground">{career.scenario.intro}</p>}
        <p className="mt-4 text-lg leading-relaxed">{d.scene}</p>
        <p className="mt-6 font-semibold">{d.prompt}</p>
        <div className="mt-6 space-y-3">
          {d.options.map((opt) => (
            <button key={opt.value} disabled={busy} onClick={() => onPick(opt)}
              className="w-full rounded-xl border border-border bg-card px-5 py-4 text-left text-sm transition-all hover:border-primary/40 hover:bg-surface-2 disabled:opacity-50">
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {busy && <p className="mt-6 text-center text-sm text-muted-foreground">AI coach is reviewing your run…</p>}
    </div>
  );
}

function Result({ feedback, careerColor }: { feedback: Feedback; careerColor: string }) {
  return (
    <div className="mt-10 space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-6" style={{ background: `linear-gradient(135deg, ${careerColor}22, transparent)` }}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Coach feedback</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="text-4xl font-bold">{feedback.score}<span className="text-xl text-muted-foreground">/100</span></div>
            <p className="text-lg font-semibold">{feedback.headline}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed">{feedback.feedback}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Strengths shown</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Patterns to grow</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {feedback.watchouts.map((w, i) => <li key={i} className="text-muted-foreground">• {w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Link to="/careers" className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium hover:bg-secondary">Try another career</Link>
        <Link to="/dashboard" className="flex-1 rounded-full bg-foreground py-3 text-center text-sm font-medium text-background hover:bg-foreground/90">Back to dashboard</Link>
      </div>
    </div>
  );
}
