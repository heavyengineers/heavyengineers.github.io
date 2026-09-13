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

function renderRichText(value) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  output = output.replace(/==([^=]+)==/g, '<mark>$1</mark>');
  output = output.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  return output;
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

const expertReadingGuides = {
  intro: {
    thesis: 'SQL is best learned as a reasoning discipline: model the question, inspect the available evidence, write a small hypothesis, and verify it against the database.',
    lenses: [
      ['The mental model', 'Separate the business question from the SQL syntax. First name the entity, the measure, the time boundary, and the level of detail you need. Only then choose SELECT, JOIN, GROUP BY, or a window function.'],
      ['The production habit', 'A trustworthy query has an audience and a contract. Decide whether the result is for a dashboard, an API, an audit, or an investigation. Each use case has different expectations for freshness, nulls, duplicates, and latency.'],
      ['The deliberate practice', 'Run the same query after changing one clause. Compare the row count, columns, ordering, and null behavior. This is more valuable than copying a long query because it teaches cause and effect.']
    ],
    questions: ['What does one row represent in this result?', 'Which assumption would make this query misleading?', 'How would you validate the answer with a second query?']
  },
  'database-model': {
    thesis: 'A relational schema is a set of promises about identity, ownership, optionality, and repetition. Query quality starts with understanding those promises.',
    lenses: [
      ['Identity and lifecycle', 'Ask when a record is created, whether its identity can change, and whether the system needs a surrogate key or a meaningful natural key. The answer affects deduplication, references, and historical accuracy.'],
      ['Cardinality', 'One-to-one, one-to-many, and many-to-many relationships produce different result shapes. A join can multiply rows without being wrong; the engineer must know whether that multiplication represents real facts or accidental duplication.'],
      ['Normalization and boundaries', 'Normalize facts that change independently, then denormalize only when a measured read pattern justifies the cost. Treat denormalization as a consistency decision, not merely a performance trick.']
    ],
    questions: ['What is the grain of every table?', 'Which facts are repeated, and what happens when one copy changes?', 'Which relationship is optional and how should missing data appear?']
  },
  ddl: {
    thesis: 'DDL is executable domain design. Constraints transform informal business rules into guarantees that survive application rewrites, scripts, and multiple services.',
    lenses: [
      ['Constraint design', 'Use NOT NULL for required facts, UNIQUE for alternate identity, CHECK for local invariants, and foreign keys for relationships. A constraint should express a rule the system must never violate, not a temporary validation shortcut.'],
      ['Migration safety', 'A schema change is a deployment across existing data. Consider old application versions, backfills, lock duration, defaults, rollback strategy, and whether a new constraint can be introduced in a staged way.'],
      ['Type semantics', 'Choose types based on meaning and operations. Dates, timestamps, money, identifiers, JSON, and free text have different precision and indexing behavior. A convenient type today can become expensive ambiguity later.']
    ],
    questions: ['Which invalid state should be impossible?', 'Can the constraint be added to existing rows safely?', 'What is the migration plan if the table contains millions of records?']
  },
  dml: {
    thesis: 'DML is where software changes shared reality. Safe mutation requires scope, ordering, atomicity, and verification—not only valid syntax.',
    lenses: [
      ['Mutation boundaries', 'Treat UPDATE and DELETE as commands with a blast radius. Preview the predicate with SELECT, inspect the affected-row count, and make the operation idempotent when retries are possible.'],
      ['Transactions', 'A transaction is useful when several writes must tell one story. Define what must commit together, what isolation anomalies are acceptable, and how the application responds when a lock, constraint, or network failure interrupts the work.'],
      ['Concurrency and auditability', 'Two writers can read the same old value and overwrite one another. Optimistic version columns, row locks, append-only events, or careful conflict handling may be required when correctness matters more than last-write-wins behavior.']
    ],
    questions: ['What happens if this statement runs twice?', 'Which rows must change together?', 'How will you prove what changed after the transaction commits?']
  },
  querying: {
    thesis: 'A SELECT statement is a pipeline of relational transformations. Reading it as a pipeline makes filtering, NULL behavior, ordering, and pagination predictable.',
    lenses: [
      ['Logical order', 'Although SQL is written SELECT-first, the database reasons through FROM, JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, and LIMIT. Knowing this order explains alias errors and why a filter can change aggregate results.'],
      ['NULL and three-valued logic', 'NULL is not zero or an empty string. Comparisons can become UNKNOWN, and WHERE keeps only TRUE. Use IS NULL, COALESCE, and explicit business rules instead of assuming ordinary equality handles missing values.'],
      ['Stable results', 'Pagination and API responses need deterministic ordering. Add a unique tie-breaker, define how nulls sort, and prefer keyset pagination for large moving datasets when offset scans become expensive or inconsistent.']
    ],
    questions: ['At what stage is each filter applied?', 'What should happen to missing values?', 'Can two rows tie under the current ORDER BY?']
  },
  aggregation: {
    thesis: 'Aggregation changes the grain of a result. The most important question is not which function to use, but what one output row means after grouping.',
    lenses: [
      ['Grain before syntax', 'Write a sentence such as “one row per department per month” before writing GROUP BY. Every selected non-aggregate column must belong to that grain or the query is expressing a contradiction.'],
      ['Measurement bias', 'AVG, COUNT, and SUM can be distorted by duplicated joins, missing rows, and filtered populations. Validate denominators, distinguish COUNT(*) from COUNT(column), and make inclusion rules visible.'],
      ['WHERE versus HAVING', 'WHERE changes the input population before groups are formed. HAVING filters groups after their measures exist. Confusing them can produce a query that runs while answering a different business question.']
    ],
    questions: ['What is the denominator for this metric?', 'Does the join duplicate facts before aggregation?', 'Should the filter apply before or after grouping?']
  },
  joins: {
    thesis: 'Joins are relationship reasoning made executable. The join type, key, and filter placement together define which facts survive and how many rows are produced.',
    lenses: [
      ['Preservation', 'Choose the table whose rows must survive as the left side, then choose INNER or LEFT based on whether missing relationships should disappear or remain visible. Make that choice explicit in the query and explanation.'],
      ['Cardinality', 'A one-to-many join intentionally expands rows. If the consumer needs one row per parent, aggregate or rank after joining. If you expected one row and got five, investigate the relationship before adding DISTINCT.'],
      ['Predicate placement', 'Conditions in ON control matching; conditions in WHERE filter the joined result. Moving a condition between them can turn an outer join into an inner-like result and silently remove unmatched records.']
    ],
    questions: ['Which rows must be preserved?', 'What is the expected maximum number of matches per key?', 'Where should the condition live to preserve the intended relationship?']
  },
  subqueries: {
    thesis: 'Subqueries and CTEs let you name intermediate relations. They are valuable when they make the reasoning visible, but abstraction should clarify the data flow rather than hide it.',
    lenses: [
      ['Scalar versus set logic', 'A scalar subquery must return one value, while IN, EXISTS, and a derived table operate on sets. Choosing the wrong form can create cardinality errors or surprising NULL behavior.'],
      ['CTE readability', 'A CTE can act like a named paragraph in a technical argument: establish the population, calculate a measure, then select the final answer. Keep each step cohesive and inspect intermediate results while developing.'],
      ['Planner behavior', 'Readable SQL is not automatically faster SQL. Depending on the engine and version, CTEs may be inlined or materialized. Confirm assumptions with an execution plan and measured workload.']
    ],
    questions: ['What relation does each intermediate step produce?', 'Would EXISTS express intent better than IN?', 'Is this abstraction helping readers or only adding names?']
  },
  'advanced-sql': {
    thesis: 'Advanced SQL is about retaining detail while adding context. Window functions answer “how does this row compare?” without collapsing the underlying rows.',
    lenses: [
      ['Partition and order', 'PARTITION BY defines the comparison group; ORDER BY defines sequence within that group. Change either one and the meaning of rank, running total, or lag changes.'],
      ['Frame semantics', 'A window is not always the entire partition. Running totals, moving averages, and period comparisons depend on the frame boundaries, peer handling, and whether ties share a position.'],
      ['Analytical correctness', 'Ranking is only useful when ties and nulls are intentional. Decide whether the product wants RANK, DENSE_RANK, or ROW_NUMBER, then document what happens when two values are equal.']
    ],
    questions: ['What is the comparison group?', 'What does the first row in the ordering mean?', 'How should ties affect the result?']
  },
  optimization: {
    thesis: 'Performance work is experimental engineering: establish a baseline, inspect the plan, change one variable, and measure the result under a realistic workload.',
    lenses: [
      ['Cost model', 'An index can reduce reads while increasing write cost, storage, cache pressure, and maintenance time. Evaluate the complete workload rather than optimizing one query in isolation.'],
      ['Selectivity and access paths', 'Indexes are most useful when they help the engine narrow the search or satisfy ordering. A low-selectivity column may not help alone, while a composite index can be powerful when its leftmost access pattern matches real filters.'],
      ['Operational reality', 'A fast local query may fail under production data volume, skew, concurrency, or stale statistics. Capture representative plans, latency percentiles, rows examined, and resource usage before deciding that a change worked.']
    ],
    questions: ['What is slow: planning, scanning, joining, sorting, or returning data?', 'Which workload pays the cost of this index?', 'What measurement would falsify the optimization hypothesis?']
  },
  practice: {
    thesis: 'A capstone is a communication exercise as much as a syntax exercise. The best solution explains its model, grain, assumptions, and validation strategy.',
    lenses: [
      ['Decomposition', 'Translate the business request into smaller questions: what is the population, what is the measure, what is the grouping grain, and which groups qualify? Build and verify each relation before composing the final statement.'],
      ['Validation', 'Check totals against an independent query, inspect edge cases, and test a small known dataset. A plausible number is not evidence of correctness unless you can explain why it is plausible.'],
      ['Production handoff', 'A useful SQL answer includes names that communicate intent, stable ordering, documented assumptions, and awareness of cost. The next engineer should be able to maintain it without reverse-engineering your thinking.']
    ],
    questions: ['Can you explain the answer without showing the SQL?', 'Which edge case would expose a hidden assumption?', 'How would this query change when the data grows by 100x?']
  }
};

