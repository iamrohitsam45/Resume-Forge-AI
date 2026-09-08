export const LIST_SECTION_CONFIGS = {
  education: {
    titleField: 'degree',
    subtitleField: 'university',
    addLabel: 'Add Education',
    fields: [
      { key: 'degree', label: 'Degree', placeholder: 'B.S.' },
      { key: 'field', label: 'Field', placeholder: 'Computer Science' },
      { key: 'university', label: 'University', placeholder: 'University of Texas at Austin', span: 2 },
      { key: 'location', label: 'Location', placeholder: 'Austin, TX' },
      { key: 'gpa', label: 'GPA', placeholder: '3.7' },
      { key: 'startDate', label: 'Start Date', placeholder: 'Aug 2018' },
      { key: 'endDate', label: 'End Date', placeholder: 'May 2022' },
    ],
  },
  certifications: {
    titleField: 'name',
    subtitleField: 'issuer',
    addLabel: 'Add Certification',
    fields: [
      { key: 'name', label: 'Certification Name', placeholder: 'AWS Certified Cloud Practitioner', span: 2 },
      { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services' },
      { key: 'date', label: 'Date', placeholder: '2023' },
      { key: 'credentialUrl', label: 'Credential URL', placeholder: 'https://...', span: 2 },
    ],
  },
  languages: {
    titleField: 'name',
    subtitleField: 'proficiency',
    addLabel: 'Add Language',
    fields: [
      { key: 'name', label: 'Language', placeholder: 'Spanish' },
      {
        key: 'proficiency',
        label: 'Proficiency',
        type: 'select',
        options: ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'].map((v) => ({ value: v, label: v })),
      },
    ],
  },
  awards: {
    titleField: 'title',
    subtitleField: 'issuer',
    addLabel: 'Add Award',
    fields: [
      { key: 'title', label: 'Award Title', placeholder: "Dean's List", span: 2 },
      { key: 'issuer', label: 'Issuer', placeholder: 'University of Texas at Austin' },
      { key: 'date', label: 'Date', placeholder: '2021' },
      { key: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },
  volunteer: {
    titleField: 'role',
    subtitleField: 'organization',
    addLabel: 'Add Volunteer Experience',
    fields: [
      { key: 'role', label: 'Role', placeholder: 'Mentor' },
      { key: 'organization', label: 'Organization', placeholder: 'Code for Austin' },
      { key: 'startDate', label: 'Start Date', placeholder: 'Jan 2021' },
      { key: 'endDate', label: 'End Date', placeholder: 'Dec 2021' },
      { key: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },
  publications: {
    titleField: 'title',
    subtitleField: 'publisher',
    addLabel: 'Add Publication',
    fields: [
      { key: 'title', label: 'Title', placeholder: 'Scaling Real-Time Systems', span: 2 },
      { key: 'publisher', label: 'Publisher', placeholder: 'IEEE' },
      { key: 'date', label: 'Date', placeholder: '2023' },
      { key: 'url', label: 'URL', placeholder: 'https://...', span: 2 },
      { key: 'description', label: 'Description', type: 'textarea', span: 2 },
    ],
  },
  links: {
    titleField: 'label',
    subtitleField: 'url',
    addLabel: 'Add Link',
    fields: [
      { key: 'label', label: 'Label', placeholder: 'Portfolio' },
      { key: 'url', label: 'URL', placeholder: 'yourdomain.dev' },
    ],
  },
};

export default LIST_SECTION_CONFIGS;
