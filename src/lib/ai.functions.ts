import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";
import { SECTIONS, summarizeResponses } from "./assessment";
import { CAREERS } from "./careers";

const ReportSchema = z.object({
  summary: z.string(),
  personality: z.string(),
  strengths: z.array(z.string()),
  growth_areas: z.array(z.string()),
  interests: z.string(),
  aptitudes: z.string(),
  values: z.string(),
  learning_style: z.string(),
  communication_style: z.string(),
  leadership_style: z.string(),
  motivations: z.string(),
  work_environment: z.string(),
  recommendations: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      match: z.number(),
      reasoning: z.array(z.string()),
      skill_gaps: z.array(z.string()),
    })
  ),
  roadmap: z.array(
    z.object({
      phase: z.string(),
      timeframe: z.string(),
      actions: z.array(z.string()),
    })
  ),
});

export type ReportData = z.infer<typeof ReportSchema>;

export const generateReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { assessmentId: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Load responses
    const { data: responses, error: respErr } = await supabase
      .from("assessment_responses")
      .select("question_id, value_num, value_text")
      .eq("assessment_id", data.assessmentId)
      .eq("user_id", userId);
    if (respErr) throw respErr;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, education_level, current_class_or_year, age, interests")
      .eq("user_id", userId)
      .maybeSingle();

    const raw: Record<string, number | string> = {};
    for (const r of responses ?? []) {
      raw[r.question_id] = r.value_num ?? r.value_text ?? "";
    }
    const summary = summarizeResponses(raw);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    const careerCatalog = CAREERS.map((c) => ({
      slug: c.slug, title: c.title, domain: c.domain, salaryRange: c.salaryRange,
      demand: c.demand, coreSkills: c.coreSkills, matchTraits: c.matchTraits,
    }));

    const prompt = `You are PathNova, a rigorous but warm career analyst for a student.

STUDENT
- Name: ${profile?.full_name || "the student"}
- Education: ${profile?.education_level || "unspecified"} — ${profile?.current_class_or_year || "unspecified year"}
- Stated interests: ${(profile?.interests ?? []).join(", ") || "not provided"}

PSYCHOMETRIC SUMMARY (trait scores 0-100)
${JSON.stringify(summary.traitAvg, null, 2)}

APTITUDE (1 = correct, 0 = missed)
${JSON.stringify(summary.aptitudeScores, null, 2)}

CHOICES (id → value)
${JSON.stringify(summary.choices, null, 2)}

ASSESSMENT SECTIONS
${SECTIONS.map((s) => `- ${s.title}: ${s.description}`).join("\n")}

CAREER CATALOG (choose 5 recommendations from these slugs)
${JSON.stringify(careerCatalog, null, 2)}

Produce a comprehensive, personalized JSON report. Requirements:
- summary: 2-3 warm sentences addressing the student directly.
- personality, interests, aptitudes, values, learning_style, communication_style, leadership_style, motivations, work_environment: 2-4 sentence paragraphs each, grounded in the numbers.
- strengths, growth_areas: 3-5 specific bullets each, no clichés.
- recommendations: 5 careers from the catalog with slug (exact), title, match 60-98, 3-5 reasoning bullets each grounded in trait scores, 2-4 concrete skill_gaps.
- roadmap: 3-4 phases with timeframe (aligned to their current class/year) and 3-5 concrete actions.
Tone: precise, respectful, no fluff, no emoji.`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        output: Output.object({ schema: ReportSchema }),
        prompt,
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        // Best-effort fallback so the flow never dead-ends
        try {
          const parsed = JSON.parse(error.text ?? "{}");
          return ReportSchema.parse(parsed);
        } catch {
          throw new Error("AI could not produce a valid report. Please retry in a moment.");
        }
      }
      throw error;
    }
  });

const CareerFeedbackSchema = z.object({
  score: z.number(),
  headline: z.string(),
  feedback: z.string(),
  strengths: z.array(z.string()),
  watchouts: z.array(z.string()),
});

export const generateCareerFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { careerSlug: string; decisions: { id: string; value: string; label: string }[] }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const career = CAREERS.find((c) => c.slug === data.careerSlug);
    if (!career) throw new Error("Unknown career");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    const prompt = `A student just completed a day-in-the-life simulation for "${career.title}".

Their decisions:
${data.decisions.map((d) => `- Scene ${d.id}: chose "${d.label}"`).join("\n")}

Ideal signals for this career: ${career.matchTraits.join(", ")}.

Rate their instincts as a JSON object:
- score: 0-100
- headline: 1 sentence, warm
- feedback: 3-4 sentences, grounded in the choices they made
- strengths: 2-3 things they got right
- watchouts: 2-3 patterns to grow from
Tone: honest coach, no fluff.`;

    const { output } = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      output: Output.object({ schema: CareerFeedbackSchema }),
      prompt,
    });

    await supabase.from("career_experience_progress").insert({
      user_id: userId,
      career_slug: data.careerSlug,
      decisions: data.decisions,
      score: Math.round(output.score),
      feedback: output.feedback,
      completed_at: new Date().toISOString(),
    });

    return output;
  });
