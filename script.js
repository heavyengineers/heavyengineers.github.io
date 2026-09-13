const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const htmlEditor = document.getElementById('htmlEditor');
const htmlPreview = document.getElementById('htmlPreview');
const runCodeButton = document.getElementById('runCode');
const resetCodeButton = document.getElementById('resetCode');

const defaultHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Heavy Engineers</title>
  </head>
  <body>
    <h1>Hello from Heavy Engineers</h1>
    <p>This is your first HTML lesson.</p>
    <a href="https://heavyengineers.github.io/">Visit the website</a>
  </body>
</html>`;

const renderHtml = () => {
  if (!htmlEditor || !htmlPreview) return;

  const value = htmlEditor.value.trim() || defaultHtml;
  htmlPreview.srcdoc = value;
};

if (htmlEditor) {
  htmlEditor.value = defaultHtml;
  renderHtml();
}

if (runCodeButton) {
  runCodeButton.addEventListener('click', renderHtml);
}

if (resetCodeButton) {
  resetCodeButton.addEventListener('click', () => {
    if (!htmlEditor) return;
    htmlEditor.value = defaultHtml;
    renderHtml();
  });
}

const courseLinks = document.querySelectorAll('.course-nav a');
courseLinks.forEach((link) => {
  link.addEventListener('click', () => {
    courseLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isUpcomingCourse(course) {
  return Boolean(course?.isUpcoming || course?.status === 'upcoming');
}

function renderCourseCard(course) {
  const isUpcoming = isUpcomingCourse(course);
  const href = isUpcoming ? '#' : (course.path || `course.html?course=${encodeURIComponent(course.slug)}`);
  const meta = (course.meta || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  const badgeText = course.badge || (isUpcoming ? 'Upcoming' : 'Free');
  const badgeClass = isUpcoming ? ' upcoming-badge' : (course.badgeStyle === 'alt' ? ' alt-badge' : '');
  const actionMarkup = isUpcoming
    ? `<button type="button" class="secondary-btn small-btn upcoming-notify-btn" data-course-slug="${escapeHtml(course.slug || '')}" data-course-title="${escapeHtml(course.title || '')}">Notify me</button>`
    : `<a class="secondary-btn small-btn" href="${href}">Start learning</a>`;

  return `
    <article class="card course-card ${isUpcoming ? 'is-upcoming' : ''}">
      <div class="course-badge${badgeClass}">${escapeHtml(badgeText)}</div>
      <div class="icon-box">${escapeHtml(course.icon || '📘')}</div>
      <h3>${escapeHtml(course.title)}</h3>
      <p>${escapeHtml(course.description || '')}</p>
      <div class="course-meta">${meta}</div>
      <div class="course-price-row">
        <strong>${escapeHtml(isUpcoming ? 'Soon' : 'Free')}</strong>
        ${actionMarkup}
      </div>
    </article>
  `;
}

async function renderCourseGrid(targetSelector, options = {}) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const response = await fetch('courses-data.json');
    const data = await response.json();
    const courses = Array.isArray(data.courses) ? data.courses : [];
    const visibleCourses = options.onlyUpcoming
      ? courses.filter(isUpcomingCourse)
      : courses.filter((course) => !isUpcomingCourse(course));

    target.innerHTML = visibleCourses.map(renderCourseCard).join('');
  } catch (error) {
    target.innerHTML = '<article class="card course-card"><div class="course-badge">Free</div><h3>Course library unavailable</h3><p>Unable to load the course catalog right now.</p></article>';
  }
}

function getSectionKey(section) {
  return section.slug || section.id;
}

function getSectionLink(course, section) {
  return `course.html?course=${encodeURIComponent(course.slug)}&section=${encodeURIComponent(getSectionKey(section))}`;
}

function renderVisualMarkup(visual) {
  if (!visual) return '';

  if (visual.type === 'mermaid') {
    return `
      <div class="diagram-card">
        <pre class="mermaid">${escapeHtml(visual.code || '')}</pre>
      </div>
    `;
  }

  if (visual.type === 'image') {
    return `
      <figure class="lesson-figure">
        <img src="${escapeHtml(visual.src || '')}" alt="${escapeHtml(visual.alt || 'Course illustration')}" />
        ${visual.caption ? `<figcaption>${escapeHtml(visual.caption)}</figcaption>` : ''}
      </figure>
    `;
  }

  return '';
}

function normalizeHtmlSnippet(snippet) {
  const trimmed = String(snippet || '').trim();
  if (!trimmed) {
    return '<!DOCTYPE html><html><body><p>Start coding here.</p></body></html>';
  }

  if (/^<!DOCTYPE html|^<html\b/i.test(trimmed)) {
    return trimmed;
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 24px;
        color: #0f172a;
        background: linear-gradient(135deg, #f8fafc, #eef2ff);
      }
      h1, h2, h3, p, ul, ol, form, table, nav, section, article, footer {
        margin-top: 0;
      }
      a { color: #7c3aed; }
      code { background: rgba(124, 58, 237, 0.08); padding: 2px 6px; border-radius: 6px; }
      form { display: grid; gap: 10px; max-width: 380px; }
      input, button { padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
      button { background: #7c3aed; color: white; border: none; }
      table { border-collapse: collapse; }
      th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
    </style>
  </head>
  <body>
    ${trimmed}
  </body>
</html>`;
}

