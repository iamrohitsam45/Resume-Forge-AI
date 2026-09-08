import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';
import resumeService from '../services/resumeService.js';
import { uid } from '../utils/id.js';
import useAutosave from './useAutosave.js';

const LIST_SECTIONS = [
  'experience', 'education', 'skills', 'projects', 'achievements',
  'certifications', 'languages', 'awards', 'volunteer', 'publications', 'links',
];

const EMPTY_ITEM_FACTORY = {
  experience: () => ({ _id: uid(), company: '', role: '', location: '', employmentType: '', startDate: '', endDate: '', current: false, description: '', technologies: [], achievements: [] }),
  education: () => ({ _id: uid(), degree: '', field: '', university: '', location: '', startDate: '', endDate: '', gpa: '', coursework: [] }),
  skills: () => ({ _id: uid(), category: 'New Category', items: [] }),
  projects: () => ({ _id: uid(), name: '', type: '', description: '', technologies: [], githubUrl: '', liveUrl: '', startDate: '', endDate: '', bullets: [] }),
  achievements: () => ({ _id: uid(), title: '', organization: '', date: '', description: '' }),
  certifications: () => ({ _id: uid(), name: '', issuer: '', date: '', credentialUrl: '' }),
  languages: () => ({ _id: uid(), name: '', proficiency: 'Professional' }),
  awards: () => ({ _id: uid(), title: '', issuer: '', date: '', description: '' }),
  volunteer: () => ({ _id: uid(), organization: '', role: '', startDate: '', endDate: '', description: '' }),
  publications: () => ({ _id: uid(), title: '', publisher: '', date: '', url: '', description: '' }),
  links: () => ({ _id: uid(), label: '', url: '' }),
};

export function useResumeEditor(resumeId) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resumeService
      .get(resumeId)
      .then((data) => !cancelled && setResume(data))
      .catch((err) => !cancelled && setError(err?.response?.data?.message || 'Failed to load resume'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  const saveStatus = useAutosave(
    resume,
    async (data) => {
      if (!data?._id) return;
      const payload = stripForSave(data);
      const saved = await resumeService.update(data._id, payload);
      setResume((prev) => (prev ? { ...prev, updatedAt: saved.updatedAt } : prev));
    },
    { delay: 1000, enabled: Boolean(resume) }
  );

  const update = useCallback((recipe) => {
    setResume((prev) => (prev ? produce(prev, recipe) : prev));
  }, []);

  const updatePersonal = useCallback(
    (field, value) => update((draft) => { draft.personal[field] = value; }),
    [update]
  );

  const updateSummary = useCallback(
    (field, value) => update((draft) => { draft.summary[field] = value; }),
    [update]
  );

  const setTitle = useCallback((title) => update((draft) => { draft.title = title; }), [update]);
  const setTemplate = useCallback((template) => update((draft) => { draft.template = template; }), [update]);
  const setPageSize = useCallback((pageSize) => update((draft) => { draft.pageSize = pageSize; }), [update]);
  const setJobDescription = useCallback((jobDescription) => update((draft) => { draft.jobDescription = jobDescription; }), [update]);

  const addItem = useCallback(
    (section) => update((draft) => { draft[section] = draft[section] || []; draft[section].push(EMPTY_ITEM_FACTORY[section]()); }),
    [update]
  );

  const updateItem = useCallback(
    (section, itemId, field, value) =>
      update((draft) => {
        const item = draft[section]?.find((i) => (i._id || i.id) === itemId);
        if (item) item[field] = value;
      }),
    [update]
  );

  const removeItem = useCallback(
    (section, itemId) =>
      update((draft) => {
        draft[section] = draft[section].filter((i) => (i._id || i.id) !== itemId);
      }),
    [update]
  );

  const duplicateItem = useCallback(
    (section, itemId) =>
      update((draft) => {
        const idx = draft[section].findIndex((i) => (i._id || i.id) === itemId);
        if (idx !== -1) {
          const clone = { ...JSON.parse(JSON.stringify(draft[section][idx])), _id: uid() };
          draft[section].splice(idx + 1, 0, clone);
        }
      }),
    [update]
  );

  const reorderSection = useCallback(
    (section, fromIndex, toIndex) =>
      update((draft) => {
        const arr = draft[section];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
      }),
    [update]
  );

  const reorderSectionOrder = useCallback(
    (fromIndex, toIndex) =>
      update((draft) => {
        const [moved] = draft.sectionOrder.splice(fromIndex, 1);
        draft.sectionOrder.splice(toIndex, 0, moved);
      }),
    [update]
  );

  const toggleSectionVisibility = useCallback(
    (key) =>
      update((draft) => {
        draft.sectionVisibility = draft.sectionVisibility || {};
        draft.sectionVisibility[key] = draft.sectionVisibility[key] === false;
      }),
    [update]
  );

  const setAtsResult = useCallback(
    (analysis) => update((draft) => { draft.atsScore = analysis.score; draft.atsAnalysis = analysis; }),
    [update]
  );

  return {
    resume,
    loading,
    error,
    saveStatus,
    setResume,
    update,
    updatePersonal,
    updateSummary,
    setTitle,
    setTemplate,
    setPageSize,
    setJobDescription,
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    reorderSection,
    reorderSectionOrder,
    toggleSectionVisibility,
    setAtsResult,
    LIST_SECTIONS,
  };
}

function stripForSave(resume) {
  // eslint-disable-next-line no-unused-vars
  const { _id, createdAt, updatedAt, userId, __v, ...rest } = resume;
  return rest;
}

export default useResumeEditor;
