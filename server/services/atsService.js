// Deterministic, explainable ATS Optimization Score engine.
// This estimates how well a resume is structured for automated parsing and
// keyword matching. It does NOT and cannot guarantee a real-world ATS score.

const ACTION_VERBS = [
  'developed', 'built', 'designed', 'implemented', 'led', 'managed', 'created',
  'launched', 'architected', 'engineered', 'optimized', 'improved', 'reduced',
  'increased', 'automated', 'delivered', 'deployed', 'migrated', 'refactored',
  'spearheaded', 'coordinated', 'analyzed', 'collaborated', 'mentored',
  'streamlined', 'integrated', 'scaled', 'shipped', 'owned', 'drove',
  'established', 'authored', 'resolved', 'accelerated', 'maintained',
];

const STOPWORDS = new Set(
  ('a an the and or of to in on for with as is are be by from at into your our '
    + 'you we they it this that will who what which experience years strong ability '
    + 'able skills work working team must plus preferred required requirement '
    + 'responsibilities responsible including etc such per over across via using')
    .split(' ')
);

const STANDARD_SECTIONS = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];

const QUANTIFIER_REGEX = /(\d+(\.\d+)?\s?(%|percent|x|k|m|million|billion|users|hrs|hours|days|ms|sec|seconds)?)/i;

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function extractKeywords(jobDescription, limit = 40) {
  const tokens = tokenize(jobDescription);
  const freq = new Map();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  // Also capture common multi-word technical phrases.
  const phrases = [];
  const phraseRegex = /\b([A-Za-z][\w.+#-]*(?:\s[A-Za-z][\w.+#-]*){0,2})\b/g;
  const techHints = ['rest api', 'node.js', 'react.js', 'ci/cd', 'machine learning', 'data structures', 'unit testing', 'system design', 'spring boot'];
  for (const hint of techHints) {
    if (jobDescription.toLowerCase().includes(hint)) phrases.push(hint);
  }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
  return [...new Set([...phrases, ...ranked])].slice(0, limit);
}

function resumeFullText(resume) {
  const parts = [];
  const p = resume.personal || {};
  parts.push(p.title, p.fullName);
  const s = resume.summary || {};
  parts.push(s.text, (s.primarySkills || []).join(' '));
  for (const exp of resume.experience || []) {
    parts.push(exp.role, exp.company, exp.description, (exp.technologies || []).join(' '), (exp.achievements || []).join(' '));
  }
  for (const edu of resume.education || []) parts.push(edu.degree, edu.field, edu.university);
  for (const sk of resume.skills || []) parts.push(sk.category, (sk.items || []).join(' '));
  for (const proj of resume.projects || []) parts.push(proj.name, proj.description, (proj.technologies || []).join(' '), (proj.bullets || []).join(' '));
  for (const a of resume.achievements || []) parts.push(a.title, a.description);
  for (const c of resume.certifications || []) parts.push(c.name, c.issuer);
  return parts.filter(Boolean).join(' \n ');
}

function scoreFormatting(resume) {
  let score = 20;
  const notes = [];
  const p = resume.personal || {};

  if (!p.fullName) { score -= 4; notes.push({ type: 'warning', message: 'Add your full name to Personal Information.' }); }
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) { score -= 3; notes.push({ type: 'warning', message: 'Add a valid email address.' }); }
  if (!p.phone) { score -= 2; notes.push({ type: 'warning', message: 'Add a phone number for recruiters to reach you.' }); }
  if (!p.title) { score -= 2; notes.push({ type: 'warning', message: 'Add a professional title under Personal Information.' }); }

  // Date consistency across experience/education (rough heuristic: same-ish format length)
  const dates = [...(resume.experience || []), ...(resume.education || [])]
    .flatMap((e) => [e.startDate, e.endDate])
    .filter(Boolean);
  const formats = new Set(dates.map((d) => (/^\d{4}-\d{2}$/.test(d) ? 'iso' : /^[A-Za-z]{3,9}\s\d{4}$/.test(d) ? 'text' : 'other')));
  if (formats.size > 1) {
    score -= 3;
    notes.push({ type: 'warning', message: 'Use a consistent date format across Experience and Education (e.g., "Jan 2023").' });
  } else if (dates.length) {
    notes.push({ type: 'success', message: 'Consistent date formatting detected.' });
  }

  // Overly long bullets hurt parsing/readability
  const longBullets = (resume.experience || []).flatMap((e) => e.achievements || []).filter((b) => b.length > 240);
  if (longBullets.length) {
    score -= 2;
    notes.push({ type: 'warning', message: 'Some experience bullets are very long - keep bullets under ~220 characters.' });
  }

  if (!notes.some((n) => n.type === 'warning')) {
    notes.push({ type: 'success', message: 'No formatting red flags detected - headings and contact info look clean.' });
  }

  return { score: Math.max(0, Math.min(20, score)), notes };
}

function scoreContent(resume) {
  let score = 20;
  const notes = [];
  const allBullets = [
    ...(resume.experience || []).flatMap((e) => (e.achievements?.length ? e.achievements : e.description ? [e.description] : [])),
    ...(resume.projects || []).flatMap((p) => (p.bullets?.length ? p.bullets : p.description ? [p.description] : [])),
  ].filter(Boolean);

  if (!allBullets.length) {
    return { score: 4, notes: [{ type: 'warning', message: 'Add bullet points describing your experience and projects.' }] };
  }

  const verbHits = allBullets.filter((b) => ACTION_VERBS.some((v) => new RegExp(`\\b${v}\\b`, 'i').test(b)));
  const verbRatio = verbHits.length / allBullets.length;
  if (verbRatio < 0.5) {
    score -= 6;
    notes.push({ type: 'warning', message: 'Start more bullets with strong action verbs (e.g., "Developed", "Led", "Optimized").' });
  } else {
    notes.push({ type: 'success', message: 'Strong action-verb usage across bullets.' });
  }

  const quantified = allBullets.filter((b) => QUANTIFIER_REGEX.test(b));
  const quantRatio = quantified.length / allBullets.length;
  if (quantRatio < 0.3) {
    score -= 6;
    notes.push({ type: 'warning', message: 'Add measurable impact where possible (%, time saved, scale, users) - never invent numbers.' });
  } else {
    notes.push({ type: 'success', message: 'Good use of quantifiable achievements.' });
  }

  const tooLong = allBullets.filter((b) => b.split(/\s+/).length > 40);
  if (tooLong.length > allBullets.length * 0.3) {
    score -= 3;
    notes.push({ type: 'warning', message: 'Tighten longer bullets to stay concise and scannable.' });
  }

  const hasJobTitles = (resume.experience || []).every((e) => e.role && e.role.trim().length > 0);
  if (resume.experience?.length && !hasJobTitles) {
    score -= 3;
    notes.push({ type: 'warning', message: 'Every experience entry should have a clear job title.' });
  }

  return { score: Math.max(0, Math.min(20, score)), notes };
}

function scoreKeywords(resume, jobDescription) {
  const notes = [];
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      score: 14,
      notes: [{ type: 'warning', message: 'Paste a target job description to unlock precise keyword matching.' }],
      matchedKeywords: [],
      missingKeywords: [],
    };
  }
  const jdKeywords = extractKeywords(jobDescription, 30);
  const resumeText = resumeFullText(resume).toLowerCase();
  const matched = jdKeywords.filter((k) => resumeText.includes(k));
  const missing = jdKeywords.filter((k) => !resumeText.includes(k));
  const ratio = jdKeywords.length ? matched.length / jdKeywords.length : 0;
  const score = Math.round(ratio * 20);

  if (ratio >= 0.7) notes.push({ type: 'success', message: `Strong keyword coverage: ${matched.length}/${jdKeywords.length} target keywords found.` });
  else notes.push({ type: 'warning', message: `Only ${matched.length}/${jdKeywords.length} target keywords found - consider weaving in missing ones honestly.` });

  for (const m of missing.slice(0, 5)) notes.push({ type: 'warning', message: `Consider addressing "${m}" if it genuinely applies to your experience.` });

  return { score, notes, matchedKeywords: matched, missingKeywords: missing };
}

