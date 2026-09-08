import Anthropic from '@anthropic-ai/sdk';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

let client = null;
function getClient() {
  if (!env.anthropicApiKey) {
    throw new ApiError(
      503,
      'AI features are not configured. Set ANTHROPIC_API_KEY on the server to enable Claude-powered writing and analysis.'
    );
  }
  if (!client) client = new Anthropic({ apiKey: env.anthropicApiKey });
  return client;
}

const MODEL = env.claudeModel;

async function complete({ system, user, maxTokens = 700, temperature = 0.6 }) {
  const anthropic = getClient();
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();
    return text;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, `Claude request failed: ${err.message || 'unknown error'}`);
  }
}

/** Streams a completion, invoking onDelta(text) for each chunk. Returns the full text. */
async function streamComplete({ system, user, maxTokens = 700, temperature = 0.6, onDelta }) {
  const anthropic = getClient();
  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: user }],
    });
    stream.on('text', (delta) => onDelta?.(delta));
    const finalMessage = await stream.finalMessage();
    return finalMessage.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, `Claude request failed: ${err.message || 'unknown error'}`);
  }
}

const NO_FABRICATION_RULE = `Never invent facts, metrics, employers, technologies, or achievements that were not provided by the user. If quantifiable impact is missing, write strong, honest, results-oriented language without inventing numbers.`;

const SYSTEM_RESUME_WRITER = `You are an expert technical resume writer and ATS optimization specialist. You write concise, professional, keyword-rich resume content. ${NO_FABRICATION_RULE} Return ONLY the requested content with no preamble, no explanation, and no markdown formatting unless bullets are explicitly requested.`;

export async function generateSummary(input, opts = {}) {
  const { title, yearsOfExperience, industry, primarySkills, careerGoal, action, currentText } = input;
  const actionInstructions = {
    generate: 'Write a new professional summary from the details below.',
    improve: 'Improve the existing summary below, keeping it truthful to the same facts.',
    shorten: 'Shorten the existing summary to 2-3 punchy sentences without losing key keywords.',
    more_professional: 'Rewrite the existing summary in a more polished, professional tone.',
    more_ats: 'Rewrite the existing summary to maximize ATS keyword alignment for the stated industry/skills.',
    add_keywords: 'Rewrite the existing summary, naturally weaving in more relevant technical keywords for the stated skills/industry.',
  };
  const user = `${actionInstructions[action] || actionInstructions.generate}

Professional Title: ${title || 'N/A'}
Years of Experience: ${yearsOfExperience || 'N/A'}
Industry: ${industry || 'N/A'}
Primary Skills: ${(primarySkills || []).join(', ') || 'N/A'}
Career Goal: ${careerGoal || 'N/A'}
Existing Summary: ${currentText || 'N/A'}

Requirements:
- ATS friendly
- concise, 3-4 sentences maximum
- professional tone
- use relevant keywords from the primary skills / industry
- no fabricated information
- no generic buzzwords ("hardworking", "team player", "synergy")
- focus on measurable impact only where the user provided it

Return only the final summary text.`;
  return complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 300, ...opts });
}

export async function generateExperienceDescription(input, opts = {}) {
  const { company, role, rawInput, technologies, action } = input;
  const actionInstructions = {
    generate: 'Transform the raw notes below into 3-5 strong, concise resume bullet points.',
    improve: 'Improve the existing bullets below - sharpen verbs, tighten language, keep every fact.',
    add_metrics: 'Review the bullets below. Where the user has NOT given a number, do not invent one - instead sharpen the language toward business/technical impact using neutral wording. Only keep numbers the user already provided.',
    ats_friendly: 'Rewrite the bullets below to maximize ATS keyword density for the role, using standard industry terminology, without changing the underlying facts.',
  };
  const user = `${actionInstructions[action] || actionInstructions.generate}

Company: ${company || 'N/A'}
Role: ${role || 'N/A'}
Technologies: ${(technologies || []).join(', ') || 'N/A'}
Raw notes / existing bullets:
"""
${rawInput || 'N/A'}
"""

Requirements:
- Prioritize in this order: 1) Impact 2) Technical implementation 3) Business value 4) Scale 5) Measurable outcomes
- Start each bullet with a strong action verb
- Be technically specific (name real technologies from the input)
- ${NO_FABRICATION_RULE}
- One bullet per line, no bullet characters, no numbering
- 3-5 bullets, each under 220 characters

Return only the bullet lines, one per line.`;
  const text = await complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 500, ...opts });
  return splitBullets(text);
}