const htmlExpertReadingGuides = {
  'html-intro': {
    thesis: 'HTML is a document contract between the author, the browser, assistive technology, search engines, and the person reading the page.',
    lenses: [
      ['Structure before decoration', 'A page should still make sense when its CSS is removed. Build the content order and meaning first, then use CSS to create visual hierarchy without changing the underlying story.'],
      ['The browser as an interpreter', 'Browsers recover from imperfect markup, but recovery is not the same as correctness. Invalid nesting, missing metadata, and ambiguous controls create different behavior across tools and make future maintenance harder.'],
      ['The accessibility multiplier', 'Semantic HTML gives many users useful behavior without extra JavaScript: headings create navigation, links expose destinations, buttons expose actions, and landmarks help people move through the page.']
    ],
    questions: ['What would a reader understand if all CSS and images disappeared?', 'Which parts of this page are content, navigation, or action?', 'What meaning does each top-level element communicate?']
  },
  'html-basics': {
    thesis: 'The HTML document is a tree of meaning. A strong foundation makes every later decision—styling, scripting, testing, and SEO—more predictable.',
    lenses: [
      ['Parsing and the DOM', 'The browser tokenizes markup and builds a DOM tree. Indentation helps humans, but nesting determines parent-child relationships, event targeting, inheritance, and how assistive technologies interpret the page.'],
      ['Head metadata', 'The head is not an invisible dumping ground. Charset, viewport, title, description, canonical links, icons, and preload decisions influence compatibility, discoverability, and the first impression in a browser tab or search result.'],
      ['Document validity', 'Standards validation is useful because it catches ambiguous structure early. It does not replace human review, but it is a low-cost way to find broken nesting, missing attributes, and invalid combinations.']
    ],
    questions: ['What is the parent-child relationship of each important element?', 'Which metadata does this page need before it can ship?', 'How would you debug a page whose DOM differs from the source?']
  },
  'html-text': {
    thesis: 'Typography begins in HTML. Headings, paragraphs, emphasis, quotations, and code are not visual guesses; they are editorial signals that help readers navigate meaning.',
    lenses: [
      ['Heading hierarchy', 'Use headings to describe sections, not to obtain a desired font size. A coherent outline helps scanning readers, screen-reader navigation, search engines, and future designers who can style the hierarchy consistently.'],
      ['Inline meaning', 'Use strong for importance, em for stress, mark for relevance, time for dates, and code for literal syntax. Meaningful elements let presentation evolve without losing the editorial intent.'],
      ['Readable composition', 'Long-form pages need rhythm: short paragraphs, descriptive subheadings, lists, examples, and deliberate whitespace. HTML provides the structure that CSS turns into a comfortable reading experience.']
    ],
    questions: ['Can the headings alone tell the story of the page?', 'Is this emphasis semantic or only visual?', 'Where should a reader pause, compare, or copy an example?']
  },
  'html-links-media': {
    thesis: 'Links and media turn a document into a connected experience. Good HTML explains where a link goes and what a visual or recording contributes.',
    lenses: [
      ['Link purpose', 'The clickable text should make sense out of context. Prefer “Read the accessibility guide” over “Click here,” and distinguish navigation, download, external reference, and in-page anchor behavior.'],
      ['Alternative text', 'Alt text is a replacement for meaningful images, not a filename or a caption copied blindly. Decorative images should be ignored by assistive technology, while informative images should communicate their essential conclusion.'],
      ['Performance and resilience', 'Responsive images, lazy loading, dimensions, captions, poster frames, and fallback text help media remain useful on slow networks, small screens, and browsers that cannot play a format.']
    ],
    questions: ['Can a user predict the destination before activating a link?', 'What information would be lost if this image failed?', 'What is the fallback experience for this media?']
  },
  'html-lists-tables': {
    thesis: 'Grouping elements reveal relationships. Lists communicate collections and sequence; tables communicate a two-dimensional relationship between headers and data.',
    lenses: [
      ['Choose by meaning', 'An ordered list implies sequence, an unordered list implies membership, and a description list pairs terms with explanations. Choosing correctly gives readers useful expectations before they read every item.'],
      ['Table relationships', 'Use caption, thead, tbody, th, scope, and sometimes headers to expose which labels describe which cells. A visually aligned grid is not enough for a screen reader or a narrow viewport.'],
      ['Responsive content', 'Do not solve every mobile table with tiny text. Consider prioritizing columns, allowing horizontal scrolling, or transforming data into labeled cards while preserving the underlying relationships.']
    ],
    questions: ['Does order change the meaning of this collection?', 'Which header explains each data cell?', 'How will this grouping behave when content grows or the viewport narrows?']
  },
  'html-forms': {
    thesis: 'A form is a conversation with a user. Its markup should make the requested information, allowed values, errors, and next action clear before JavaScript adds enhancement.',
    lenses: [
      ['Labels and names', 'A label communicates purpose, while name determines what the server receives. Both matter. Placeholder text is a hint and should never replace a persistent label.'],
      ['Native validation', 'Correct input types, required, min, max, pattern, autocomplete, and fieldset/legend give browsers and assistive technologies useful constraints. Native behavior is a foundation, not a substitute for server validation.'],
      ['Error recovery', 'Good forms preserve entered values, identify the invalid field, explain how to fix it, and move focus intelligently. Error text should be associated with the control instead of appearing as unexplained decoration.']
    ],
    questions: ['Can a keyboard user complete the form without a mouse?', 'What exact value will the server receive?', 'How does the user recover after a validation error?']
  },
  'html-accessibility': {
    thesis: 'Accessibility is the quality of the document’s communication. Semantic HTML reduces the amount of custom behavior every user must learn.',
    lenses: [
      ['Landmarks and navigation', 'Header, nav, main, aside, section, article, and footer create a navigable map. Use them because they describe regions, not because they sound more advanced than div.'],
      ['Keyboard and focus', 'Every interactive control needs a visible focus path, logical order, and an operation that does not depend exclusively on pointer gestures. Native links and buttons solve much of this by default.'],
      ['Testing in layers', 'Inspect the DOM, navigate with Tab, zoom the page, test reduced motion, run an automated checker, and if possible use a screen reader. Accessibility is a behavior you verify, not a checkbox you declare.']
    ],
    questions: ['What landmarks can a user navigate directly?', 'What happens when focus enters and leaves this component?', 'Which accessibility assumption has been tested rather than guessed?']
  },
  'html-layout': {
    thesis: 'Semantic layout is the bridge between content architecture and visual design. Good sections make a page easier to style without turning layout containers into meaningless noise.',
    lenses: [
      ['Sectioning content', 'Use section when a region has a thematic heading, article for independently reusable content, and div when no semantic relationship exists. Structure should follow the information architecture.'],
      ['Component boundaries', 'A reusable card, navigation bar, or hero should have a clear responsibility and predictable heading level. Consistent HTML boundaries make CSS and JavaScript less fragile.'],
      ['Progressive enhancement', 'The page should communicate its primary content before advanced interaction loads. HTML is the reliable baseline; CSS improves presentation and JavaScript improves behavior.']
    ],
    questions: ['What is the purpose of each region?', 'Could this content be understood independently?', 'What still works if CSS or JavaScript fails?']
  },
  'html-advanced': {
    thesis: 'Advanced HTML is about dependable platform features: metadata, embedded content, native disclosure, data attributes, and integration points that reduce unnecessary custom code.',
    lenses: [
      ['Use the platform first', 'Details/summary, dialog, picture, source, template, and native form controls can provide robust behavior with less code. Confirm browser support and progressive fallback before adopting them.'],
      ['Data and behavior', 'data-* attributes are useful hooks for JavaScript when the value belongs to the element, but they should not become a hidden database or replace semantic attributes that already express the meaning.'],
      ['Security boundaries', 'Embedded content, external links, forms, and user-generated HTML cross trust boundaries. Consider sandboxing, rel attributes, escaping, validation, and content security policy as part of markup design.']
    ],
    questions: ['Is there a native element that already solves this interaction?', 'What data belongs in markup and what belongs in application state?', 'What is the trust boundary around this embedded or submitted content?']
  },
  'html-project': {
    thesis: 'A real page is a composition exercise: content model, document outline, interaction, accessibility, and visual intent must agree before the page feels finished.',
    lenses: [
      ['Plan the outline', 'Write the page title, major sections, supporting headings, calls to action, and footer content before styling. This prevents attractive layouts from hiding a confused information hierarchy.'],
      ['Design for states', 'Think beyond the happy path: empty content, long titles, validation errors, slow images, keyboard focus, narrow screens, and no JavaScript. Robust HTML gives each state a place to exist.'],
      ['Review like a teammate', 'Ask whether another developer can find the main content, understand the naming, extend the form, and change the design without rewriting the document. Maintainability is part of quality.']
    ],
    questions: ['What is the primary action and where is it announced?', 'Which content states have you represented?', 'Can another developer understand the page structure from the markup alone?']
  },
  'html-playground': {
    thesis: 'The playground turns HTML from a reading subject into a feedback system. Use it to make one intentional change, observe the browser, and explain the result.',
    lenses: [
      ['Experiment design', 'Change one element or attribute at a time. Predict the result before running, then compare the rendered page with your prediction. This makes browser behavior memorable.'],
      ['Inspect the output', 'Look for structure, spacing, focus behavior, links, and fallback states—not only whether the page “looks nice.” A visual result can hide an inaccessible or fragile document.'],
      ['From demo to production', 'A playground is isolated and forgiving. Before shipping, add metadata, responsive behavior, validation, asset optimization, security considerations, and tests for the important user journeys.']
    ],
    questions: ['What did you predict before running the code?', 'Which behavior is provided by HTML without JavaScript?', 'What would you improve before calling this production-ready?']
  }
};