function scoreExperience(resume) {
  let score = 20;
  const notes = [];
  const exp = resume.experience || [];
  if (!exp.length) {
    return { score: 5, notes: [{ type: 'warning', message: 'Add at least one experience entry.' }] };
  }
  const incomplete = exp.filter((e) => !e.company || !e.role || !e.startDate);
  if (incomplete.length) {
    score -= 5;
    notes.push({ type: 'warning', message: 'Fill in company, role, and start date for every experience entry.' });
  }
  const noDetail = exp.filter((e) => !(e.achievements?.length) && !(e.description?.trim()));
  if (noDetail.length) {
    score -= 6;
    notes.push({ type: 'warning', message: 'Add bullet points describing responsibilities and impact for each role.' });
  } else {
    notes.push({ type: 'success', message: 'Every role includes supporting detail.' });
  }
  const techMentioned = exp.some((e) => (e.technologies || []).length > 0);
  if (!techMentioned) {
    score -= 4;
    notes.push({ type: 'warning', message: 'Tag relevant technologies used in each role.' });
  }
  return { score: Math.max(0, Math.min(20, score)), notes };
}

function scoreSkills(resume, jobDescription) {
  let score = 20;
  const notes = [];
  const categories = resume.skills || [];
  const totalSkills = categories.reduce((acc, c) => acc + (c.items?.length || 0), 0);
  if (!categories.length || totalSkills === 0) {
    return { score: 3, notes: [{ type: 'warning', message: 'Add categorized skills (Languages, Frameworks, Tools, etc.).' }] };
  }
  if (totalSkills < 6) {
    score -= 6;
    notes.push({ type: 'warning', message: 'List more relevant skills - aim for a well-rounded, categorized skill set.' });
  } else {
    notes.push({ type: 'success', message: 'Good technical skill density.' });
  }
  if (categories.length < 2) {
    score -= 3;
    notes.push({ type: 'warning', message: 'Group skills into categories (e.g., Languages, Frontend, Backend, Tools).' });
  }
  if (jobDescription && jobDescription.trim().length >= 20) {
    const jdKeywords = extractKeywords(jobDescription, 25);
    const skillText = categories.flatMap((c) => c.items || []).join(' ').toLowerCase();
    const overlap = jdKeywords.filter((k) => skillText.includes(k));
    if (overlap.length < 3) {
      score -= 4;
      notes.push({ type: 'warning', message: 'Align more of your listed skills with the target job description.' });
    } else {
      notes.push({ type: 'success', message: `${overlap.length} listed skills directly match the target job.` });
    }
  }
  return { score: Math.max(0, Math.min(20, score)), notes };
}

