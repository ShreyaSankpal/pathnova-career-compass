import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AppNav } from "@/components/app-nav";
import { supabase } from "@/integrations/supabase/client";
import { SECTIONS, TOTAL_QUESTIONS, type LikertQuestion, type ChoiceQuestion } from "@/lib/assessment";
import { generateReport } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({ meta: [
    { title: "Assessment — PathNova" },
    { name: "description", content: "Your scientific career assessment across personality, interests, aptitude, values, and more." },
    { property: "og:title", content: "PathNova Assessment" },
    { property: "og:description", content: "Personality, interests, aptitude, values, EQ." },
    { name: "robots", content: "noindex" },
  ] }),
  component: AssessmentPage,
});

const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

function AssessmentPage() {
  const nav = useNavigate();
  const runReport = useServerFn(generateReport);

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [analyzing, setAnalyzing] = useState(false);

  const section = SECTIONS[sectionIdx];
  const question = section?.questions[qIdx];

  const answered = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answered / TOTAL_QUESTIONS) * 100);

  // Create / resume assessment
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: existing } = await supabase.from("assessments").select("*")
        .eq("user_id", u.user.id).eq("status", "in_progress").maybeSingle();
      if (existing) {
        setAssessmentId(existing.id);
        const { data: resps } = await supabase.from("assessment_responses").select("*").eq("assessment_id", existing.id);
        const a: Record<string, number | string> = {};
        for (const r of resps ?? []) a[r.question_id] = r.value_num ?? r.value_text ?? "";
        setAnswers(a);
      } else {
        const { data: created } = await supabase.from("assessments").insert({ user_id: u.user.id, status: "in_progress" }).select().single();
        if (created) setAssessmentId(created.id);
      }
    })();
  }, []);

  async function saveAnswer(value: number | string) {
    if (!assessmentId || !question) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    const isNum = typeof value === "number";
    await supabase.from("assessment_responses").upsert({
      assessment_id: assessmentId,
      user_id: u.user.id,
      section: section.id,
      question_id: question.id,
      value_num: isNum ? value : null,
      value_text: isNum ? null : String(value),
    }, { onConflict: "assessment_id,question_id" });

    // Advance
    setTimeout(() => next(), 150);
  }

  function next() {
    if (!section) return;
    if (qIdx < section.questions.length - 1) {
      setQIdx(qIdx + 1);
    } else if (sectionIdx < SECTIONS.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setQIdx(0);
    } else {
      finish();
    }
  }

  function prev() {
    if (qIdx > 0) setQIdx(qIdx - 1);
    else if (sectionIdx > 0) {
      const prevSec = SECTIONS[sectionIdx - 1];
      setSectionIdx(sectionIdx - 1);
      setQIdx(prevSec.questions.length - 1);
    }
  }

  async function finish() {
    if (!assessmentId) return;
    setAnalyzing(true);
    try {
      await supabase.from("assessments").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", assessmentId);
      const report = await runReport({ data: { assessmentId } });
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      await supabase.from("reports").insert({ user_id: u.user.id, assessment_id: assessmentId, data: report });
      toast.success("Your personalized report is ready.");
      nav({ to: "/report" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
      setAnalyzing(false);
    }
  }

  if (analyzing) return <AnalyzingScreen />;

  if (!section || !question) return null;

  const current = answers[question.id];

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Section {sectionIdx + 1} / {SECTIONS.length} · {section.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{answered} / {TOTAL_QUESTIONS}</p>
            <div className="mt-1 h-1 w-40 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <p className="font-mono text-xs text-muted-foreground">Q. {qIdx + 1} / {section.questions.length}</p>
          <h2 className="mt-4 text-2xl font-medium leading-snug">{question.text}</h2>

          <div className="mt-8">
            {section.kind === "likert" ? (
              <div className="grid grid-cols-5 gap-2">
                {LIKERT_LABELS.map((label, i) => {
                  const v = i + 1;
                  const active = current === v;
                  return (
                    <button key={v} onClick={() => saveAnswer(v)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/40 hover:bg-surface-2"}`}>
                      <span className="font-mono text-lg font-bold">{v}</span>
                      <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {(question as ChoiceQuestion).options.map((opt) => {
                  const active = current === opt.value;
                  return (
                    <button key={opt.value} onClick={() => saveAnswer(opt.value)}
                      className={`w-full rounded-xl border px-5 py-4 text-left text-sm transition-all ${active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/40 hover:bg-surface-2"}`}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev} disabled={sectionIdx === 0 && qIdx === 0}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            ← Back
          </button>
          {answered === TOTAL_QUESTIONS && (
            <button onClick={finish} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90">
              Finish & analyze
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function AnalyzingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
          <div className="size-4 animate-pulse rounded-full bg-primary" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Analyzing your profile</p>
        <h2 className="mt-3 text-2xl font-bold">Cross-referencing 60+ signals…</h2>
        <p className="mt-3 text-sm text-muted-foreground">Synthesizing your traits into a personalized report. This takes ~30 seconds.</p>
      </div>
    </div>
  );
}
