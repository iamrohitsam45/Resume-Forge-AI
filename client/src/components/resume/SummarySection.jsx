import { useMemo } from 'react';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import TagInput from './TagInput.jsx';
import AIGenerateButton from '../ai/AIGenerateButton.jsx';
import AISuggestionModal from '../ai/AISuggestionModal.jsx';
import useAISuggestion from '../../hooks/useAISuggestion.js';
import aiService from '../../services/aiService.js';

const ACTIONS = [
  { label: '✨ Generate', value: 'generate' },
  { label: 'Improve', value: 'improve' },
  { label: 'Shorten', value: 'shorten' },
  { label: 'Make More Professional', value: 'more_professional' },
  { label: 'Make More ATS Friendly', value: 'more_ats' },
  { label: 'Add Keywords', value: 'add_keywords' },
];

export function SummarySection({ summary, onChange, personalTitle }) {
  const ai = useAISuggestion();
  const charCount = summary.text?.length || 0;
  const keywordCount = useMemo(() => new Set((summary.primarySkills || []).map((s) => s.toLowerCase())).size, [summary.primarySkills]);

  function generate(action) {
    ai.run(() =>
      aiService
        .summary({
          title: personalTitle || summary.industry || '',
          yearsOfExperience: summary.yearsOfExperience,
          industry: summary.industry,
          primarySkills: summary.primarySkills,
          careerGoal: summary.careerGoal,
          currentText: summary.text,
          action,
        })
        .then((d) => d.text)
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Years of Experience" placeholder="3+" value={summary.yearsOfExperience || ''} onChange={(e) => onChange('yearsOfExperience', e.target.value)} />
        <Input label="Industry" placeholder="Software / Fintech" value={summary.industry || ''} onChange={(e) => onChange('industry', e.target.value)} className="sm:col-span-2" />
      </div>
      <TagInput label="Primary Skills" value={summary.primarySkills || []} onChange={(v) => onChange('primarySkills', v)} placeholder="Add a skill..." />
      <Input label="Career Goal (optional)" placeholder="Grow into a senior full-stack role..." value={summary.careerGoal || ''} onChange={(e) => onChange('careerGoal', e.target.value)} />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Professional Summary</label>
          <AIGenerateButton actions={ACTIONS} onSelect={generate} loading={ai.loading && ai.open} />
        </div>
        <Textarea rows={5} placeholder="A concise, ATS-friendly summary of your experience..." value={summary.text || ''} onChange={(e) => onChange('text', e.target.value)} />
        <div className="mt-1.5 flex justify-between text-xs text-slate-400">
          <span>{charCount} characters</span>
          <span>{keywordCount} tracked keywords</span>
        </div>
      </div>

      <AISuggestionModal
        open={ai.open}
        loading={ai.loading}
        result={ai.result}
        onClose={ai.close}
        onRegenerate={ai.regenerate}
        onAccept={() => {
          onChange('text', ai.result);
          ai.close();
        }}
        title="AI-Generated Summary"
      />
    </div>
  );
}

export default SummarySection;