export async function generateProjectDescription(input, opts = {}) {
  const { name, rawInput, technologies, action } = input;
  const actionInstructions = {
    generate: 'Transform the project notes below into 2-4 strong resume bullets.',
    improve: 'Improve the existing project bullets below without changing the underlying facts.',
    bullets: 'Generate 2-4 concise resume bullets focused on Action, Technology, Implementation, and Result.',
    add_keywords: 'Rewrite the bullets to naturally include more relevant technical keywords from the technologies listed.',
    ats_friendly: 'Rewrite the bullets to maximize ATS compatibility using standard technical terminology.',
  };
  const user = `${actionInstructions[action] || actionInstructions.generate}

Project Name: ${name || 'N/A'}
Technologies: ${(technologies || []).join(', ') || 'N/A'}
Raw notes / existing description:
"""
${rawInput || 'N/A'}
"""

Requirements:
- Use action verbs, name real technologies, describe implementation, mention measurable impact only if provided
- ${NO_FABRICATION_RULE}
- One bullet per line, no bullet characters
- 2-4 bullets, each under 200 characters

Return only the bullet lines, one per line.`;
  const text = await complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 400, ...opts });
  return splitBullets(text);
}

export async function generateAchievementDescription(input, opts = {}) {
  const { title, rawInput, action } = input;
  const actionInstructions = {
    generate: 'Write a concise, impact-oriented description for this achievement.',
    improve: 'Improve the existing description below without changing the underlying facts.',
    impact: 'Rewrite to foreground the impact/significance of this achievement.',
    ats_friendly: 'Rewrite using standard, ATS-friendly phrasing.',
  };
  const user = `${actionInstructions[action] || actionInstructions.generate}

Achievement: ${title || 'N/A'}
Raw notes / existing description:
"""
${rawInput || 'N/A'}
"""

Requirements:
- 1-2 sentences, concise and professional
- ${NO_FABRICATION_RULE}

Return only the final description text.`;
  return complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 200, ...opts });
}

export async function improveBullet({ text, instruction }, opts = {}) {
  const user = `Instruction: ${instruction}

Original text:
"""
${text}
"""

${NO_FABRICATION_RULE}
Return only the rewritten text.`;
  return complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 300, ...opts });
}

export async function analyzeJobDescription(jobDescription, opts = {}) {
  const user = `Analyze the following job description and extract structured information.

Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object (no markdown fences, no commentary) with this exact shape:
{
  "requiredSkills": string[],
  "preferredSkills": string[],
  "keywords": string[],
  "experienceRequirement": string,
  "education": string,
  "responsibilities": string[],
  "importantTechnologies": string[]
}`;
  const text = await complete({ system: 'You are an expert technical recruiter and job description analyst. Respond with strict JSON only.', user, maxTokens: 900, temperature: 0.3, ...opts });
  return safeParseJson(text);
}

export async function suggestJobTailoring({ resume, jobDescription, gapAnalysis }, opts = {}) {
  const user = `You are helping a candidate tailor their resume to a specific job, using ONLY information already present in their resume. Never invent new experience, skills, or metrics.

Resume (JSON):
${JSON.stringify(resume).slice(0, 6000)}

Job Description:
"""
${jobDescription.slice(0, 4000)}
"""

Missing keywords identified by keyword matching: ${(gapAnalysis?.missingKeywords || []).join(', ') || 'none'}

Return ONLY a valid JSON object with this exact shape:
{
  "summaryChanges": string,
  "skillsChanges": string[],
  "experienceImprovements": string[],
  "projectKeywordImprovements": string[],
  "missingKeywordsToAddressHonestly": string[]
}

If the resume genuinely does not support a missing keyword, list it under missingKeywordsToAddressHonestly rather than fabricating experience for it.`;
  const text = await complete({ system: 'You are an expert resume strategist. Respond with strict JSON only. Never fabricate experience.', user, maxTokens: 900, temperature: 0.4, ...opts });
  return safeParseJson(text);
}

export async function askAssistant({ message, resume }, opts = {}) {
  const user = `Resume context (JSON, may be partial):
${resume ? JSON.stringify(resume).slice(0, 5000) : 'No resume context provided.'}

User question: ${message}

Answer as a helpful, concise resume-writing and ATS-optimization assistant. Ground suggestions in the resume context above. ${NO_FABRICATION_RULE}`;
  return complete({ system: SYSTEM_RESUME_WRITER, user, maxTokens: 600, ...opts });
}

function splitBullets(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-•*\d.\s]+/, '').trim())
    .filter(Boolean);
}

function safeParseJson(text) {
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new ApiError(502, 'AI returned an unexpected response format. Please try again.');
  }
}

export default {
  generateSummary,
  generateExperienceDescription,
  generateProjectDescription,
  generateAchievementDescription,
  improveBullet,
  analyzeJobDescription,
  suggestJobTailoring,
  askAssistant,
  streamComplete,
};
