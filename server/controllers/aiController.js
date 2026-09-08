import asyncHandler from '../utils/asyncHandler.js';
import * as claude from '../services/claudeService.js';
import { calculateATSScore, analyzeKeywordMatch } from '../services/atsService.js';

export const generateSummary = asyncHandler(async (req, res) => {
  const text = await claude.generateSummary(req.body);
  res.json({ success: true, data: { text } });
});

export const generateExperienceDescription = asyncHandler(async (req, res) => {
  const bullets = await claude.generateExperienceDescription(req.body);
  res.json({ success: true, data: { bullets } });
});

export const generateProjectDescription = asyncHandler(async (req, res) => {
  const bullets = await claude.generateProjectDescription(req.body);
  res.json({ success: true, data: { bullets } });
});

export const generateAchievementDescription = asyncHandler(async (req, res) => {
  const text = await claude.generateAchievementDescription(req.body);
  res.json({ success: true, data: { text } });
});

export const improveBullet = asyncHandler(async (req, res) => {
  const text = await claude.improveBullet(req.body);
  res.json({ success: true, data: { text } });
});

export const atsAnalysis = asyncHandler(async (req, res) => {
  const { resume, jobDescription } = req.body;
  const analysis = calculateATSScore(resume, jobDescription);
  res.json({ success: true, data: analysis });
});

export const jobDescriptionAnalysis = asyncHandler(async (req, res) => {
  const analysis = await claude.analyzeJobDescription(req.body.jobDescription);
  res.json({ success: true, data: analysis });
});

export const keywordOptimization = asyncHandler(async (req, res) => {
  const { resume, jobDescription } = req.body;
  const match = analyzeKeywordMatch(resume, jobDescription);
  res.json({ success: true, data: match });
});

export const tailorResume = asyncHandler(async (req, res) => {
  const { resume, jobDescription } = req.body;
  const gapAnalysis = analyzeKeywordMatch(resume, jobDescription);
  const suggestions = await claude.suggestJobTailoring({
    resume,
    jobDescription,
    gapAnalysis: { missingKeywords: gapAnalysis.missing },
  });
  res.json({ success: true, data: { ...suggestions, keywordMatch: gapAnalysis } });
});

export const askAssistant = asyncHandler(async (req, res) => {
  const text = await claude.askAssistant(req.body);
  res.json({ success: true, data: { text } });
});

export default {
  generateSummary,
  generateExperienceDescription,
  generateProjectDescription,
  generateAchievementDescription,
  improveBullet,
  atsAnalysis,
  jobDescriptionAnalysis,
  keywordOptimization,
  tailorResume,
  askAssistant,
};
