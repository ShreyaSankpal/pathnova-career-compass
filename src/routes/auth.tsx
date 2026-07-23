import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/logo";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — PathNova" },
      { name: "description", content: "Sign in or create your PathNova account to start your career discovery." },
      { property: "og:title", content: "Sign in — PathNova" },
      { property: "og:description", content: "Sign in or create your PathNova account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Redirecting…");
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) { toast.error(res.error.message); return; }
    if (res.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-surface-2 p-10 md:flex">
        <Link to="/"><Logo /></Link>
        <div className="max-w-md space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Assessment · Discovery · Simulation</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            The most sophisticated career discovery engine built for students.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Big Five personality, RIASEC interests, aptitude across five reasoning domains, values, EQ, and a personalized report that actually explains itself.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">© PathNova {new Date().getFullYear()}</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8"><Link to="/"><Logo /></Link></div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "Start your career discovery in under 20 minutes." : "Sign in to continue your discovery."}
          </p>

          <button
            onClick={google}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-secondary"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-xs font-medium">Full name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Password</label>
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button disabled={busy} type="submit"
              className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60">
              {busy ? "Working…" : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to PathNova? "}
            <Link to="/auth" search={{ mode: isSignup ? "signin" : "signup" }} className="font-medium text-foreground hover:underline">
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
