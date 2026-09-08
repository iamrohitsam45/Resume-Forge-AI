import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Resume from '../models/Resume.js';
import ResumeVersion from '../models/ResumeVersion.js';
import { calculateATSScore } from '../services/atsService.js';
import { resumeToLatex } from '../services/latexService.js';
import { generateResumePdf } from '../services/pdfService.js';

async function loadOwnedResume(id, userId) {
  const resume = await Resume.findOne({ _id: id, userId });
  if (!resume) throw new ApiError(404, 'Resume not found');
  return resume;
}

export const createResume = asyncHandler(async (req, res) => {
  const resume = await Resume.create({ ...req.body, userId: req.user._id });
  res.status(201).json({ success: true, data: resume });
});

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: resumes });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  res.json({ success: true, data: resume });
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  Object.assign(resume, req.body);
  await resume.save();
  res.json({ success: true, data: resume });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  await resume.deleteOne();
  await ResumeVersion.deleteMany({ resumeId: resume._id });
  res.json({ success: true, message: 'Resume deleted' });
});

export const duplicateResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  const clone = resume.toObject();
  delete clone._id;
  delete clone.createdAt;
  delete clone.updatedAt;
  clone.title = `${resume.title} (Copy)`;
  const created = await Resume.create({ ...clone, userId: req.user._id });
  res.status(201).json({ success: true, data: created });
});

export const runAtsAnalysis = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  const jobDescription = req.body?.jobDescription ?? resume.jobDescription ?? '';
  const analysis = calculateATSScore(resume.toObject(), jobDescription);
  resume.atsScore = analysis.score;
  resume.atsAnalysis = analysis;
  if (req.body?.jobDescription !== undefined) resume.jobDescription = jobDescription;
  await resume.save();
  res.json({ success: true, data: analysis });
});

export const exportResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  const format = (req.query.format || 'pdf').toLowerCase();

  if (format === 'latex') {
    const latex = resumeToLatex(resume.toObject());
    resume.latexCode = latex;
    await resume.save();
    res.setHeader('Content-Type', 'application/x-tex; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${slug(resume.title)}.tex"`);
    return res.send(latex);
  }

  if (format === 'pdf') {
    const pdfBuffer = await generateResumePdf(resume.toObject());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${slug(resume.title)}.pdf"`);
    return res.send(pdfBuffer);
  }

  throw new ApiError(400, 'Unsupported export format. Use "pdf" or "latex".');
});

export const saveVersion = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  const version = await ResumeVersion.create({
    resumeId: resume._id,
    userId: req.user._id,
    label: req.body?.label || '',
    snapshot: resume.toObject(),
  });
  res.status(201).json({ success: true, data: version });
});

export const listVersions = asyncHandler(async (req, res) => {
  await loadOwnedResume(req.params.id, req.user._id);
  const versions = await ResumeVersion.find({ resumeId: req.params.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('label createdAt');
  res.json({ success: true, data: versions });
});

export const restoreVersion = asyncHandler(async (req, res) => {
  const resume = await loadOwnedResume(req.params.id, req.user._id);
  const version = await ResumeVersion.findOne({ _id: req.params.versionId, resumeId: resume._id });
  if (!version) throw new ApiError(404, 'Version not found');
  const snapshot = version.snapshot;
  delete snapshot._id;
  delete snapshot.createdAt;
  delete snapshot.updatedAt;
  delete snapshot.userId;
  Object.assign(resume, snapshot);
  await resume.save();
  res.json({ success: true, data: resume });
});

function slug(title) {
  return (title || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'resume';
}

export default {
  createResume,
  listResumes,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
  runAtsAnalysis,
  exportResume,
  saveVersion,
  listVersions,
  restoreVersion,
};
