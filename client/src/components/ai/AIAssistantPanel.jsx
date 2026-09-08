import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Gauge, Tags } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ATSScore from '../resume/ATSScore.jsx';
import aiService from '../../services/aiService.js';
import resumeService from '../../services/resumeService.js';
import { useUIStore } from '../../store/useUIStore.js';
import { apiErrorMessage } from '../../services/api.js';

const QUICK_ACTIONS = [
  { key: 'summary', label: '✨ Improve Summary' },
  { key: 'experience', label: '✨ Improve Experience' },
  { key: 'project', label: '✨ Improve Project' },
  { key: 'achievement', label: '✨ Improve Achievement' },
  { key: 'keywords', label: '✨ Optimize Keywords' },
  { key: 'ats', label: '✨ Analyze ATS' },
];

export function AIAssistantPanel({ resume, onNavigateSection, onAtsResult }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Resume AI. Ask me how to strengthen any section, or use a quick action below." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [runningAts, setRunningAts] = useState(false);
  const toast = useUIStore((s) => s.toast);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    const message = text ?? input;
    if (!message.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);
    try {
      const { text: reply } = await aiService.askAssistant({ message, resume });
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: `Sorry, I hit an error: ${apiErrorMessage(err)}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickAction(key) {
    if (key === 'ats') {
      setRunningAts(true);
      try {
        const analysis = await resumeService.runAts(resume._id, resume.jobDescription);
        onAtsResult?.(analysis);
        toast({ title: 'ATS analysis complete ✓', variant: 'success' });
      } catch (err) {
        toast({ title: 'ATS analysis failed', description: apiErrorMessage(err), variant: 'error' });
      } finally {
        setRunningAts(false);
      }
      return;
    }
    if (key === 'keywords') {
      navigate(`/resume/${resume._id}/ats`);
      return;
    }
    onNavigateSection?.(key === 'summary' ? 'summary' : key === 'experience' ? 'experience' : key === 'project' ? 'projects' : 'achievements');
    send(`Give me 2-3 concrete suggestions to improve my ${key} section based on my resume.`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <Sparkles className="h-4 w-4 text-violet-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Resume AI</h3>
      </div>

      <div className="border-b border-slate-100 p-3 dark:border-slate-800">
        <p className="mb-2 text-xs font-medium text-slate-400">ATS Score</p>
        <ATSScore analysis={resume.atsAnalysis} compact />
        {runningAts && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Analyzing...
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-slate-100 p-3 dark:border-slate-800">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.key}
            onClick={() => handleQuickAction(a.key)}
            className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
          >
            {a.label}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-400 dark:bg-slate-800">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Resume AI..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus-ring dark:border-slate-700 dark:bg-slate-900"
          />
          <button type="submit" disabled={loading} className="rounded-xl bg-brand-600 p-2 text-white hover:bg-brand-700 disabled:opacity-50" aria-label="Send">
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAssistantPanel;
