import { createFileRoute, Link } from "@tanstack/react-router";
import { AppNav } from "@/components/app-nav";
import { CAREERS } from "@/lib/careers";

export const Route = createFileRoute("/_authenticated/careers/")({
  head: () => ({ meta: [
    { title: "Career experiences — PathNova" },
    { name: "description", content: "Test-drive 10 careers with realistic day-in-the-life simulations." },
    { property: "og:title", content: "Career experiences — PathNova" },
    { property: "og:description", content: "Test-drive 10 careers with realistic day-in-the-life simulations." },
    { name: "robots", content: "noindex" },
  ] }),
  component: CareersList,
});

function CareersList() {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Career experiences</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Try before you commit.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Each experience puts you in a realistic day-in-the-life scenario with decisions that reveal how you'd actually handle the work. You'll get AI feedback at the end.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CAREERS.map((c) => (
            <Link key={c.slug} to="/careers/$slug" params={{ slug: c.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-[var(--shadow-card)]">
              <div className="h-32" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)` }} />
              <div className="flex-1 p-5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.domain}</span>
                  <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest">{c.demand} demand</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">{c.salaryRange}</p>
                <p className="mt-4 text-xs font-medium text-primary group-hover:underline">Start experience →</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