function renderSectionMarkup(section, sectionIndex, courseSlug = '') {
  const headingTag = sectionIndex === 0 ? 'h1' : 'h2';
  const paragraphHtml = Array.isArray(section.paragraphs)
    ? section.paragraphs.map((text) => `<p class="lesson-body">${escapeHtml(text)}</p>`).join('')
    : '';
  const cardsHtml = Array.isArray(section.cards)
    ? `<div class="lesson-grid">${section.cards.map((card) => `
        <div class="lesson-card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </div>
      `).join('')}</div>`
    : '';
  const listHtml = Array.isArray(section.list)
    ? `<ul class="bullet-list">${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';
  const codeBlocksHtml = Array.isArray(section.codeBlocks)
    ? section.codeBlocks.map((code) => `<pre class="code-block">${escapeHtml(code)}</pre>`).join('')
    : '';
  const visualsHtml = Array.isArray(section.visuals)
    ? section.visuals.map(renderVisualMarkup).join('')
    : '';
  const challengeHtml = section.challenge
    ? `<div class="challenge-box">${escapeHtml(section.challenge)}</div>`
    : '';
  const shouldAutoGenerateHtmlEditor = courseSlug === 'html' && !section.editor && Array.isArray(section.codeBlocks) && section.codeBlocks.length;
  const generatedEditor = shouldAutoGenerateHtmlEditor
    ? renderEditorMarkup(section.id, { type: 'html', label: 'Live output', defaultHtml: normalizeHtmlSnippet(section.codeBlocks[0]) })
    : '';
  const editorHtml = section.editor ? renderEditorMarkup(section.id, section.editor) : generatedEditor;

  return `
    <section id="${section.id}" class="course-section">
      <span class="section-label">${escapeHtml(section.label || `Lesson ${sectionIndex + 1}`)}</span>
      <${headingTag}>${escapeHtml(section.title)}</${headingTag}>
      ${section.intro ? `<p class="course-intro">${escapeHtml(section.intro)}</p>` : ''}
      ${paragraphHtml}
      ${cardsHtml}
      ${visualsHtml}
      ${listHtml}
      ${codeBlocksHtml}
      ${challengeHtml}
      ${editorHtml}
    </section>
  `;
}

function renderOverviewPage(course) {
  return `
    <section class="course-section course-overview">
      <span class="section-label">Course overview</span>
      <h1>${escapeHtml(course.title)}</h1>
      <p class="course-intro">${escapeHtml(course.description || '')}</p>
      <div class="overview-grid">
        ${course.sections.map((section, index) => `
          <a class="lesson-summary-card" href="${getSectionLink(course, section)}">
            <span class="lesson-summary-label">${escapeHtml(section.label || `Lesson ${index + 1}`)}</span>
            <h3>${escapeHtml(section.title)}</h3>
            <p>${escapeHtml(section.intro || '')}</p>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderSectionPage(course, section, sectionIndex) {
  const prevIndex = sectionIndex > 0 ? sectionIndex - 1 : null;
  const nextIndex = sectionIndex < course.sections.length - 1 ? sectionIndex + 1 : null;
  const prevSection = prevIndex !== null ? course.sections[prevIndex] : null;
  const nextSection = nextIndex !== null ? course.sections[nextIndex] : null;

  const pagination = `
    <div class="lesson-pager">
      ${prevSection ? `<a class="secondary-btn small-btn" href="${getSectionLink(course, prevSection)}">← Previous</a>` : '<span></span>'}
      ${nextSection ? `<a class="primary-btn small-btn" href="${getSectionLink(course, nextSection)}">Next →</a>` : '<span></span>'}
    </div>
  `;

  return `
    ${renderSectionMarkup(section, sectionIndex, course.slug)}
    ${pagination}
  `;
}

function renderEditorMarkup(sectionId, editorConfig) {
  if (editorConfig.type === 'html') {
    return `
      <div class="editor-panel">
        <div class="editor-header">
          <span>${escapeHtml(editorConfig.label || 'Live HTML preview')}</span>
          <div class="editor-actions">
            <button type="button" data-run-html-editor="${sectionId}" class="primary-btn small-inline">Run code</button>
            <button type="button" data-reset-html-editor="${sectionId}" class="secondary-btn small-inline">Reset</button>
          </div>
        </div>
        <textarea id="htmlEditor-${sectionId}" aria-label="HTML editor">${escapeHtml(editorConfig.defaultHtml || '')}</textarea>
        <iframe id="htmlPreview-${sectionId}" title="HTML preview"></iframe>
      </div>
    `;
  }

  return `
    <div class="sql-shell">
      <div class="editor-header">
        <span>${escapeHtml(editorConfig.label || 'SQL practice lab')}</span>
        <div class="editor-actions">
          <button type="button" data-run-sql-editor="${sectionId}" class="primary-btn small-inline">Run query</button>
          <button type="button" data-reset-sql-editor="${sectionId}" class="secondary-btn small-inline">Reset</button>
        </div>
      </div>
      <textarea id="sqlEditor-${sectionId}" aria-label="SQL editor">${escapeHtml(editorConfig.defaultQuery || '')}</textarea>
      <div id="sqlOutput-${sectionId}" class="sql-output" aria-live="polite"></div>
    </div>
  `;
}

async function ensureSqlLibrary() {
  if (window.__heSqlLibrary) {
    return window.__heSqlLibrary;
  }

  if (!window.initSqlJs) {
    return null;
  }

  const SQL = await window.initSqlJs({
    locateFile: (fileName) => `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${fileName}`,
  });

  window.__heSqlLibrary = SQL;
  return SQL;
}

async function attachSqlEditor(sectionId, editorConfig) {
  const editor = document.getElementById(`sqlEditor-${sectionId}`);
  const output = document.getElementById(`sqlOutput-${sectionId}`);
  const runButton = document.querySelector(`[data-run-sql-editor="${sectionId}"]`);
  const resetButton = document.querySelector(`[data-reset-sql-editor="${sectionId}"]`);

  if (!editor || !output) return;

  const SQL = await ensureSqlLibrary();
  if (!SQL) return;

  const db = new SQL.Database();

  if (editorConfig.schema) {
    db.run(editorConfig.schema);
  }

  if (Array.isArray(editorConfig.seedQueries)) {
    editorConfig.seedQueries.forEach((statement) => {
      if (statement) db.run(statement);
    });
  }

  const defaultSql = editorConfig.defaultQuery || '';

  const renderResultTable = (result) => {
    if (!result || !result.values || !result.values.length) {
      output.innerHTML = '<div class="sql-empty">Run a query to see the result.</div>';
      return;
    }

    const headerHtml = result.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    const rowsHtml = result.values.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? 'NULL')}</td>`).join('')}</tr>`).join('');
    output.innerHTML = `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  };

  const executeQuery = () => {
    try {
      const query = editor.value.trim() || defaultSql;
      const resultSet = db.exec(query);
      renderResultTable(resultSet[0]);
    } catch (error) {
      output.innerHTML = `<div class="sql-empty">${escapeHtml(error.message)}</div>`;
    }
  };

  editor.value = defaultSql;
  runButton?.addEventListener('click', executeQuery);
  resetButton?.addEventListener('click', () => {
    editor.value = defaultSql;
    executeQuery();
  });
  executeQuery();
}

