import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/app-nav";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [
    { title: "Set up your profile — PathNova" },
    { name: "description", content: "Tell PathNova about your studies so we can personalize your career roadmap." },
    { property: "og:title", content: "Set up your profile — PathNova" },
    { property: "og:description", content: "Personalize your PathNova experience." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Onboarding,
});

const EDU_LEVELS = ["High school", "Undergraduate", "Graduate", "Recent graduate", "Other"];

function Onboarding() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("Undergraduate");
  const [year, setYear] = useState("");
  const [age, setAge] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function addInterest() {
    const v = interestInput.trim();
    if (!v || interests.includes(v) || interests.length >= 8) return;
    setInterests([...interests, v]);
    setInterestInput("");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase.from("profiles").update({
        full_name: fullName || null,
        education_level: education,
        current_class_or_year: year || null,
        age: age ? Number(age) : null,
        interests,
        onboarded: true,
      }).eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile saved. Let's begin your assessment.");
      nav({ to: "/assessment" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Step 1 / 3 · Onboarding</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">A little about you.</h1>
        <p className="mt-2 text-muted-foreground">Two minutes now saves us hours of guesswork later.</p>

        <form onSubmit={submit} className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Field label="Full name">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Education level">
              <select value={education} onChange={(e) => setEducation(e.target.value)} className="input">
                {EDU_LEVELS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </Field>
            <Field label="Current class / year">
              <input placeholder="e.g. Class 12, Sophomore, Year 2" value={year} onChange={(e) => setYear(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Age (optional)">
            <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} className="input" />
          </Field>
          <Field label="Interests (up to 8)">
            <div className="flex gap-2">
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); }}}
                placeholder="Type an interest and press Enter"
                className="input flex-1" />
              <button type="button" onClick={addInterest} className="rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary">Add</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
                  {i}
                  <button type="button" onClick={() => setInterests(interests.filter((x) => x !== i))} className="text-muted-foreground hover:text-foreground">×</button>
                </span>
              ))}
            </div>
          </Field>

          <button disabled={busy} className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-60">
            {busy ? "Saving…" : "Save & start assessment"}
          </button>
        </form>
      </main>
      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--card);padding:0.6rem 0.75rem;border-radius:0.5rem;font-size:0.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
