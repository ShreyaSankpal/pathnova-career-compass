import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppNav } from "@/components/app-nav";
import { supabase } from "@/integrations/supabase/client";
import type { ReportData } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({ meta: [
    { title: "Your report — PathNova" },
    { name: "description", content: "Your personalized PathNova report — personality, interests, aptitudes, values, and career recommendations." },
    { property: "og:title", content: "Your PathNova report" },
    { property: "og:description", content: "Your personalized career profile and recommendations." },
    { name: "robots", content: "noindex" },
  ] }),
  component: ReportPage,
});

function ReportPage() {
  const q = useQuery({
    queryKey: ["latest-report"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("reports").select("*, profiles!inner(full_name)").eq("user_id", u.user.id).order("generated_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  if (q.isLoading) return <Shell><p className="text-muted-foreground">Loading your report…</p></Shell>;

  const report = q.data?.data as ReportData | undefined;

  if (!report) {
    return <Shell>
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-muted-foreground">No report yet.</p>
        <Link to="/assessment" className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90">
          Take the assessment
        </Link>
      </div>
    </Shell>;
  }

  function printPdf() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <Shell>
      <div className="flex items-start justify-between print:hidden">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Personalized report</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Your career profile.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{report.summary}</p>
        </div>
        <button onClick={printPdf} className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium hover:bg-secondary">
          Export PDF
        </button>
      </div>

      {/* Profile blocks */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Block title="Personality" body={report.personality} />
        <Block title="Interests" body={report.interests} />
        <Block title="Aptitudes" body={report.aptitudes} />
        <Block title="Values" body={report.values} />
        <Block title="Learning style" body={report.learning_style} />
        <Block title="Communication style" body={report.communication_style} />
        <Block title="Leadership style" body={report.leadership_style} />
        <Block title="Motivations" body={report.motivations} />
        <Block title="Ideal work environment" body={report.work_environment} className="md:col-span-2" />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ListBlock title="Strengths" items={report.strengths} tone="accent" />
        <ListBlock title="Growth areas" items={report.growth_areas} tone="primary" />
      </div>

      {/* Recommendations */}
      <section className="mt-14">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Career recommendations</h2>
        <div className="mt-4 space-y-4">
          {report.recommendations.map((rec) => (
            <div key={rec.slug} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{rec.title}</h3>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold text-accent">{rec.match}% match</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Why it fits</p>
                      <ul className="mt-2 space-y-1.5 text-sm">
                        {rec.reasoning.map((r, i) => <li key={i}>• {r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Skill gaps to close</p>
                      <ul className="mt-2 space-y-1.5 text-sm">
                        {rec.skill_gaps.map((s, i) => <li key={i} className="text-muted-foreground">• {s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
                <Link to="/careers/$slug" params={{ slug: rec.slug }}
                  className="shrink-0 self-start rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-secondary">
                  Try simulation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mt-14">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Your roadmap</h2>
        <div className="mt-4 space-y-4">
          {report.roadmap.map((phase, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">{phase.phase}</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{phase.timeframe}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {phase.actions.map((a, j) => <li key={j} className="flex gap-3"><span className="text-accent">→</span>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-5xl px-6 py-10 print:py-0">{children}</main>
    </div>
  );
}

function Block({ title, body, className = "" }: { title: string; body: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>
      <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{body}</p>
    </div>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "primary" | "accent" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={tone === "accent" ? "text-accent" : "text-primary"}>◆</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