function attachHtmlEditor(sectionId, editorConfig) {
  const editor = document.getElementById(`htmlEditor-${sectionId}`);
  const preview = document.getElementById(`htmlPreview-${sectionId}`);
  const runButton = document.querySelector(`[data-run-html-editor="${sectionId}"]`);
  const resetButton = document.querySelector(`[data-reset-html-editor="${sectionId}"]`);

  if (!editor || !preview) return;

  const defaultHtml = editorConfig.defaultHtml || '';
  const renderPreview = () => {
    preview.srcdoc = editor.value.trim() || defaultHtml;
  };

  editor.value = defaultHtml;
  renderPreview();
  runButton?.addEventListener('click', renderPreview);
  resetButton?.addEventListener('click', () => {
    editor.value = defaultHtml;
    renderPreview();
  });
}

async function renderGenericCoursePage() {
  const courseContent = document.getElementById('course-content');
  const courseNav = document.getElementById('course-nav');
  const courseBadge = document.getElementById('course-badge');
  const courseName = document.getElementById('course-name');

  if (!courseContent || !courseNav || !courseBadge || !courseName) {
    return;
  }

  try {
    const response = await fetch('courses-data.json');
    const data = await response.json();
    const courses = Array.isArray(data.courses) ? data.courses : [];
    const params = new URLSearchParams(window.location.search);
    const selectedSlug = params.get('course') || courses[0]?.slug || 'sql';
    const selectedSectionKey = params.get('section');
    const course = courses.find((item) => item.slug === selectedSlug) || courses[0];

    if (!course) {
      courseContent.innerHTML = '<section class="course-section"><h1>Course not found.</h1><p class="course-intro">The selected course could not be loaded.</p></section>';
      return;
    }

    courseBadge.textContent = course.badge || 'Free';
    courseName.textContent = course.title || 'Course';
    document.title = `${course.title} | Heavy Engineers`;

    const activeSection = selectedSectionKey
      ? course.sections.find((section) => getSectionKey(section) === selectedSectionKey)
      : null;
    const visibleSection = activeSection || course.sections[0];
    const visibleIndex = course.sections.findIndex((section) => getSectionKey(section) === getSectionKey(visibleSection));

    courseNav.innerHTML = course.sections.map((section, index) => {
      const sectionKey = getSectionKey(section);
      const isActive = visibleSection && sectionKey === getSectionKey(visibleSection);
      return `
        <a href="${getSectionLink(course, section)}" class="${isActive ? 'active' : ''}">
          <span>${escapeHtml(section.label || `Lesson ${index + 1}`)}</span>
          <strong>${escapeHtml(section.title || `Section ${index + 1}`)}</strong>
        </a>
      `;
    }).join('');

    if (!selectedSectionKey) {
      courseContent.innerHTML = renderOverviewPage(course);
    } else {
      courseContent.innerHTML = renderSectionPage(course, visibleSection, visibleIndex);
    }

    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, theme: 'default' });
      window.mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
    }

    if (selectedSectionKey) {
      const editorConfig = visibleSection.editor || (course.slug === 'html' && Array.isArray(visibleSection.codeBlocks) && visibleSection.codeBlocks.length
        ? { type: 'html', label: 'Live output', defaultHtml: normalizeHtmlSnippet(visibleSection.codeBlocks[0]) }
        : null);

      if (editorConfig) {
        if (editorConfig.type === 'html') {
          attachHtmlEditor(visibleSection.id, editorConfig);
        }

        if (editorConfig.type === 'sql') {
          attachSqlEditor(visibleSection.id, editorConfig);
        }
      }
    }
  } catch (error) {
    courseContent.innerHTML = '<section class="course-section"><h1>Course library error.</h1><p class="course-intro">Unable to render this course from the data source.</p></section>';
  }
}