function scoreProjects(resume) {
  let score = 10;
  const notes = [];
  const projects = resume.projects || [];
  if (!projects.length) {
    return { score: 5, notes: [{ type: 'warning', message: 'Consider adding 1-3 relevant projects, especially for entry/mid-level roles.' }] };
  }
  const withBullets = projects.filter((p) => (p.bullets?.length || 0) > 0 || p.description);
  if (withBullets.length < projects.length) {
    score -= 4;
    notes.push({ type: 'warning', message: 'Add a short description or bullets for every project.' });
  } else {
    notes.push({ type: 'success', message: 'Projects are well described.' });
  }
  const withTech = projects.filter((p) => (p.technologies?.length || 0) > 0);
  if (withTech.length < projects.length) {
    score -= 3;
    notes.push({ type: 'warning', message: 'Tag technologies used for every project.' });
  }
  return { score: Math.max(0, Math.min(10, score)), notes };
}

function scoreStructure(resume) {
  let score = 10;
  const notes = [];
  const present = {
    summary: Boolean(resume.summary?.text?.trim()),
    experience: (resume.experience || []).length > 0,
    education: (resume.education || []).length > 0,
    skills: (resume.skills || []).some((s) => s.items?.length),
    projects: (resume.projects || []).length > 0,
    certifications: (resume.certifications || []).length > 0,
  };
  const missing = STANDARD_SECTIONS.filter((s) => !present[s]);
  score -= missing.length * (missing.includes('certifications') || missing.includes('projects') ? 1 : 2);
  for (const m of missing) {
    notes.push({ type: 'warning', message: `Add a ${m.charAt(0).toUpperCase() + m.slice(1)} section.` });
  }
  if (!missing.length) notes.push({ type: 'success', message: 'All standard resume sections are present.' });
  return { score: Math.max(0, Math.min(10, score)), notes };
}

export function calculateATSScore(resume, jobDescription = '') {
  const formatting = scoreFormatting(resume);
  const content = scoreContent(resume);
  const keywords = scoreKeywords(resume, jobDescription);
  const experience = scoreExperience(resume);
  const skills = scoreSkills(resume, jobDescription);
  const projects = scoreProjects(resume);
  const structure = scoreStructure(resume);

  // Weighted total out of 100: Formatting 20, Content folded into Experience/Keywords weighting,
  // Keywords 20, Experience 20, Skills 20, Projects 10, Structure 10.
  // Content quality nudges Experience score since content lives in experience/project bullets.
  const experienceBlended = Math.round(experience.score * 0.7 + content.score * 0.3);

  const breakdown = {
    formatting: { label: 'Formatting', score: formatting.score, max: 20 },
    keywords: { label: 'Keywords', score: keywords.score, max: 20 },
    experience: { label: 'Experience', score: experienceBlended, max: 20 },
    skills: { label: 'Skills', score: skills.score, max: 20 },
    projects: { label: 'Projects', score: projects.score, max: 10 },
    structure: { label: 'Structure', score: structure.score, max: 10 },
  };

  const total = Object.values(breakdown).reduce((acc, b) => acc + b.score, 0);
  const recommendations = [
    ...formatting.notes,
    ...content.notes,
    ...keywords.notes,
    ...experience.notes,
    ...skills.notes,
    ...projects.notes,
    ...structure.notes,
  ];

  let rating = 'Needs Work';
  if (total >= 90) rating = 'Excellent';
  else if (total >= 75) rating = 'Strong';
  else if (total >= 60) rating = 'Good';
  else if (total >= 40) rating = 'Fair';

  return {
    score: Math.max(0, Math.min(100, total)),
    rating,
    breakdown,
    recommendations,
    matchedKeywords: keywords.matchedKeywords || [],
    missingKeywords: keywords.missingKeywords || [],
    generatedAt: new Date().toISOString(),
  };
}

export function analyzeKeywordMatch(resume, jobDescription) {
  const jdKeywords = extractKeywords(jobDescription, 40);
  const resumeText = resumeFullText(resume).toLowerCase();
  const matched = jdKeywords.filter((k) => resumeText.includes(k));
  const missing = jdKeywords.filter((k) => !resumeText.includes(k));
  const matchPercentage = jdKeywords.length ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
  return { matchPercentage, matched, missing, totalKeywords: jdKeywords.length };
}

export default { calculateATSScore, analyzeKeywordMatch };
