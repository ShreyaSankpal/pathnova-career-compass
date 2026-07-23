import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppNav } from "@/components/app-nav";
import { supabase } from "@/integrations/supabase/client";
import { CAREERS } from "@/lib/careers";
import type { ReportData } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Your dashboard — PathNova" },
    { name: "description", content: "Your PathNova career dashboard: assessments, saved careers, roadmap, and recommendations." },
    { property: "og:title", content: "Your PathNova dashboard" },
    { property: "og:description", content: "Assessments, saved careers, roadmap, and AI recommendations." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", u.user.id).maybeSingle();
      return data;
    },
  });

  const latestReport = useQuery({
    queryKey: ["latest-report"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("reports").select("*").eq("user_id", u.user.id).order("generated_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  const savedCareers = useQuery({
    queryKey: ["saved-careers"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase.from("saved_careers").select("career_slug").eq("user_id", u.user.id);
      return data ?? [];
    },
  });

  const experienceRuns = useQuery({
    queryKey: ["experience-runs"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase.from("career_experience_progress").select("*").eq("user_id", u.user.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const reportData = latestReport.data?.data as ReportData | undefined;
  const topRecs = reportData?.recommendations?.slice(0, 3) ?? [];
  const savedSlugs = new Set((savedCareers.data ?? []).map((s) => s.career_slug));

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Discovery dashboard</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Welcome{profile.data?.full_name ? `, ${profile.data.full_name.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-2 text-muted-foreground">
              {reportData ? "Your report is ready — explore your matches, or run a career simulation." : "Take your assessment to unlock your personalized report and career matches."}
            </p>
          </div>
          <div className="flex gap-3">
            {!reportData && (
              <Link to="/assessment" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90">
                Start assessment
              </Link>
            )}
            {reportData && (
              <Link to="/report" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90">
                View report
              </Link>
            )}
          </div>
        </div>

        {/* Top matches */}
        <section className="mt-10">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground">Top matches</h2>
          {topRecs.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {topRecs.map((rec) => (
                <Link key={rec.slug} to="/careers/$slug" params={{ slug: rec.slug }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card)]">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">{rec.title}</h3>
                    <span className="font-mono text-sm font-bold text-accent">{rec.match}%</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {rec.reasoning.slice(0, 2).map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                  <p className="mt-4 text-xs font-medium text-primary group-hover:underline">Run simulation →</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyCard text="Complete your assessment to unlock personalized career matches." cta="Start assessment" to="/assessment" />
          )}
        </section>

        {/* Explore all careers */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground">Explore career experiences</h2>
            <Link to="/careers" className="text-xs font-medium text-primary hover:underline">See all →</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {CAREERS.slice(0, 5).map((c) => (
              <Link key={c.slug} to="/careers/$slug" params={{ slug: c.slug }}
                className="rounded-xl border border-border bg-card p-4 hover:bg-surface-2">
                <div className="mb-3 h-10 w-10 rounded-lg" style={{ background: c.color }} />
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.domain}</p>
                {savedSlugs.has(c.slug) && <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-widest text-accent">Saved</span>}
              </Link>
            ))}
          </div>
        </section>

        {/* Roadmap + history */}
        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground">Your roadmap</h2>
            {reportData?.roadmap?.length ? (
              <ol className="mt-4 space-y-4">
                {reportData.roadmap.slice(0, 3).map((phase, i) => (
                  <li key={i} className="border-l-2 border-primary/40 pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{phase.timeframe}</p>
                    <p className="mt-1 font-semibold">{phase.phase}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {phase.actions.slice(0, 3).map((a, j) => <li key={j}>• {a}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-3 text-sm text-muted-foreground">Your personalized roadmap will appear here after you complete your assessment.</p>}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-muted-foreground">Simulation history</h2>
            {experienceRuns.data && experienceRuns.data.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {experienceRuns.data.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold capitalize">{r.career_slug.replace(/-/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-accent">{r.score}%</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-muted-foreground">No simulations run yet. Pick a career above and try one — it takes 5 minutes.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

function EmptyCard({ text, cta, to }: { text: string; cta: string; to: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link to={to} className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90">
        {cta}
      </Link>
    </div>
  );
}