function initializeNotifyForm() {
  const notifyForm = document.getElementById('notify-form');
  const notifyStatus = document.getElementById('notify-status');
  const courseSelect = document.getElementById('notify-course');

  if (!notifyForm || !courseSelect) {
    return;
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-course-slug]');
    if (!trigger) return;

    const targetCourse = trigger.getAttribute('data-course-title') || 'this course';
    courseSelect.value = trigger.getAttribute('data-course-slug') || '';
    const targetSection = document.getElementById('notify-me');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (notifyStatus) {
      notifyStatus.textContent = `Great choice — we will notify you when ${targetCourse} launches.`;
      notifyStatus.classList.add('visible');
    }
  });

  notifyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(notifyForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      course: String(formData.get('course') || '').trim(),
      createdAt: new Date().toISOString(),
    };

    if (!payload.name || !payload.email || !payload.course) {
      if (notifyStatus) {
        notifyStatus.textContent = 'Please complete your name, email, and selected course to join the waitlist.';
        notifyStatus.classList.add('visible');
      }
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('he-notify-list') || '[]');
      existing.push(payload);
      localStorage.setItem('he-notify-list', JSON.stringify(existing));

      if (notifyStatus) {
        notifyStatus.textContent = `You are on the waitlist for ${payload.course}. We will email ${payload.email} when it launches.`;
        notifyStatus.classList.add('visible');
      }

      notifyForm.reset();
      const defaultSelection = document.querySelector('[data-course-slug]')
        ? document.querySelector('[data-course-slug]').getAttribute('data-course-slug') || ''
        : '';
      if (defaultSelection) {
        courseSelect.value = defaultSelection;
      }
    } catch (error) {
      if (notifyStatus) {
        notifyStatus.textContent = 'There was a problem saving your request. Please try again.';
        notifyStatus.classList.add('visible');
      }
    }
  });
}

(async function initializeDataDrivenCourseSystem() {
  await renderCourseGrid('#featured-course-list');
  await renderCourseGrid('#course-library-grid');
  await renderCourseGrid('#upcoming-course-list', { onlyUpcoming: true });
  await renderCourseGrid('#course-upcoming-grid', { onlyUpcoming: true });
  initializeNotifyForm();
  await renderGenericCoursePage();
})();


