import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

/**
 * Config-driven CRUD list for the simpler resume sections (Education, Certifications,
 * Languages, Awards, Volunteer, Publications, Links) - each shares add/edit/delete/
 * duplicate/reorder/collapse behavior, only the field layout differs.
 */
export function GenericListSection({ items, fields, titleField, subtitleField, addLabel, onAdd, onUpdate, onRemove, onDuplicate, onReorder }) {
  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i._id === active.id);
    const to = items.findIndex((i) => i._id === over.id);
    onReorder(from, to);
  }

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SectionCard
              key={item._id}
              id={item._id}
              title={item[titleField] || 'Untitled'}
              subtitle={subtitleField ? item[subtitleField] : undefined}
              onDuplicate={onDuplicate ? () => onDuplicate(item._id) : undefined}
              onDelete={() => onRemove(item._id)}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {fields.map((f) => {
                  if (f.type === 'checkbox') {
                    return (
                      <label key={f.key} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={Boolean(item[f.key])}
                          onChange={(e) => onUpdate(item._id, f.key, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus-ring"
                        />
                        {f.label}
                      </label>
                    );
                  }
                  if (f.type === 'textarea') {
                    return (
                      <Textarea
                        key={f.key}
                        label={f.label}
                        placeholder={f.placeholder}
                        rows={f.rows || 3}
                        value={item[f.key] || ''}
                        onChange={(e) => onUpdate(item._id, f.key, e.target.value)}
                        className={f.span === 2 ? 'sm:col-span-2' : ''}
                      />
                    );
                  }
                  if (f.type === 'select') {
                    return (
                      <Select
                        key={f.key}
                        label={f.label}
                        options={f.options}
                        value={item[f.key] || ''}
                        onChange={(e) => onUpdate(item._id, f.key, e.target.value)}
                      />
                    );
                  }
                  return (
                    <Input
                      key={f.key}
                      label={f.label}
                      placeholder={f.placeholder}
                      value={item[f.key] || ''}
                      onChange={(e) => onUpdate(item._id, f.key, e.target.value)}
                      className={f.span === 2 ? 'sm:col-span-2' : ''}
                    />
                  );
                })}
              </div>
            </SectionCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" icon={Plus} onClick={onAdd} className="w-full">
        {addLabel}
      </Button>
    </div>
  );
}

export default GenericListSection;
