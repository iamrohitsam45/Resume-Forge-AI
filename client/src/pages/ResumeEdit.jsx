import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useResumeEditor from '../hooks/useResumeEditor.js';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts.js';
import { useUIStore } from '../store/useUIStore.js';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';

import ResumeToolbar from '../components/resume/ResumeToolbar.jsx';
import ResumeFormSidebar from '../components/resume/ResumeFormSidebar.jsx';
import ResumePreview from '../components/resume/ResumePreview.jsx';
import TemplateSelector from '../components/resume/TemplateSelector.jsx';
import PersonalSection from '../components/resume/PersonalSection.jsx';
import SummarySection from '../components/resume/SummarySection.jsx';
import ExperienceSection from '../components/resume/ExperienceSection.jsx';
import ProjectsSection from '../components/resume/ProjectsSection.jsx';
import AchievementsSection from '../components/resume/AchievementsSection.jsx';
import SkillsSection from '../components/resume/SkillsSection.jsx';
import GenericListSection from '../components/resume/GenericListSection.jsx';
import AIAssistantPanel from '../components/ai/AIAssistantPanel.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import { LIST_SECTION_CONFIGS } from '../constants/listSectionConfigs.js';

const MOBILE_TABS = [
  { value: 'form', label: 'Form' },
  { value: 'preview', label: 'Preview' },
  { value: 'ai', label: 'AI Assistant' },
];

export function ResumeEdit() {
  const { id } = useParams();
  const editor = useResumeEditor(id);
  const toast = useUIStore((s) => s.toast);
  const [activeSection, setActiveSection] = useState('personal');
  const [templateOpen, setTemplateOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('form');

  const saveNow = useCallback(async () => {
    if (!editor.resume) return;
    try {
      // eslint-disable-next-line no-unused-vars
      const { _id, createdAt, updatedAt, userId, __v, ...rest } = editor.resume;
      await resumeService.update(editor.resume._id, rest);
      toast({ title: 'Resume saved ✓', variant: 'success', duration: 2000 });
    } catch (err) {
      toast({ title: 'Save failed', description: apiErrorMessage(err), variant: 'error' });
    }
  }, [editor.resume, toast]);

  useKeyboardShortcuts(
    {
      'mod+s': saveNow,
      'mod+p': () => window.print(),
    },
    [saveNow]
  );

  if (editor.loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (editor.error || !editor.resume) {
    return <div className="p-10 text-center text-slate-500">{editor.error || 'Resume not found'}</div>;
  }

  const { resume } = editor;

  function renderSection() {
    switch (activeSection) {
      case 'personal':
        return <PersonalSection personal={resume.personal} onChange={editor.updatePersonal} />;
      case 'summary':
        return <SummarySection summary={resume.summary} onChange={editor.updateSummary} personalTitle={resume.personal.title} />;
      case 'experience':
        return (
          <ExperienceSection
            items={resume.experience}
            onAdd={() => editor.addItem('experience')}
            onUpdate={(itemId, field, value) => editor.updateItem('experience', itemId, field, value)}
            onRemove={(itemId) => editor.removeItem('experience', itemId)}
            onDuplicate={(itemId) => editor.duplicateItem('experience', itemId)}
            onReorder={(from, to) => editor.reorderSection('experience', from, to)}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            items={resume.projects}
            onAdd={() => editor.addItem('projects')}
            onUpdate={(itemId, field, value) => editor.updateItem('projects', itemId, field, value)}
            onRemove={(itemId) => editor.removeItem('projects', itemId)}
            onDuplicate={(itemId) => editor.duplicateItem('projects', itemId)}
            onReorder={(from, to) => editor.reorderSection('projects', from, to)}
          />
        );
      case 'achievements':
        return (
          <AchievementsSection
            items={resume.achievements}
            onAdd={() => editor.addItem('achievements')}
            onUpdate={(itemId, field, value) => editor.updateItem('achievements', itemId, field, value)}
            onRemove={(itemId) => editor.removeItem('achievements', itemId)}
            onDuplicate={(itemId) => editor.duplicateItem('achievements', itemId)}
            onReorder={(from, to) => editor.reorderSection('achievements', from, to)}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            items={resume.skills}
            resume={resume}
            onAdd={() => editor.addItem('skills')}
            onUpdate={(itemId, field, value) => editor.updateItem('skills', itemId, field, value)}
            onRemove={(itemId) => editor.removeItem('skills', itemId)}
            onReorder={(from, to) => editor.reorderSection('skills', from, to)}
          />
        );
      default: {
        const config = LIST_SECTION_CONFIGS[activeSection];
        if (!config) return null;
        return (
          <GenericListSection
            items={resume[activeSection] || []}
            fields={config.fields}
            titleField={config.titleField}
            subtitleField={config.subtitleField}
            addLabel={config.addLabel}
            onAdd={() => editor.addItem(activeSection)}
            onUpdate={(itemId, field, value) => editor.updateItem(activeSection, itemId, field, value)}
            onRemove={(itemId) => editor.removeItem(activeSection, itemId)}
            onDuplicate={(itemId) => editor.duplicateItem(activeSection, itemId)}
            onReorder={(from, to) => editor.reorderSection(activeSection, from, to)}
          />
        );
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <ResumeToolbar
        resumeId={resume._id}
        title={resume.title}
        onTitleChange={editor.setTitle}
        saveStatus={editor.saveStatus}
        onOpenTemplates={() => setTemplateOpen(true)}
      />

      <div className="no-print border-b border-slate-200 px-2 py-2 dark:border-slate-800 lg:hidden">
        <Tabs tabs={MOBILE_TABS} active={mobileTab} onChange={setMobileTab} />
      </div>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[200px_minmax(320px,1fr)_minmax(360px,1.1fr)_300px]">
        <div className={`overflow-y-auto border-r border-slate-200 dark:border-slate-800 ${mobileTab === 'form' ? 'block' : 'hidden'} lg:block`}>
          <ResumeFormSidebar active={activeSection} onSelect={setActiveSection} className="lg:sticky lg:top-0" />
        </div>

        <div className={`overflow-y-auto p-5 ${mobileTab === 'form' ? 'block' : 'hidden'} lg:block`}>{renderSection()}</div>

        <div className={`overflow-hidden border-l border-r border-slate-200 dark:border-slate-800 ${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block`}>
          <ResumePreview resume={resume} />
        </div>

        <div className={`overflow-hidden ${mobileTab === 'ai' ? 'block' : 'hidden'} lg:block`}>
          <AIAssistantPanel resume={resume} onNavigateSection={setActiveSection} onAtsResult={editor.setAtsResult} />
        </div>
      </div>

      <TemplateSelector open={templateOpen} onClose={() => setTemplateOpen(false)} resume={resume} onSelect={editor.setTemplate} />
    </div>
  );
}

export default ResumeEdit;
