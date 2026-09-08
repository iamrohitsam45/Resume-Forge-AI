import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Input from '../ui/Input.jsx';
import TagInput from './TagInput.jsx';
import Button from '../ui/Button.jsx';
import { useUIStore } from '../../store/useUIStore.js';
import { apiErrorMessage } from '../../services/api.js';
import aiService from '../../services/aiService.js';

export function SkillsSection({ items, resume, onAdd, onUpdate, onRemove, onReorder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const toast = useUIStore((s) => s.toast);

  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i._id === active.id);
    const to = items.findIndex((i) => i._id === over.id);
    onReorder(from, to);
  }

  async function getRecommendations() {
    setLoadingSuggestions(true);
    try {
      const existing = items.flatMap((c) => c.items || []);
      const { text } = await aiService.askAssistant({
        message: `Based on my resume, suggest 8 additional relevant technical skills I might be missing (comma-separated, no explanation, no duplicates of: ${existing.join(', ') || 'none listed yet'}).`,
        resume,
      });
      const parsed = text
        .split(/[,\n]/)
        .map((s) => s.replace(/^[-•\d.\s]+/, '').trim())
        .filter((s) => s && !existing.some((e) => e.toLowerCase() === s.toLowerCase()))
        .slice(0, 8);
      setSuggestions(parsed);
    } catch (err) {
      toast({ title: 'Could not fetch suggestions', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function addSuggestion(skill, categoryId) {
    const target = categoryId || items[0]?._id;
    if (!target) return;
    const category = items.find((c) => c._id === target);
    onUpdate(target, 'items', [...(category.items || []), skill]);
    setSuggestions((prev) => prev.filter((s) => s !== skill));
  }

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
          {items.map((cat) => (
            <SectionCard key={cat._id} id={cat._id} title={cat.category} subtitle={`${cat.items?.length || 0} skills`} onDelete={() => onRemove(cat._id)}>
              <Input label="Category Name" value={cat.category} onChange={(e) => onUpdate(cat._id, 'category', e.target.value)} />
              <TagInput label="Skills" value={cat.items || []} onChange={(v) => onUpdate(cat._id, 'items', v)} placeholder="Add a skill and press Enter" />
            </SectionCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" icon={Plus} onClick={onAdd} className="w-full">
        Add Skill Category
      </Button>

      <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-4 dark:border-brand-800 dark:bg-brand-950/20">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-medium text-brand-700 dark:text-brand-300">
            <Sparkles className="h-4 w-4" /> AI Skill Recommendations
          </p>
          <Button size="sm" variant="ai" onClick={getRecommendations} loading={loadingSuggestions}>
            Suggest Skills
          </Button>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => addSuggestion(s)}
                className="flex items-center gap-1 rounded-full border border-brand-200 bg-white px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-800 dark:bg-slate-900 dark:text-brand-300"
              >
                <Plus className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        )}
        {loadingSuggestions && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Analyzing your resume...
          </p>
        )}
      </div>
    </div>
  );
}

export default SkillsSection;
