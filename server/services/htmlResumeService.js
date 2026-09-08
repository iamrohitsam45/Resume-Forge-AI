// Renders Resume JSON into a single, ATS-safe HTML document: one column, standard
// headings, selectable text, no tables/images-as-text. Used both for server-side
// PDF export (via pdfService/Puppeteer) and as the source of truth the frontend
// preview visually mirrors. Templates only vary typography/accent color/spacing -
// never structure - so ATS compatibility never regresses per-template.

import { TEMPLATE_STYLES, DEFAULT_TEMPLATE_KEY } from '../constants/templateStyles.js';

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function link(url, label) {
  if (!url) return '';
  const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return `<a href="${esc(href)}">${esc(label || url)}</a>`;
}

function dateRange(start, end, current) {
  const endLabel = current ? 'Present' : end || '';
  return [start, endLabel].filter(Boolean).join(' – ');
}

function section(title, contentHtml) {
  if (!contentHtml || !contentHtml.trim()) return '';
  return `<section class="section"><h2>${esc(title)}</h2>${contentHtml}</section>`;
}

function renderSummary(summary = {}) {
  if (!summary.text) return '';
  return `<p class="summary">${esc(summary.text)}</p>`;
}

function renderExperience(items = []) {
  if (!items.length) return '';
  return items
    .map((e) => {
      const bullets = (e.achievements?.length ? e.achievements : e.description ? [e.description] : []);
      return `<div class="entry">
        <div class="entry-head"><span class="entry-title">${esc(e.role)}${e.company ? ', ' + esc(e.company) : ''}</span><span class="entry-date">${esc(dateRange(e.startDate, e.endDate, e.current))}</span></div>
        ${e.location ? `<div class="entry-sub">${esc(e.location)}</div>` : ''}
        ${bullets.length ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        ${e.technologies?.length ? `<div class="entry-tech">${esc(e.technologies.join(' · '))}</div>` : ''}
      </div>`;
    })
    .join('');
}

function renderEducation(items = []) {
  if (!items.length) return '';
  return items
    .map(
      (e) => `<div class="entry">
        <div class="entry-head"><span class="entry-title">${esc(e.degree)}${e.field ? ' in ' + esc(e.field) : ''}, ${esc(e.university)}</span><span class="entry-date">${esc(dateRange(e.startDate, e.endDate))}</span></div>
        ${e.gpa ? `<div class="entry-sub">GPA: ${esc(e.gpa)}</div>` : ''}
        ${e.coursework?.length ? `<div class="entry-tech">Relevant coursework: ${esc(e.coursework.join(', '))}</div>` : ''}
      </div>`
    )
    .join('');
}

function renderSkills(items = []) {
  const cats = items.filter((c) => c.items?.length);
  if (!cats.length) return '';
  return `<div class="skills">${cats.map((c) => `<div class="skill-row"><span class="skill-cat">${esc(c.category)}:</span> ${esc(c.items.join(', '))}</div>`).join('')}</div>`;
}

function renderProjects(items = []) {
  if (!items.length) return '';
  return items
    .map((p) => {
      const bullets = p.bullets?.length ? p.bullets : p.description ? [p.description] : [];
      const links = [p.githubUrl && link(p.githubUrl, 'GitHub'), p.liveUrl && link(p.liveUrl, 'Live')].filter(Boolean).join(' · ');
      return `<div class="entry">
        <div class="entry-head"><span class="entry-title">${esc(p.name)}</span><span class="entry-date">${esc(dateRange(p.startDate, p.endDate))}</span></div>
        ${links ? `<div class="entry-sub">${links}</div>` : ''}
        ${bullets.length ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        ${p.technologies?.length ? `<div class="entry-tech">${esc(p.technologies.join(' · '))}</div>` : ''}
      </div>`;
    })
    .join('');
}

function renderSimpleList(items, render) {
  if (!items?.length) return '';
  return `<div class="simple-list">${items.map(render).join('')}</div>`;
}

