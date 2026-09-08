import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gauge, Sparkles, FileSearch, Wand2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import resumeService from '../services/resumeService.js';
import aiService from '../services/aiService.js';
import { apiErrorMessage } from '../services/api.js';
import { useUIStore } from '../store/useUIStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Badge from '../components/ui/Badge.jsx';
import ATSScore from '../components/resume/ATSScore.jsx';

export function ResumeATS() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useUIStore((s) => s.toast);

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [tailorSuggestions, setTailorSuggestions] = useState(null);

  useEffect(() => {
    resumeService
      .get(id)
      .then((r) => {
        setResume(r);
        setJobDescription(r.jobDescription || '');
      })
      .catch((err) => setError(apiErrorMessage(err)));
  }, [id]);

  async function runAts() {
    setAnalyzing(true);
    try {
      const analysis = await resumeService.runAts(id, jobDescription);
      setResume((prev) => ({ ...prev, atsScore: analysis.score, atsAnalysis: analysis, jobDescription }));
      toast({ title: 'ATS analysis complete ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Analysis failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setAnalyzing(false);
    }
  }

  async function analyzeJob() {
    if (jobDescription.trim().length < 20) {
      toast({ title: 'Paste a fuller job description', variant: 'error' });
      return;
    }
    setAnalyzingJob(true);
    setJobAnalysis(null);
    try {
      const analysis = await aiService.jobDescriptionAnalysis({ jobDescription });
      setJobAnalysis(analysis);
      toast({ title: 'Job description analyzed ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Job analysis failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setAnalyzingJob(false);
    }
  }

  async function tailorResume() {
    if (jobDescription.trim().length < 20) {
      toast({ title: 'Paste a fuller job description', variant: 'error' });
      return;
    }
    setTailoring(true);
    setTailorSuggestions(null);
    try {
      const suggestions = await aiService.tailorResume({ resume, jobDescription });
      setTailorSuggestions(suggestions);
    } catch (err) {
      toast({ title: 'Tailoring failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setTailoring(false);
    }
  }

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!resume) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  const matchPct = resume.atsAnalysis
    ? Math.round(
        ((resume.atsAnalysis.matchedKeywords?.length || 0) /
          Math.max(1, (resume.atsAnalysis.matchedKeywords?.length || 0) + (resume.atsAnalysis.missingKeywords?.length || 0))) *
          100
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(`/resume/${id}/edit`)} className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to editor
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">ATS Optimization Score</h2>
            </div>
            <div className="mt-4">
              <ATSScore analysis={resume.atsAnalysis} />
            </div>
            <Button className="mt-4 w-full" icon={Gauge} loading={analyzing} onClick={runAts}>
              Run ATS Analysis
            </Button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              This is an ATS Optimization Score, an internal estimate - not a guarantee of a specific real-world ATS result.
            </p>
          </Card>

          {matchPct !== null && (
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white">Resume Match: {matchPct}%</h3>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-emerald-600">Matched</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(resume.atsAnalysis.matchedKeywords || []).slice(0, 12).map((k) => (
                      <Badge key={k} variant="success" icon={CheckCircle2}>{k}</Badge>
                    ))}
                    {!resume.atsAnalysis.matchedKeywords?.length && <p className="text-xs text-slate-400">None yet</p>}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-red-500">Missing</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(resume.atsAnalysis.missingKeywords || []).slice(0, 12).map((k) => (
                      <Badge key={k} variant="danger" icon={XCircle}>{k}</Badge>
                    ))}
                    {!resume.atsAnalysis.missingKeywords?.length && <p className="text-xs text-slate-400">None</p>}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-brand-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Job Description Analyzer</h2>
            </div>
            <Textarea
              className="mt-3"
              rows={8}
              placeholder="Paste a target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="ai" icon={Sparkles} loading={analyzingJob} onClick={analyzeJob}>
                Analyze Job
              </Button>
              <Button variant="outline" icon={Wand2} loading={tailoring} onClick={tailorResume}>
                Optimize Resume For This Job
              </Button>
            </div>
          </Card>

          {jobAnalysis && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Job Requirements</h3>
                <JobField label="Required Skills" items={jobAnalysis.requiredSkills} />
                <JobField label="Preferred Skills" items={jobAnalysis.preferredSkills} />
                <JobField label="Keywords" items={jobAnalysis.keywords} />
                <JobField label="Important Technologies" items={jobAnalysis.importantTechnologies} />
                {jobAnalysis.experienceRequirement && (
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Experience:</strong> {jobAnalysis.experienceRequirement}</p>
                )}
                {jobAnalysis.education && (
                  <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Education:</strong> {jobAnalysis.education}</p>
                )}
              </Card>
            </motion.div>
          )}

          {tailorSuggestions && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="space-y-3">
                <h3 className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-violet-500" /> Tailoring Suggestions
                </h3>
                {tailorSuggestions.summaryChanges && (
                  <div>
                    <p className="text-xs font-medium text-slate-500">Summary</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{tailorSuggestions.summaryChanges}</p>
                  </div>
                )}
                <JobField label="Skills Changes" items={tailorSuggestions.skillsChanges} />
                <JobField label="Experience Improvements" items={tailorSuggestions.experienceImprovements} />
                <JobField label="Project Keyword Improvements" items={tailorSuggestions.projectKeywordImprovements} />
                {tailorSuggestions.missingKeywordsToAddressHonestly?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-amber-600">Keywords not yet supported by your resume</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      These weren't added automatically because your resume doesn't currently reflect this experience:{' '}
                      {tailorSuggestions.missingKeywordsToAddressHonestly.join(', ')}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobField({ label, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}

export default ResumeATS;
