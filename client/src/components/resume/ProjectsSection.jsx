import { useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Input from '../ui/Input.jsx';
import TagInput from './TagInput.jsx';
import BulletListEditor from './BulletListEditor.jsx';
import Button from '../ui/Button.jsx';
import AIGenerateButton from '../ai/AIGenerateButton.jsx';
import AISuggestionModal from '../ai/AISuggestionModal.jsx';
import useAISuggestion from '../../hooks/useAISuggestion.js';
import aiService from '../../services/aiService.js';

const ACTIONS = [
  { label: '✨ Generate Bullets', value: 'bullets' },
  { label: 'Improve Description', value: 'improve' },
  { label: 'Add Technical Keywords', value: 'add_keywords' },
  { label: 'Make ATS Friendly', value: 'ats_friendly' },
];

export function ProjectsSection({ items, onAdd, onUpdate, onRemove, onDuplicate, onReorder }) {
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
        .projectDescription({
          name: item.name,
          technologies: item.technologies,
          rawInput: item.bullets?.length ? item.bullets.join('\n') : item.description,
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
            <SectionCard key={item._id} id={item._id} title={item.name || 'New Project'} subtitle={item.type} onDuplicate={() => onDuplicate(item._id)} onDelete={() => onRemove(item._id)}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Project Name" value={item.name} onChange={(e) => onUpdate(item._id, 'name', e.target.value)} />
                <Input label="Project Type" placeholder="Full-stack web app" value={item.type} onChange={(e) => onUpdate(item._id, 'type', e.target.value)} />
                <Input label="GitHub URL" value={item.githubUrl} onChange={(e) => onUpdate(item._id, 'githubUrl', e.target.value)} />
                <Input label="Live URL" value={item.liveUrl} onChange={(e) => onUpdate(item._id, 'liveUrl', e.target.value)} />
                <Input label="Start Date" placeholder="Jan 2023" value={item.startDate} onChange={(e) => onUpdate(item._id, 'startDate', e.target.value)} />
                <Input label="End Date" placeholder="Mar 2023" value={item.endDate} onChange={(e) => onUpdate(item._id, 'endDate', e.target.value)} />
              </div>
              <TagInput label="Technologies" value={item.technologies || []} onChange={(v) => onUpdate(item._id, 'technologies', v)} placeholder="React, MongoDB, ..." />
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Resume Bullets</label>
                <AIGenerateButton actions={ACTIONS} onSelect={(action) => generateFor(item, action)} loading={ai.loading && activeItemIdRef.current === item._id} />
              </div>
              <BulletListEditor value={item.bullets || []} onChange={(v) => onUpdate(item._id, 'bullets', v)} />
            </SectionCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" icon={Plus} onClick={onAdd} className="w-full">
        Add Project
      </Button>

      <AISuggestionModal
        open={ai.open}
        loading={ai.loading}
        result={ai.result}
        onClose={ai.close}
        onRegenerate={ai.regenerate}
        onAccept={() => {
          if (activeItemIdRef.current) onUpdate(activeItemIdRef.current, 'bullets', ai.result);
          ai.close();
        }}
        title="AI-Generated Project Bullets"
      />
    </div>
  );
}

export default ProjectsSection;
