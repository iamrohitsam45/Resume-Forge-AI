import { useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Button from '../ui/Button.jsx';
import AIGenerateButton from '../ai/AIGenerateButton.jsx';
import AISuggestionModal from '../ai/AISuggestionModal.jsx';
import useAISuggestion from '../../hooks/useAISuggestion.js';
import aiService from '../../services/aiService.js';

const ACTIONS = [
  { label: '✨ Generate Description', value: 'generate' },
  { label: 'Improve Achievement', value: 'improve' },
  { label: 'Make Impact-Oriented', value: 'impact' },
  { label: 'Make ATS Friendly', value: 'ats_friendly' },
];

export function AchievementsSection({ items, onAdd, onUpdate, onRemove, onDuplicate, onReorder }) {
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
    ai.run(() => aiService.achievementDescription({ title: item.title, rawInput: item.description, action }).then((d) => d.text));
  }

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SectionCard key={item._id} id={item._id} title={item.title || 'New Achievement'} subtitle={item.organization} onDuplicate={() => onDuplicate(item._id)} onDelete={() => onRemove(item._id)}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Achievement Title" value={item.title} onChange={(e) => onUpdate(item._id, 'title', e.target.value)} />
                <Input label="Organization" value={item.organization} onChange={(e) => onUpdate(item._id, 'organization', e.target.value)} />
                <Input label="Date" placeholder="2023" value={item.date} onChange={(e) => onUpdate(item._id, 'date', e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <AIGenerateButton actions={ACTIONS} onSelect={(action) => generateFor(item, action)} loading={ai.loading && activeItemIdRef.current === item._id} />
              </div>
              <Textarea rows={3} value={item.description} onChange={(e) => onUpdate(item._id, 'description', e.target.value)} />
            </SectionCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" icon={Plus} onClick={onAdd} className="w-full">
        Add Achievement
      </Button>

      <AISuggestionModal
        open={ai.open}
        loading={ai.loading}
        result={ai.result}
        onClose={ai.close}
        onRegenerate={ai.regenerate}
        onAccept={() => {
          if (activeItemIdRef.current) onUpdate(activeItemIdRef.current, 'description', ai.result);
          ai.close();
        }}
        title="AI-Generated Achievement Description"
      />
    </div>
  );
}

export default AchievementsSection;