export function resumeToHtml(resume, { forPrint = false } = {}) {
  const styleKey = TEMPLATE_STYLES[resume.template] ? resume.template : DEFAULT_TEMPLATE_KEY;
  const style = TEMPLATE_STYLES[styleKey];
  const p = resume.personal || {};

  const contactBits = [
    p.email,
    p.phone,
    p.location,
    p.linkedin && link(p.linkedin, 'LinkedIn'),
    p.github && link(p.github, 'GitHub'),
    p.portfolio && link(p.portfolio, 'Portfolio'),
  ].filter(Boolean);

  const sectionOrder = resume.sectionOrder?.length
    ? resume.sectionOrder
    : ['summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications'];

  const renderers = {
    summary: () => section('Professional Summary', renderSummary(resume.summary)),
    experience: () => section('Experience', renderExperience(resume.experience)),
    education: () => section('Education', renderEducation(resume.education)),
    skills: () => section('Skills', renderSkills(resume.skills)),
    projects: () => section('Projects', renderProjects(resume.projects)),
    achievements: () =>
      section(
        'Achievements',
        renderSimpleList(resume.achievements, (a) => `<div class="entry"><div class="entry-head"><span class="entry-title">${esc(a.title)}${a.organization ? ' — ' + esc(a.organization) : ''}</span><span class="entry-date">${esc(a.date || '')}</span></div>${a.description ? `<div class="entry-sub">${esc(a.description)}</div>` : ''}</div>`)
      ),
    certifications: () =>
      section(
        'Certifications',
        renderSimpleList(resume.certifications, (c) => `<div class="entry"><div class="entry-head"><span class="entry-title">${esc(c.name)}${c.issuer ? ' — ' + esc(c.issuer) : ''}</span><span class="entry-date">${esc(c.date || '')}</span></div></div>`)
      ),
    languages: () =>
      section('Languages', renderSimpleList(resume.languages, (l) => `<div class="entry-inline">${esc(l.name)} — ${esc(l.proficiency)}</div>`)),
    awards: () =>
      section('Awards', renderSimpleList(resume.awards, (a) => `<div class="entry"><div class="entry-head"><span class="entry-title">${esc(a.title)}${a.issuer ? ' — ' + esc(a.issuer) : ''}</span><span class="entry-date">${esc(a.date || '')}</span></div></div>`)),
    volunteer: () =>
      section(
        'Volunteer Experience',
        renderSimpleList(resume.volunteer, (v) => `<div class="entry"><div class="entry-head"><span class="entry-title">${esc(v.role)}${v.organization ? ', ' + esc(v.organization) : ''}</span><span class="entry-date">${esc(dateRange(v.startDate, v.endDate))}</span></div>${v.description ? `<div class="entry-sub">${esc(v.description)}</div>` : ''}</div>`)
      ),
    publications: () =>
      section('Publications', renderSimpleList(resume.publications, (p2) => `<div class="entry-inline">${esc(p2.title)}${p2.publisher ? ' — ' + esc(p2.publisher) : ''} (${esc(p2.date || '')})</div>`)),
    links: () =>
      section('Links', renderSimpleList(resume.links, (l) => `<div class="entry-inline">${link(l.url, l.label)}</div>`)),
  };

  const body = sectionOrder
    .filter((key) => resume.sectionVisibility?.[key] !== false)
    .map((key) => renderers[key]?.())
    .filter(Boolean)
    .join('');

  const pageSize = resume.pageSize === 'Letter' ? 'letter' : 'A4';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(p.fullName || resume.title || 'Resume')}</title>
<style>
  @page { size: ${pageSize}; margin: 16mm 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: ${style.fontFamily};
    color: ${style.textColor};
    font-size: ${style.baseFontSize};
    line-height: 1.4;
    margin: 0;
    background: #fff;
  }
  .resume { max-width: 800px; margin: 0 auto; padding: ${forPrint ? '0' : '32px'}; }
  .header { text-align: ${style.headerAlign}; margin-bottom: 14px; ${style.headerBorder ? `border-bottom: 2px solid ${style.accent};` : ''} padding-bottom: 8px; }
  .name { font-size: ${style.nameFontSize}; font-weight: 700; color: ${style.accent}; letter-spacing: 0.2px; margin: 0 0 2px; }
  .title { font-size: 13px; color: ${style.textColor}; opacity: 0.85; margin: 0 0 6px; }
  .contact { font-size: 10.5px; color: #444; }
  .contact a { color: ${style.accent}; text-decoration: none; }
  .section { margin-top: 12px; }
  .section h2 {
    font-size: 12.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: ${style.accent};
    border-bottom: 1px solid ${style.ruleColor};
    padding-bottom: 3px;
    margin: 0 0 6px;
  }
  .summary { margin: 0; font-size: 11px; }
  .entry { margin-bottom: 8px; }
  .entry-head { display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 600; gap: 12px; }
  .entry-date { font-weight: 400; color: #555; white-space: nowrap; font-size: 10.5px; }
  .entry-sub { font-size: 10.5px; color: #555; font-style: italic; margin-top: 1px; }
  .entry-tech { font-size: 10px; color: #666; margin-top: 2px; }
  .entry-inline { font-size: 11px; margin-bottom: 3px; }
  ul { margin: 4px 0 0; padding-left: 16px; }
  li { font-size: 10.8px; margin-bottom: 2px; }
  .skills .skill-row { font-size: 10.8px; margin-bottom: 3px; }
  .skill-cat { font-weight: 600; }
  a { color: ${style.accent}; }
</style>
</head>
<body>
  <div class="resume">
    <div class="header">
      <p class="name">${esc(p.fullName || 'Your Name')}</p>
      ${p.title ? `<p class="title">${esc(p.title)}</p>` : ''}
      <p class="contact">${contactBits.join(' &nbsp;|&nbsp; ')}</p>
    </div>
    ${body}
  </div>
</body>
</html>`;
}

export default { resumeToHtml };
