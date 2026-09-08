import { TEMPLATE_STYLES, DEFAULT_TEMPLATE_KEY } from './templateStyles.js';

function dateRange(start, end, current) {
  const endLabel = current ? 'Present' : end || '';
  return [start, endLabel].filter(Boolean).join(' – ');
}

function normalizeUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function Section({ title, style, children, hidden }) {
  if (hidden) return null;
  return (
    <section style={{ marginTop: 12 }}>
      <h2
        style={{
          fontSize: 12.5,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: style.accent,
          borderBottom: `1px solid ${style.ruleColor}`,
          paddingBottom: 3,
          margin: '0 0 6px',
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function EntryHead({ title, date }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11.5, fontWeight: 600 }}>
      <span>{title}</span>
      <span style={{ fontWeight: 400, color: '#555', whiteSpace: 'nowrap', fontSize: 10.5 }}>{date}</span>
    </div>
  );
}

const SECTION_RENDERERS = {
  summary: (resume, style) => {
    if (!resume.summary?.text) return null;
    return (
      <Section title="Professional Summary" style={style}>
        <p style={{ margin: 0, fontSize: 11 }}>{resume.summary.text}</p>
      </Section>
    );
  },
  experience: (resume, style) => {
    const items = resume.experience || [];
    if (!items.length) return null;
    return (
      <Section title="Experience" style={style}>
        {items.map((e, i) => {
          const bullets = e.achievements?.length ? e.achievements : e.description ? [e.description] : [];
          return (
            <div key={e._id || i} style={{ marginBottom: 8 }}>
              <EntryHead title={`${e.role || ''}${e.company ? ', ' + e.company : ''}`} date={dateRange(e.startDate, e.endDate, e.current)} />
              {e.location && <div style={{ fontSize: 10.5, color: '#555', fontStyle: 'italic', marginTop: 1 }}>{e.location}</div>}
              {bullets.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {bullets.map((b, bi) => (
                    <li key={bi} style={{ fontSize: 10.8, marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
              {e.technologies?.length > 0 && (
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{e.technologies.join(' · ')}</div>
              )}
            </div>
          );
        })}
      </Section>
    );
  },
  education: (resume, style) => {
    const items = resume.education || [];
    if (!items.length) return null;
    return (
      <Section title="Education" style={style}>
        {items.map((e, i) => (
          <div key={e._id || i} style={{ marginBottom: 8 }}>
            <EntryHead title={`${e.degree || ''}${e.field ? ' in ' + e.field : ''}${e.university ? ', ' + e.university : ''}`} date={dateRange(e.startDate, e.endDate)} />
            {e.gpa && <div style={{ fontSize: 10.5, color: '#555', fontStyle: 'italic', marginTop: 1 }}>GPA: {e.gpa}</div>}
            {e.coursework?.length > 0 && <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Relevant coursework: {e.coursework.join(', ')}</div>}
          </div>
        ))}
      </Section>
    );
  },
  skills: (resume, style) => {
    const cats = (resume.skills || []).filter((c) => c.items?.length);
    if (!cats.length) return null;
    return (
      <Section title="Skills" style={style}>
        {cats.map((c, i) => (
          <div key={i} style={{ fontSize: 10.8, marginBottom: 3 }}>
            <span style={{ fontWeight: 600 }}>{c.category}:</span> {c.items.join(', ')}
          </div>
        ))}
      </Section>
    );
  },
  projects: (resume, style) => {
    const items = resume.projects || [];
    if (!items.length) return null;
    return (
      <Section title="Projects" style={style}>
        {items.map((p, i) => {
          const bullets = p.bullets?.length ? p.bullets : p.description ? [p.description] : [];
          const links = [
            p.githubUrl && { href: normalizeUrl(p.githubUrl), label: 'GitHub' },
            p.liveUrl && { href: normalizeUrl(p.liveUrl), label: 'Live' },
          ].filter(Boolean);
          return (
            <div key={p._id || i} style={{ marginBottom: 8 }}>
              <EntryHead title={p.name || ''} date={dateRange(p.startDate, p.endDate)} />
              {links.length > 0 && (
                <div style={{ fontSize: 10.5, color: '#555', marginTop: 1 }}>
                  {links.map((l, li) => (
                    <a key={li} href={l.href} target="_blank" rel="noreferrer" style={{ color: style.accent, marginRight: 8, textDecoration: 'none' }}>
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
              {bullets.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {bullets.map((b, bi) => (
                    <li key={bi} style={{ fontSize: 10.8, marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
              {p.technologies?.length > 0 && <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{p.technologies.join(' · ')}</div>}
            </div>
          );
        })}
      </Section>
    );
  },
  achievements: (resume, style) => {
    const items = resume.achievements || [];
    if (!items.length) return null;
    return (
      <Section title="Achievements" style={style}>
        {items.map((a, i) => (
          <div key={a._id || i} style={{ marginBottom: 6 }}>
            <EntryHead title={`${a.title || ''}${a.organization ? ' — ' + a.organization : ''}`} date={a.date || ''} />
            {a.description && <div style={{ fontSize: 10.5, color: '#555', marginTop: 1 }}>{a.description}</div>}
          </div>
        ))}
      </Section>
    );
  },
  certifications: (resume, style) => {
    const items = resume.certifications || [];
    if (!items.length) return null;
    return (
      <Section title="Certifications" style={style}>
        {items.map((c, i) => (
          <EntryHead key={c._id || i} title={`${c.name || ''}${c.issuer ? ' — ' + c.issuer : ''}`} date={c.date || ''} />
        ))}
      </Section>
    );
  },
  languages: (resume, style) => {
    const items = resume.languages || [];
    if (!items.length) return null;
    return (
      <Section title="Languages" style={style}>
        {items.map((l, i) => (
          <div key={l._id || i} style={{ fontSize: 11, marginBottom: 3 }}>{l.name} — {l.proficiency}</div>
        ))}
      </Section>
    );
  },
  awards: (resume, style) => {
    const items = resume.awards || [];
    if (!items.length) return null;
    return (
      <Section title="Awards" style={style}>
        {items.map((a, i) => (
          <EntryHead key={a._id || i} title={`${a.title || ''}${a.issuer ? ' — ' + a.issuer : ''}`} date={a.date || ''} />
        ))}
      </Section>
    );
  },
  volunteer: (resume, style) => {
    const items = resume.volunteer || [];
    if (!items.length) return null;
    return (
      <Section title="Volunteer Experience" style={style}>
        {items.map((v, i) => (
          <div key={v._id || i} style={{ marginBottom: 6 }}>
            <EntryHead title={`${v.role || ''}${v.organization ? ', ' + v.organization : ''}`} date={dateRange(v.startDate, v.endDate)} />
            {v.description && <div style={{ fontSize: 10.5, color: '#555', marginTop: 1 }}>{v.description}</div>}
          </div>
        ))}
      </Section>
    );
  },
  publications: (resume, style) => {
    const items = resume.publications || [];
    if (!items.length) return null;
    return (
      <Section title="Publications" style={style}>
        {items.map((p, i) => (
          <div key={p._id || i} style={{ fontSize: 11, marginBottom: 3 }}>
            {p.title}{p.publisher ? ` — ${p.publisher}` : ''} {p.date ? `(${p.date})` : ''}
          </div>
        ))}
      </Section>
    );
  },
  links: (resume, style) => {
    const items = resume.links || [];
    if (!items.length) return null;
    return (
      <Section title="Links" style={style}>
        {items.map((l, i) => (
          <div key={l._id || i} style={{ fontSize: 11, marginBottom: 3 }}>
            <a href={normalizeUrl(l.url)} target="_blank" rel="noreferrer" style={{ color: style.accent }}>{l.label || l.url}</a>
          </div>
        ))}
      </Section>
    );
  },
};

export default function ResumeDocument({ resume, className = '' }) {
  const styleKey = TEMPLATE_STYLES[resume.template] ? resume.template : DEFAULT_TEMPLATE_KEY;
  const style = TEMPLATE_STYLES[styleKey];
  const p = resume.personal || {};
  const sectionOrder = resume.sectionOrder?.length ? resume.sectionOrder : Object.keys(SECTION_RENDERERS);

  const contactBits = [
    p.email,
    p.phone,
    p.location,
    p.linkedin && (
      <a key="li" href={normalizeUrl(p.linkedin)} target="_blank" rel="noreferrer" style={{ color: style.accent, textDecoration: 'none' }}>LinkedIn</a>
    ),
    p.github && (
      <a key="gh" href={normalizeUrl(p.github)} target="_blank" rel="noreferrer" style={{ color: style.accent, textDecoration: 'none' }}>GitHub</a>
    ),
    p.portfolio && (
      <a key="pf" href={normalizeUrl(p.portfolio)} target="_blank" rel="noreferrer" style={{ color: style.accent, textDecoration: 'none' }}>Portfolio</a>
    ),
  ].filter(Boolean);

  return (
    <div
      className={className}
      style={{
        fontFamily: style.fontFamily,
        color: style.textColor,
        fontSize: 11,
        lineHeight: 1.4,
        background: '#fff',
        padding: '32px 36px',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          textAlign: style.headerAlign,
          marginBottom: 14,
          borderBottom: style.headerBorder ? `2px solid ${style.accent}` : 'none',
          paddingBottom: 8,
        }}
      >
        <p style={{ fontSize: 24, fontWeight: 700, color: style.accent, margin: '0 0 2px', letterSpacing: 0.2 }}>
          {p.fullName || 'Your Name'}
        </p>
        {p.title && <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 6px' }}>{p.title}</p>}
        <p style={{ fontSize: 10.5, color: '#444' }}>
          {contactBits.map((bit, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: '0 6px' }}>|</span>}
              {bit}
            </span>
          ))}
        </p>
      </div>

      {sectionOrder
        .filter((key) => resume.sectionVisibility?.[key] !== false)
        .map((key) => (
          <div key={key}>{SECTION_RENDERERS[key]?.(resume, style)}</div>
        ))}
    </div>
  );
}
