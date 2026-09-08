import { useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import TagInput from './TagInput.jsx';
import BulletListEditor from './BulletListEditor.jsx';
import Button from '../ui/Button.jsx';
import AIGenerateButton from '../ai/AIGenerateButton.jsx';
import AISuggestionModal from '../ai/AISuggestionModal.jsx';
import useAISuggestion from '../../hooks/useAISuggestion.js';
import aiService from '../../services/aiService.js';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

const ACTIONS = [
  { label: '✨ Generate Description', value: 'generate' },
  { label: 'Improve Description', value: 'improve' },
  { label: 'Add Metrics', value: 'add_metrics' },
  { label: 'Make ATS Friendly', value: 'ats_friendly' },
];

export function ExperienceSection({ items, onAdd, onUpdate, onRemove, onDuplicate, onReorder }) {
  const ai = useAISuggestion();
  const activeItemIdRef = useRef(null);

  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i._id === active.id);
    const to = items.findIndex((i) => i._id === over.id);
    onReorder(from, to);
  }

  function generateFor(item, action) {
    activeItemIdRef.current = item._id;
    ai.run(() =>
      aiService
        .experienceDescription({
          company: item.company,
          role: item.role,
          technologies: item.technologies,
          rawInput: item.achievements?.length ? item.achievements.join('\n') : item.description,
          action,
        })
        .then((d) => d.bullets)
    );
  }

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SectionCard
              key={item._id}
              id={item._id}
              title={item.role || 'New Position'}
              subtitle={item.company}
              onDuplicate={() => onDuplicate(item._id)}
              onDelete={() => onRemove(item._id)}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Company" value={item.company} onChange={(e) => onUpdate(item._id, 'company', e.target.value)} />
                <Input label="Role" value={item.role} onChange={(e) => onUpdate(item._id, 'role', e.target.value)} />
                <Input label="Location" value={item.location} onChange={(e) => onUpdate(item._id, 'location', e.target.value)} />
                <Select
                  label="Employment Type"
                  placeholder="Select type"
                  options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))}
                  value={item.employmentType}
                  onChange={(e) => onUpdate(item._id, 'employmentType', e.target.value)}
                />
                <Input label="Start Date" placeholder="Jan 2023" value={item.startDate} onChange={(e) => onUpdate(item._id, 'startDate', e.target.value)} />
                <Input
                  label="End Date"
                  placeholder="Present"
                  disabled={item.current}
                  value={item.current ? 'Present' : item.endDate}
                  onChange={(e) => onUpdate(item._id, 'endDate', e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={item.current} onChange={(e) => onUpdate(item._id, 'current', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus-ring" />
                Currently working here
              </label>
              <TagInput label="Technologies" value={item.technologies || []} onChange={(v) => onUpdate(item._id, 'technologies', v)} placeholder="React, Node.js, ..." />

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Achievements / Bullets</label>
                <AIGenerateButton actions={ACTIONS} onSelect={(action) => generateFor(item, action)} loading={ai.loading && activeItemIdRef.current === item._id} />
              </div>
              <BulletListEditor value={item.achievements || []} onChange={(v) => onUpdate(item._id, 'achievements', v)} />
            </SectionCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" icon={Plus} onClick={onAdd} className="w-full">
        Add Experience
      </Button>

      <AISuggestionModal
        open={ai.open}
        loading={ai.loading}
        result={ai.result}
        onClose={ai.close}
        onRegenerate={ai.regenerate}
        onAccept={() => {
          if (activeItemIdRef.current) onUpdate(activeItemIdRef.current, 'achievements', ai.result);
          ai.close();
        }}
        title="AI-Generated Experience Bullets"
      />
    </div>
  );
}

export default ExperienceSection;