function renderExpertReading(section, courseSlug) {
  const guides = courseSlug === 'sql' ? expertReadingGuides : htmlExpertReadingGuides;
  if (courseSlug !== 'sql' && courseSlug !== 'html') return '';
  const guide = guides[section.id];
  if (!guide) return '';
  return `
    <div class="expert-reading">
      <div class="expert-reading-heading">
        <span class="section-label">Expert reading</span>
        <h3>Go beyond the syntax</h3>
        <p>${renderRichText(guide.thesis)}</p>
      </div>
      <div class="expert-lens-grid">
        ${guide.lenses.map(([title, body], index) => `
          <article class="expert-lens">
            <span class="expert-lens-number">${index + 1}</span>
            <h4>${escapeHtml(title)}</h4>
            <p>${renderRichText(body)}</p>
          </article>
        `).join('')}
      </div>
      <div class="expert-questions">
        <strong>Pause and think</strong>
        <ul>${guide.questions.map((question) => `<li>${renderRichText(question)}</li>`).join('')}</ul>
      </div>
    </div>
  `;
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
    ? section.paragraphs.map((text) => `<p class="lesson-body">${renderRichText(text)}</p>`).join('')
    : '';
  const cardsHtml = Array.isArray(section.cards)
    ? `<div class="lesson-grid">${section.cards.map((card) => `
        <div class="lesson-card">
          <h3>${renderRichText(card.title)}</h3>
          <p>${renderRichText(card.body)}</p>
        </div>
      `).join('')}</div>`
    : '';
  const listHtml = Array.isArray(section.list)
    ? `<ul class="bullet-list">${section.list.map((item) => `<li>${renderRichText(item)}</li>`).join('')}</ul>`
    : '';
  const calloutsHtml = Array.isArray(section.callouts)
    ? `<div class="lesson-callouts">${section.callouts.map((callout) => `
        <aside class="lesson-callout lesson-callout-${escapeHtml(callout.type || 'note')}">
          <span class="callout-label">${escapeHtml(callout.label || 'Key idea')}</span>
          <h3>${renderRichText(callout.title || '')}</h3>
          <p>${renderRichText(callout.body || '')}</p>
        </aside>
      `).join('')}</div>`
    : '';
  const takeawaysHtml = Array.isArray(section.takeaways)
    ? `<div class="takeaways-box">
        <h3>What to remember</h3>
        <ul>${section.takeaways.map((item) => `<li>${renderRichText(item)}</li>`).join('')}</ul>
      </div>`
    : '';
  const quoteHtml = section.pullQuote
    ? `<blockquote class="lesson-pullquote">${renderRichText(section.pullQuote)}</blockquote>`
    : '';
  const readingNoteHtml = section.readingNote
    ? `<div class="reading-note"><span>Reader's note</span><p>${renderRichText(section.readingNote)}</p></div>`
    : '';
  const codeLanguage = courseSlug === 'sql' || courseSlug === 'html' ? courseSlug : null;
  const codeBlocksHtml = Array.isArray(section.codeBlocks)
    ? section.codeBlocks.map((code) => `
        <pre class="code-block${codeLanguage ? ` syntax-sample syntax-sample-${codeLanguage}` : ''}">${
          codeLanguage ? highlightCode(code, codeLanguage) : escapeHtml(code)
        }</pre>
      `).join('')
    : '';
  const visualsHtml = Array.isArray(section.visuals)
    ? section.visuals.map(renderVisualMarkup).join('')
    : '';
  const challengeHtml = section.challenge
    ? `<div class="challenge-box">${renderRichText(section.challenge)}</div>`
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
      ${section.intro ? `<p class="course-intro">${renderRichText(section.intro)}</p>` : ''}
      ${paragraphHtml}
      ${quoteHtml}
      ${readingNoteHtml}
      ${cardsHtml}
      ${visualsHtml}
      ${renderExpertReading(section, courseSlug)}
      ${calloutsHtml}
      ${listHtml}
      ${takeawaysHtml}
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
          <div>
            <span class="editor-title-row"><span class="editor-live-dot"></span>${escapeHtml(editorConfig.label || 'Live HTML preview')} <em class="editor-language-badge">HTML</em></span>
            <small class="editor-subtitle">Write, run, inspect, and iterate</small>
          </div>
          <div class="editor-actions">
            <button type="button" data-expand-editor="${sectionId}" class="secondary-btn small-inline editor-expand-btn">Expand editor</button>
            <button type="button" data-run-html-editor="${sectionId}" class="primary-btn small-inline">Run code</button>
            ${editorConfig.practice ? `<button type="button" data-check-html-editor="${sectionId}" class="secondary-btn small-inline">Check solution</button>` : ''}
            <button type="button" data-reset-html-editor="${sectionId}" class="secondary-btn small-inline">Reset</button>
          </div>
        </div>
        <div class="editor-progress" data-editor-progress="${sectionId}" aria-hidden="true"><span></span></div>
        <div class="editor-statebar" data-editor-state="${sectionId}" role="status"><span class="editor-state-icon">●</span><span data-editor-state-message>Ready to run</span><span class="editor-shortcut">Tab inserts spaces · Ctrl/⌘ + Enter runs</span></div>
        <div class="code-editor code-editor-html">
          <pre id="htmlLines-${sectionId}" class="line-numbers" aria-hidden="true"></pre>
          <pre id="htmlHighlight-${sectionId}" class="syntax-layer" aria-hidden="true"></pre>
          <textarea id="htmlEditor-${sectionId}" class="code-input" aria-label="HTML editor" spellcheck="false">${escapeHtml(editorConfig.defaultHtml || '')}</textarea>
        </div>
        <div class="editor-footer"><span data-editor-metrics="${sectionId}">1 line · 0 chars</span><span>Browser preview sandbox</span></div>
        <iframe id="htmlPreview-${sectionId}" title="HTML preview"></iframe>
      </div>
    `;
  }

  return `
    <div class="sql-shell">
      <details class="schema-details schema-details-top" open>
        <summary><span class="schema-summary-title">Schema</span><span class="schema-summary-copy">Tables and sample data available to this query</span><span class="schema-summary-toggle">Hide</span></summary>
        <div class="schema-content">
          <p>Use these tables in your query. The runner starts with this schema and seed data for every lesson.</p>
          ${renderSchemaTables(editorConfig.schema)}
          ${Array.isArray(editorConfig.seedQueries) && editorConfig.seedQueries.length
            ? `<p class="schema-seed-count">${editorConfig.seedQueries.length} sample row statements loaded</p>`
            : ''}
        </div>
      </details>
      <div class="editor-header">
        <div>
          <span class="editor-title-row"><span class="editor-live-dot"></span>${escapeHtml(editorConfig.label || 'SQL practice lab')} <em class="editor-language-badge">SQL</em></span>
          <small class="editor-subtitle">SQL playground · schema loaded in your browser</small>
        </div>
        <div class="editor-actions">
          <button type="button" data-expand-editor="${sectionId}" class="secondary-btn small-inline editor-expand-btn">Expand editor</button>
          <button type="button" data-format-sql-editor="${sectionId}" class="secondary-btn small-inline">Format SQL</button>
          <button type="button" data-run-sql-editor="${sectionId}" class="primary-btn small-inline">Run query</button>
          ${editorConfig.solutionQuery ? `<button type="button" data-check-sql-editor="${sectionId}" class="secondary-btn small-inline">Check solution</button>` : ''}
          <button type="button" data-reset-sql-editor="${sectionId}" class="secondary-btn small-inline">Reset</button>
        </div>
      </div>
      <div class="editor-progress" data-editor-progress="${sectionId}" aria-hidden="true"><span></span></div>
      <div class="editor-statebar" data-editor-state="${sectionId}" role="status"><span class="editor-state-icon">●</span><span data-editor-state-message>Ready to run</span><span class="editor-shortcut">Tab inserts spaces · Ctrl/⌘ + Enter runs</span></div>
      <div class="code-editor code-editor-sql">
        <pre id="sqlLines-${sectionId}" class="line-numbers" aria-hidden="true"></pre>
        <pre id="sqlHighlight-${sectionId}" class="syntax-layer" aria-hidden="true"></pre>
        <textarea id="sqlEditor-${sectionId}" class="code-input" aria-label="SQL editor" spellcheck="false">${escapeHtml(editorConfig.defaultQuery || '')}</textarea>
      </div>
      <div class="editor-footer"><span data-editor-metrics="${sectionId}">1 line · 0 chars</span><span>SQLite · runs in your browser</span></div>
      <div id="sqlOutput-${sectionId}" class="sql-output" aria-live="polite"></div>
    </div>
  `;
}

function setEditorState(sectionId, state, message) {
  const statebar = document.querySelector(`[data-editor-state="${sectionId}"]`);
  const progress = document.querySelector(`[data-editor-progress="${sectionId}"]`);
  if (!statebar) return;
  statebar.dataset.state = state;
  const messageTarget = statebar.querySelector('[data-editor-state-message]');
  if (messageTarget) messageTarget.textContent = message;
  if (progress) progress.classList.toggle('is-loading', state === 'loading');
  const icon = statebar.querySelector('.editor-state-icon');
  if (icon) icon.textContent = state === 'error' ? '!' : state === 'loading' ? '◌' : state === 'success' ? '✓' : '●';
}

function setEditorBusy(sectionId, busy) {
  const shell = document.querySelector(`[data-editor-state="${sectionId}"]`)?.closest('.editor-panel, .sql-shell');
  if (!shell) return;
  shell.classList.toggle('is-busy', busy);
  shell.querySelectorAll('.editor-actions button').forEach((button) => {
    button.disabled = busy && !button.matches(`[data-expand-editor="${sectionId}"]`);
  });
}

function splitSchemaParts(value) {
  const parts = [];
  let current = '';
  let depth = 0;
  for (const character of String(value || '')) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function renderSchemaTables(schema) {
  const tableMatches = [...String(schema || '').matchAll(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)\s*;?/gi)];
  if (!tableMatches.length) {
    return '<p class="schema-empty">No table schema provided for this playground.</p>';
  }

  const tables = tableMatches.map((match) => {
    const tableName = match[1];
    const definitions = splitSchemaParts(match[2]);
    const columns = definitions
      .filter((definition) => !/^(PRIMARY|FOREIGN|UNIQUE|CHECK|CONSTRAINT)\b/i.test(definition))
      .map((definition) => {
        const columnMatch = definition.match(/^(\w+)\s+([A-Z]+(?:\s*\([^)]*\))?)(.*)$/i);
        if (!columnMatch) return null;
        const [, name, type, constraints] = columnMatch;
        const flags = [];
        if (/PRIMARY\s+KEY/i.test(constraints)) flags.push('PK');
        if (/NOT\s+NULL/i.test(constraints)) flags.push('Required');
        if (/UNIQUE/i.test(constraints)) flags.push('Unique');
        if (/REFERENCES/i.test(constraints)) flags.push('FK');
        return { name, type, flags };
      })
      .filter(Boolean);

    return `
      <div class="schema-table-card">
        <h3>${escapeHtml(tableName)}</h3>
        <div class="schema-table-wrap">
          <table class="schema-table">
            <thead><tr><th>Column</th><th>Type</th><th>Rules</th></tr></thead>
            <tbody>
              ${columns.map((column) => `
                <tr>
                  <td><code>${escapeHtml(column.name)}</code></td>
                  <td>${escapeHtml(column.type)}</td>
                  <td>${column.flags.length ? column.flags.map((flag) => `<span class="schema-flag">${escapeHtml(flag)}</span>`).join(' ') : '<span class="schema-muted">—</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="schema-tables">${tables}</div>`;
}

function highlightCode(code, language) {
  const source = String(code || '');
  const tokenPattern = language === 'sql'
    ? /(--[^\n]*|'(?:''|[^'])*'|"(?:[^"]|"")*"|\b\d+(?:\.\d+)?\b|\b(?:SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|FULL|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|AS|AND|OR|NOT|NULL|IS|DISTINCT|CASE|WHEN|THEN|ELSE|END|WITH|UNION|ALL|COUNT|SUM|AVG|MIN|MAX|OVER|PARTITION|PRIMARY|KEY|REFERENCES|CHECK|DEFAULT|ASC|DESC)\b)/gi
    : /(<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-z][^>]*>|&[a-z0-9#]+;|"[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b)/gi;

  let cursor = 0;
  let output = '';
  let match;
  while ((match = tokenPattern.exec(source))) {
    output += escapeHtml(source.slice(cursor, match.index));
    const token = match[0];
    let tokenClass = 'syntax-value';
    if (language === 'sql' && /^--/.test(token)) tokenClass = 'syntax-comment';
    else if (language === 'html' && /^<!--/.test(token)) tokenClass = 'syntax-comment';
    else if (language === 'html' && /^<!DOCTYPE/i.test(token)) tokenClass = 'syntax-keyword';
    else if (language === 'html' && /^<\/?[a-z]/i.test(token)) tokenClass = 'syntax-tag';
    else if (language === 'sql' && /^(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|FULL|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|AS|AND|OR|NOT|NULL|IS|DISTINCT|CASE|WHEN|THEN|ELSE|END|WITH|UNION|ALL|COUNT|SUM|AVG|MIN|MAX|OVER|PARTITION|PRIMARY|KEY|REFERENCES|CHECK|DEFAULT|ASC|DESC)$/i.test(token)) tokenClass = 'syntax-keyword';
    else if ((language === 'sql' && /^['"]/.test(token)) || (language === 'html' && /^["']/.test(token))) tokenClass = 'syntax-string';
    else if (/^\d/.test(token)) tokenClass = 'syntax-number';
    if (language === 'html' && tokenClass === 'syntax-tag') {
      const escapedTag = escapeHtml(token).replace(
        /(&quot;.*?&quot;|&#039;.*?&#039;)/g,
        '<span class="syntax-string">$1</span>',
      );
      output += `<span class="${tokenClass}">${escapedTag}</span>`;
    } else {
      output += `<span class="${tokenClass}">${escapeHtml(token)}</span>`;
    }
    cursor = match.index + token.length;
  }
  return output + escapeHtml(source.slice(cursor)) + (source.endsWith('\n') ? ' ' : '');
}

function syncCodeHighlight(editor, highlight, language) {
  if (!editor || !highlight) return;
  highlight.innerHTML = highlightCode(editor.value, language);
  highlight.scrollTop = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
}

function setupCodeHighlight(editor, highlight, language) {
  if (!editor || !highlight) return;
  const editorShell = editor.closest('.code-editor');
  const lines = editorShell?.querySelector('.line-numbers');
  const syncLineNumbers = () => {
    if (!lines) return;
    const count = editor.value.split('\n').length;
    lines.textContent = Array.from({ length: count }, (_, index) => String(index + 1)).join('\n');
    lines.scrollTop = editor.scrollTop;
  };
  const syncMetrics = () => {
    const metrics = editor.closest('.editor-panel, .sql-shell')?.querySelector(`[data-editor-metrics="${editor.id.replace(/^(sql|html)Editor-/, '')}"]`);
    if (!metrics) return;
    const lineCount = editor.value.split('\n').length;
    metrics.textContent = `${lineCount} line${lineCount === 1 ? '' : 's'} · ${editor.value.length} chars`;
  };
  const sync = () => syncCodeHighlight(editor, highlight, language);
  editor.addEventListener('input', sync);
  editor.addEventListener('input', syncLineNumbers);
  editor.addEventListener('input', syncMetrics);
  editor.addEventListener('scroll', sync);
  editor.addEventListener('scroll', syncLineNumbers);
  editor.addEventListener('click', sync);
  editor.addEventListener('keyup', sync);
  editor.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const start = editor.selectionStart;
    editor.setRangeText('  ', start, editor.selectionEnd, 'end');
    sync();
    syncLineNumbers();
    syncMetrics();
  });
  sync();
  syncLineNumbers();
  syncMetrics();
  editor.addEventListener('keydown', (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return;
    event.preventDefault();
    const runButton = editor.closest('.editor-panel, .sql-shell')?.querySelector('[data-run-sql-editor], [data-run-html-editor]');
    runButton?.click();
  });
}

function setupEditorEnhancements() {
  document.querySelectorAll('[data-expand-editor]').forEach((button) => {
    button.addEventListener('click', () => {
      const shell = button.closest('.editor-panel, .sql-shell');
      if (!shell) return;
      const expanded = shell.classList.toggle('editor-expanded');
      button.textContent = expanded ? 'Collapse editor' : 'Expand editor';
      document.body.classList.toggle('editor-modal-open', expanded);
    });
  });
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
  const highlight = document.getElementById(`sqlHighlight-${sectionId}`);
  const output = document.getElementById(`sqlOutput-${sectionId}`);
  const runButton = document.querySelector(`[data-run-sql-editor="${sectionId}"]`);
  const formatButton = document.querySelector(`[data-format-sql-editor="${sectionId}"]`);
  const resetButton = document.querySelector(`[data-reset-sql-editor="${sectionId}"]`);
  const checkButton = document.querySelector(`[data-check-sql-editor="${sectionId}"]`);
  const statusTarget = editorConfig.statusTarget ? document.getElementById(editorConfig.statusTarget) : null;

  if (!editor || !output) return;

  setEditorState(sectionId, 'loading', 'Loading SQL engine…');
  setEditorBusy(sectionId, true);
  const SQL = await ensureSqlLibrary();
  if (!SQL) {
    output.innerHTML = '<div class="sql-result sql-result-error"><strong>Runner unavailable</strong><span>The SQL engine could not be loaded. Check your connection and reload the lesson.</span></div>';
    setEditorState(sectionId, 'error', 'SQL engine unavailable');
    setEditorBusy(sectionId, false);
    return;
  }

  let db;
  const createDatabase = () => {
    const nextDatabase = new SQL.Database();
    if (editorConfig.schema) {
      nextDatabase.run(editorConfig.schema);
    }
    if (Array.isArray(editorConfig.seedQueries)) {
      editorConfig.seedQueries.forEach((statement) => {
        if (statement) nextDatabase.run(statement);
      });
    }
    return nextDatabase;
  };

  try {
    db = createDatabase();
  } catch (error) {
    output.innerHTML = `<div class="sql-result sql-result-error"><strong>Lesson setup error</strong><span>${escapeHtml(error.message)}</span></div>`;
    setEditorState(sectionId, 'error', 'Could not prepare database');
    setEditorBusy(sectionId, false);
    return;
  }

  const defaultSql = editorConfig.defaultQuery || '';

  const formatSql = (sql) => {
    const protectedStrings = [];
    const source = String(sql || '').replace(/'(?:''|[^'])*'|"(?:["]|[^"])*"/g, (value) => {
      protectedStrings.push(value);
      return `__HE_SQL_STRING_${protectedStrings.length - 1}__`;
    });
    let formatted = source
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',\n  ')
      .replace(/\s+(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|UNION ALL|UNION)\s+/gi, '\n$1 ')
      .replace(/\s+(LEFT OUTER JOIN|RIGHT OUTER JOIN|FULL OUTER JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|JOIN)\s+/gi, '\n$1 ')
      .replace(/\s+(ON|AND|OR)\s+/gi, '\n  $1 ')
      .replace(/\s+(VALUES)\s*/gi, '\n$1 ')
      .replace(/\s*;\s*$/g, ';')
      .trim();

    const lines = formatted.split('\n');
    let depth = 0;
    formatted = lines.map((line) => {
      const trimmed = line.trim();
      if (/^(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|UNION|UNION ALL|LEFT|RIGHT|FULL|INNER|JOIN|VALUES)\b/i.test(trimmed)) {
        depth = 0;
      }
      const outputLine = `${'  '.repeat(Math.max(depth, 0))}${trimmed}`;
      if (/^(SELECT|WITH)\b/i.test(trimmed)) depth = 1;
      return outputLine;
    }).join('\n');

    return formatted.replace(/__HE_SQL_STRING_(\d+)__/g, (_, index) => protectedStrings[Number(index)]);
  };

  const renderResultTable = (result) => {
    if (!result) {
      output.innerHTML = '<div class="sql-result sql-result-success"><strong>Statement executed successfully</strong><span>The database accepted the statement and returned no result set.</span></div>';
      return;
    }

    if (!result.values || !result.values.length) {
      output.innerHTML = '<div class="sql-result sql-result-empty"><strong>Query ran successfully</strong><span>No rows matched this query.</span></div>';
      return;
    }

    const headerHtml = result.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    const rowsHtml = result.values.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? 'NULL')}</td>`).join('')}</tr>`).join('');
    output.innerHTML = `<div class="sql-result sql-result-success"><strong>Query ran successfully</strong><span>${result.values.length} row${result.values.length === 1 ? '' : 's'} returned</span></div><div class="sql-table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  };

  const executeQuery = () => {
    setEditorState(sectionId, 'loading', 'Running query…');
    setEditorBusy(sectionId, true);
    try {
      const query = editor.value.trim() || defaultSql;
      const resultSet = db.exec(query);
      renderResultTable(resultSet[0]);
      setEditorState(sectionId, 'success', 'Query completed');
      return resultSet[0] || null;
    } catch (error) {
      output.innerHTML = `<div class="sql-result sql-result-error"><strong>SQL error</strong><span>${escapeHtml(error.message)}</span><small>Check the table name, column name, spelling, and SQL syntax, then run the query again.</small></div>`;
      setEditorState(sectionId, 'error', 'Query needs attention');
      return null;
    } finally {
      setEditorBusy(sectionId, false);
    }
  };

  const normalizeResult = (result) => JSON.stringify({
    columns: result?.columns || [],
    values: result?.values || [],
  });
  const setStatus = (passed, message) => {
    if (!statusTarget) return;
    statusTarget.className = `practice-verdict ${passed ? 'verdict-pass' : 'verdict-fail'}`;
    statusTarget.innerHTML = `<strong>${passed ? 'PASS' : 'FAIL'}</strong><span>${escapeHtml(message)}</span>`;
    if (passed && editorConfig.onPass) editorConfig.onPass();
  };

  editor.value = formatSql(defaultSql);
  setupCodeHighlight(editor, highlight, 'sql');
  formatButton?.addEventListener('click', () => {
    editor.value = formatSql(editor.value);
    syncCodeHighlight(editor, highlight, 'sql');
    editor.focus();
  });
  runButton?.addEventListener('click', executeQuery);
  checkButton?.addEventListener('click', () => {
    setEditorState(sectionId, 'loading', 'Checking solution…');
    setEditorBusy(sectionId, true);
    try {
      const actual = db.exec(editor.value.trim() || defaultSql)[0] || null;
      const expected = editorConfig.solutionQuery ? (db.exec(editorConfig.solutionQuery)[0] || null) : null;
      if (!editorConfig.solutionQuery) {
        output.innerHTML = '<div class="sql-result sql-result-empty"><strong>No solution checker configured</strong><span>Run the query and compare the result with the problem requirements.</span></div>';
        setStatus(false, 'No checker configured');
        setEditorState(sectionId, 'error', 'No checker configured');
        return;
      }
      if (normalizeResult(actual) === normalizeResult(expected)) {
        output.innerHTML = '<div class="sql-result sql-result-success"><strong>Solution accepted</strong><span>Your result matches the expected output for this challenge.</span></div>';
        setStatus(true, 'Result matches the expected output');
        setEditorState(sectionId, 'success', 'Solution accepted');
      } else {
        output.innerHTML = '<div class="sql-result sql-result-error"><strong>Keep iterating</strong><span>The query ran, but its columns or rows do not match the expected result yet.</span><small>Check the requested grain, filters, ordering, and NULL behavior.</small></div>';
        setStatus(false, 'Result does not match yet');
        setEditorState(sectionId, 'error', 'Keep iterating');
      }
    } catch (error) {
      output.innerHTML = `<div class="sql-result sql-result-error"><strong>SQL error</strong><span>${escapeHtml(error.message)}</span><small>Fix the query before checking your solution.</small></div>`;
      setStatus(false, 'Query has an error');
      setEditorState(sectionId, 'error', 'Query has an error');
    } finally {
      setEditorBusy(sectionId, false);
    }
  });
  resetButton?.addEventListener('click', () => {
    try {
      db = createDatabase();
    } catch (error) {
      output.innerHTML = `<div class="sql-result sql-result-error"><strong>Reset error</strong><span>${escapeHtml(error.message)}</span></div>`;
      return;
    }
    editor.value = formatSql(defaultSql);
    syncCodeHighlight(editor, highlight, 'sql');
    setEditorState(sectionId, 'loading', 'Resetting workspace…');
    executeQuery();
  });
  setEditorBusy(sectionId, false);
  setEditorState(sectionId, 'ready', 'Ready to run');
  executeQuery();
}

async function renderStandaloneSqlPlayground() {
  const target = document.getElementById('standalone-sql-playground');
  if (!target) return;
  const config = {
    type: 'sql',
    label: 'Open SQL workspace',
    defaultQuery: 'SELECT department, COUNT(*) AS employee_count, ROUND(AVG(salary), 2) AS average_salary FROM employees GROUP BY department ORDER BY average_salary DESC;',
    schema: 'CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary INTEGER, city TEXT); CREATE TABLE projects (project_id INTEGER PRIMARY KEY, project_name TEXT NOT NULL, department TEXT NOT NULL);',
    seedQueries: [
      "INSERT INTO employees VALUES (1, 'Aarav', 'Engineering', 90000, 'Pune');",
      "INSERT INTO employees VALUES (2, 'Nisha', 'Marketing', 72000, 'Delhi');",
      "INSERT INTO employees VALUES (3, 'Kabir', 'Engineering', 85000, 'Bengaluru');",
      "INSERT INTO employees VALUES (4, 'Meera', 'Design', 76000, 'Mumbai');",
      "INSERT INTO employees VALUES (5, 'Rohan', 'Engineering', 82000, 'Pune');",
      "INSERT INTO projects VALUES (101, 'Platform migration', 'Engineering');",
      "INSERT INTO projects VALUES (102, 'Campaign refresh', 'Marketing');",
      "INSERT INTO projects VALUES (103, 'Design system', 'Design');"
    ]
  };
  target.innerHTML = renderEditorMarkup('standalone', config);
  setupEditorEnhancements();
  await attachSqlEditor('standalone', config);
}

async function renderPracticePage() {
  const target = document.getElementById('practice-content');
  if (!target) return;
  try {
    const response = await fetch('practice-data.json');
    const data = await response.json();
    const sqlProblems = Array.isArray(data.sql) ? data.sql : [];
    const htmlProblems = Array.isArray(data.html) ? data.html : [];
    target.innerHTML = `
      <div class="practice-toolbar">
        <button class="practice-filter active" data-practice-filter="sql">SQL journey <span>${sqlProblems.length}</span></button>
        <button class="practice-filter" data-practice-filter="html">HTML journey <span>${htmlProblems.length}</span></button>
      </div>
      <div class="practice-progress-card">
        <div><span class="section-label">Your progress</span><strong id="practice-progress-label">0 of ${sqlProblems.length} SQL problems solved</strong></div>
        <div class="practice-progress-track"><span id="practice-progress-bar"></span></div>
        <small>Pass a challenge to mark it complete. Progress is saved in this browser.</small>
      </div>
      <div class="practice-layout">
        <aside class="practice-list">
          <div class="practice-list-heading"><span id="practice-journey-label">SQL journey</span><strong id="practice-journey-count">${sqlProblems.length} problems</strong></div>
          <div id="practice-problem-list"></div>
        </aside>
        <section id="practice-workspace" class="practice-workspace"></section>
      </div>
    `;
    const problems = [...sqlProblems.map((problem) => ({ ...problem, language: 'sql' })), ...htmlProblems.map((problem) => ({ ...problem, language: 'html' }))];
    const list = target.querySelector('#practice-problem-list');
    const workspace = target.querySelector('#practice-workspace');
    const progressKey = 'he-practice-solved';
    const solved = new Set(JSON.parse(localStorage.getItem(progressKey) || '[]'));
    let activeFilter = 'sql';
    let activeDifficulty = 'all';
    const updateProgress = () => {
      const journeyProblems = problems.filter((problem) => problem.language === activeFilter);
      const complete = journeyProblems.filter((problem) => solved.has(problem.id)).length;
      target.querySelector('#practice-progress-label').textContent = `${complete} of ${journeyProblems.length} ${activeFilter.toUpperCase()} problems solved`;
      target.querySelector('#practice-progress-bar').style.width = `${journeyProblems.length ? (complete / journeyProblems.length) * 100 : 0}%`;
    };
    const renderList = (filter = 'sql') => {
      activeFilter = filter;
      const journeyProblems = problems.filter((problem) => problem.language === filter);
      list.innerHTML = problems
        .filter((problem) => problem.language === filter && (activeDifficulty === 'all' || problem.difficulty.toLowerCase() === activeDifficulty))
        .map((problem) => `<button class="practice-problem ${solved.has(problem.id) ? 'is-solved' : ''}" data-practice-id="${escapeHtml(problem.id)}"><span class="practice-problem-number">${journeyProblems.indexOf(problem) + 1}</span><span class="practice-problem-copy"><span class="practice-type">${escapeHtml(problem.language.toUpperCase())}</span><strong>${escapeHtml(problem.title)}</strong><small class="difficulty-${escapeHtml(problem.difficulty.toLowerCase())}">${solved.has(problem.id) ? 'Solved · ' : ''}${escapeHtml(problem.difficulty)}</small></span><span class="practice-solved-mark">${solved.has(problem.id) ? '✓' : ''}</span></button>`)
        .join('');
      target.querySelector('#practice-journey-label').textContent = `${filter.toUpperCase()} journey`;
      target.querySelector('#practice-journey-count').textContent = `${journeyProblems.length} problems`;
      updateProgress();
    };
    const difficultyBar = document.createElement('div');
    difficultyBar.className = 'practice-difficulty-bar';
    difficultyBar.innerHTML = '<span>Difficulty</span><button class="practice-difficulty active" data-difficulty="all">All</button><button class="practice-difficulty" data-difficulty="easy">Easy</button><button class="practice-difficulty" data-difficulty="medium">Medium</button><button class="practice-difficulty" data-difficulty="hard">Hard</button>';
    target.querySelector('.practice-toolbar').after(difficultyBar);
    difficultyBar.querySelectorAll('[data-difficulty]').forEach((button) => {
      button.addEventListener('click', () => {
        difficultyBar.querySelectorAll('[data-difficulty]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        activeDifficulty = button.dataset.difficulty;
        renderList(activeFilter);
      });
    });
    const openProblem = async (problem) => {
      workspace.innerHTML = `
        <div class="practice-problem-header">
          <div><span class="section-label">${escapeHtml(problem.language.toUpperCase())} challenge · Problem ${problems.filter((item) => item.language === problem.language).findIndex((item) => item.id === problem.id) + 1}</span><h2>${escapeHtml(problem.title)}</h2></div>
          <div class="practice-header-meta"><span class="difficulty-pill difficulty-${escapeHtml(problem.difficulty.toLowerCase())}">${escapeHtml(problem.difficulty)}</span><div id="practice-status-${escapeHtml(problem.id)}" class="practice-verdict verdict-idle"><strong>READY</strong><span>Run Check solution when you are ready</span></div></div>
        </div>
        <p class="practice-prompt">${renderRichText(problem.prompt)}</p>
        ${problem.hints?.length ? `<details class="practice-hints"><summary>Read hints</summary><ul>${problem.hints.map((hint) => `<li>${renderRichText(hint)}</li>`).join('')}</ul></details>` : ''}
        <div class="practice-step-nav"><button type="button" class="secondary-btn small-btn" data-practice-prev>← Previous</button><span>Work through the journey in order</span><button type="button" class="primary-btn small-btn" data-practice-next>Next →</button></div>
        <div id="practice-editor-mount"></div>
      `;
      const journeyProblems = problems.filter((item) => item.language === problem.language);
      const currentIndex = journeyProblems.findIndex((item) => item.id === problem.id);
      workspace.querySelector('[data-practice-prev]').disabled = currentIndex <= 0;
      workspace.querySelector('[data-practice-next]').disabled = currentIndex >= journeyProblems.length - 1;
      workspace.querySelector('[data-practice-prev]').addEventListener('click', () => openProblem(journeyProblems[currentIndex - 1]));
      workspace.querySelector('[data-practice-next]').addEventListener('click', () => openProblem(journeyProblems[currentIndex + 1]));
      const mount = workspace.querySelector('#practice-editor-mount');
      if (problem.language === 'sql') {
        const editorConfig = { ...problem.editor, type: 'sql', label: 'Challenge SQL editor', statusTarget: `practice-status-${problem.id}`, onPass: () => { solved.add(problem.id); localStorage.setItem(progressKey, JSON.stringify([...solved])); renderList(activeFilter); } };
        mount.innerHTML = renderEditorMarkup(`practice-${problem.id}`, editorConfig);
        await attachSqlEditor(`practice-${problem.id}`, editorConfig);
      } else {
        const editorConfig = { type: 'html', label: 'Challenge HTML editor', defaultHtml: problem.starter, practice: true, validation: problem.validation, statusTarget: `practice-status-${problem.id}`, onPass: () => { solved.add(problem.id); localStorage.setItem(progressKey, JSON.stringify([...solved])); renderList(activeFilter); } };
        mount.innerHTML = renderEditorMarkup(`practice-${problem.id}`, editorConfig);
        mount.insertAdjacentHTML('beforeend', `<div id="htmlCheckOutput-practice-${problem.id}" class="practice-check-output verdict-idle"><strong>READY</strong><span>Run your page, then check the acceptance criteria.</span></div>`);
        attachHtmlEditor(`practice-${problem.id}`, editorConfig);
        mount.insertAdjacentHTML('beforeend', `<div class="practice-requirements"><strong>Acceptance checklist</strong><ul>${problem.requirements.map((item) => `<li>${renderRichText(item)}</li>`).join('')}</ul></div>`);
      }
      setupEditorEnhancements();
      list.querySelectorAll('.practice-problem').forEach((item) => item.classList.toggle('active', item.dataset.practiceId === problem.id));
    };
    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-practice-id]');
      const problem = problems.find((item) => item.id === button?.dataset.practiceId);
      if (problem) openProblem(problem);
    });
    target.querySelectorAll('[data-practice-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        target.querySelectorAll('[data-practice-filter]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const nextFilter = button.dataset.practiceFilter;
        renderList(nextFilter);
        const firstProblem = problems.find((problem) => problem.language === nextFilter);
        if (firstProblem) openProblem(firstProblem);
      });
    });
    renderList('sql');
    await openProblem(sqlProblems.length ? { ...sqlProblems[0], language: 'sql' } : { ...htmlProblems[0], language: 'html' });
  } catch (error) {
    target.innerHTML = '<div class="course-section"><h2>Practice library unavailable</h2><p class="course-intro">Unable to load the challenge set right now.</p></div>';
  }
}

function attachHtmlEditor(sectionId, editorConfig) {
  const editor = document.getElementById(`htmlEditor-${sectionId}`);
  const highlight = document.getElementById(`htmlHighlight-${sectionId}`);
  const preview = document.getElementById(`htmlPreview-${sectionId}`);
  const runButton = document.querySelector(`[data-run-html-editor="${sectionId}"]`);
  const resetButton = document.querySelector(`[data-reset-html-editor="${sectionId}"]`);
  const checkButton = document.querySelector(`[data-check-html-editor="${sectionId}"]`);
  const statusTarget = editorConfig.statusTarget ? document.getElementById(editorConfig.statusTarget) : null;

  if (!editor || !preview) return;

  const defaultHtml = editorConfig.defaultHtml || '';
  const renderPreview = () => {
    setEditorState(sectionId, 'loading', 'Rendering preview…');
    setEditorBusy(sectionId, true);
    preview.srcdoc = editor.value.trim() || defaultHtml;
  };

  editor.value = defaultHtml;
  setupCodeHighlight(editor, highlight, 'html');
  renderPreview();
  preview.addEventListener('load', () => {
    setEditorBusy(sectionId, false);
    setEditorState(sectionId, 'success', 'Preview updated');
  });
  runButton?.addEventListener('click', renderPreview);
  resetButton?.addEventListener('click', () => {
    editor.value = defaultHtml;
    syncCodeHighlight(editor, highlight, 'html');
    renderPreview();
  });
  checkButton?.addEventListener('click', () => {
    setEditorState(sectionId, 'loading', 'Checking acceptance criteria…');
    setEditorBusy(sectionId, true);
    const frameDocument = preview.contentDocument;
    const checks = editorConfig.validation || [];
    const failures = checks.filter((check) => {
      if (check.type === 'selector') return !frameDocument.querySelector(check.selector);
      if (check.type === 'count') return frameDocument.querySelectorAll(check.selector).length < Number(check.minimum || 1);
      if (check.type === 'attribute') return !frameDocument.querySelector(`${check.selector}[${check.attribute}]`);
      return true;
    });
    const passed = checks.length > 0 && failures.length === 0;
    const message = passed ? 'All acceptance checks passed' : (failures[0]?.message || 'Some acceptance checks are still failing');
    if (statusTarget) {
      statusTarget.className = `practice-verdict ${passed ? 'verdict-pass' : 'verdict-fail'}`;
      statusTarget.innerHTML = `<strong>${passed ? 'PASS' : 'FAIL'}</strong><span>${escapeHtml(message)}</span>`;
    }
    if (passed && editorConfig.onPass) editorConfig.onPass();
    const output = document.getElementById(`htmlCheckOutput-${sectionId}`);
    if (output) {
      output.className = `practice-check-output ${passed ? 'verdict-pass' : 'verdict-fail'}`;
      output.innerHTML = `<strong>${passed ? 'PASS' : 'FAIL'}</strong><span>${escapeHtml(message)}</span>`;
    }
    setEditorBusy(sectionId, false);
    setEditorState(sectionId, passed ? 'success' : 'error', passed ? 'All checks passed' : 'Some checks need attention');
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
    const activeDescription = course.description || 'Practical, free technical lessons from Heavy Engineers.';
    document.title = selectedSectionKey
      ? `${course.sections.find((section) => getSectionKey(section) === selectedSectionKey)?.title || course.title} | ${course.title} | Heavy Engineers`
      : `${course.title} | Heavy Engineers`;

    const descriptionMeta = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement('meta'));
    descriptionMeta.setAttribute('name', 'description');
    descriptionMeta.setAttribute('content', activeDescription);

    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.head.appendChild(document.createElement('link'));
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', `${window.location.origin}${window.location.pathname}${window.location.search}`);

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
    setupEditorEnhancements();

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
  await renderStandaloneSqlPlayground();
  await renderPracticePage();
})();
