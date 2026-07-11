(() => {
  const qdata = window.MOWA_QUESTIONNAIRE;
  const config = window.MOWA_SURVEY_CONFIG || {};
  const introScreens = qdata.introScreens || [];
  const pages = qdata.pages || [];
  const introCount = introScreens.length;
  const totalScreens = introCount + pages.length;
  const draftKey = 'mowa-direction-survey-v4-draft';
  const oldDraftKeys = ['mowa_direction_survey_draft_v3', 'mowa_direction_survey_draft_v2'];
  const submissionsKey = 'mowa-direction-survey-v4-submissions';

  const host = document.getElementById('screenHost');
  const footerActions = document.getElementById('footerActions');
  const pageCount = document.getElementById('pageCount');
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const sectionProgress = document.getElementById('sectionProgress');
  const sectionTabs = document.getElementById('sectionTabs');
  const saveStatus = document.getElementById('saveStatus');
  const dialog = document.getElementById('messageDialog');
  const dialogContent = document.getElementById('dialogContent');

  let currentIndex = 0;
  let moving = false;
  let draft = loadDraft();

  function loadDraft() {
    try {
      const direct = localStorage.getItem(draftKey);
      if (direct) return JSON.parse(direct) || {};
      for (const key of oldDraftKeys) {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw) || {};
      }
    } catch (_) {}
    return {};
  }

  function saveDraft(manual = false) {
    collectVisibleData();
    localStorage.setItem(draftKey, JSON.stringify(draft));
    saveStatus.textContent = manual
      ? `Saved ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      : 'Answers save in this browser';
    updateProgress();
  }

  function allQuestions() {
    return pages.flatMap(page => [
      ...(page.items || []).map(item => ({ ...item, type: 'scale' })),
      ...(page.fields || []).filter(field => field.type !== 'note')
    ]);
  }

  function answered(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  }

  function updateProgress() {
    const questions = allQuestions();
    const done = questions.filter(question => answered(draft[question.id])).length;
    const pct = questions.length ? Math.round((done / questions.length) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    if (currentIndex >= introCount) {
      progressText.textContent = `${pct}% answered`;
    }
  }

  function currentSurveyPageIndex() {
    return currentIndex - introCount;
  }

  function buildScreen(index) {
    return index < introCount
      ? buildIntroScreen(introScreens[index], index)
      : buildSurveyScreen(pages[index - introCount], index - introCount);
  }

  function buildIntroScreen(screen, introIndex) {
    const article = document.createElement('article');
    article.className = `screen intro-screen ${introIndex === 0 ? 'welcome-screen' : 'how-screen'}`;
    article.dataset.screen = screen.id;

    if (introIndex === 0) {
      article.innerHTML = `
        <div class="welcome-grid">
          <div class="welcome-copy">
            <p class="kicker">${escapeHtml(screen.kicker)}</p>
            <h1>${escapeHtml(screen.title)}</h1>
            ${screen.body.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
            <div class="source-links">
              ${screen.links.map(link => `<a href="${escapeAttribute(link.href)}" target="_blank" rel="noopener">${escapeHtml(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}
            </div>
          </div>
          <figure class="hero-image">
            <img src="${escapeAttribute(screen.image)}" alt="${escapeAttribute(screen.imageAlt)}" />
            <figcaption>Experience, new voices, and every form of outdoor storytelling.</figcaption>
          </figure>
        </div>`;
    } else {
      article.innerHTML = `
        <div class="how-layout">
          <div class="how-heading">
            <p class="kicker">${escapeHtml(screen.kicker)}</p>
            <h1>${escapeHtml(screen.title)}</h1>
            <p class="how-summary">This is a direction-finding questionnaire, not a vote on a predetermined proposal.</p>
          </div>
          <div class="how-points">
            ${screen.bullets.map((bullet, i) => `
              <div class="how-point"><span>${String(i + 1).padStart(2, '0')}</span><p>${escapeHtml(bullet)}</p></div>`).join('')}
          </div>
          <p class="how-footer">${escapeHtml(screen.footer)}</p>
        </div>`;
    }
    return article;
  }

  function buildSurveyScreen(page, pageIndex) {
    const article = document.createElement('article');
    article.className = 'screen survey-screen';
    article.dataset.page = page.id;
    article.innerHTML = `
      <header class="page-heading">
        <div>
          <p class="kicker">${escapeHtml(sectionName(page.section))} <span>• ${escapeHtml(page.part || '')}</span></p>
          <h1>${escapeHtml(page.title)}</h1>
        </div>
        <p>${escapeHtml(page.intro || '')}</p>
      </header>
      <div class="survey-content"></div>`;

    const content = article.querySelector('.survey-content');
    if (page.note) {
      const note = document.createElement('p');
      note.className = 'page-note';
      note.textContent = page.note;
      content.appendChild(note);
    }
    if (page.matrixScale && page.items?.length) {
      content.appendChild(renderMatrix(page.matrixScale, page.items));
    }
    if (page.fields?.length) {
      content.appendChild(renderFields(page.fields, page));
    }

    bindAutosave(article);
    return article;
  }

  function renderMatrix(scaleName, items) {
    const labels = qdata.scales[scaleName] || qdata.scales.importance;
    const wrap = document.createElement('div');
    wrap.className = 'matrix-wrap';
    const key = document.createElement('div');
    key.className = 'scale-key';
    key.innerHTML = labels.map((label, index) => `<span><strong>${index + 1}</strong>${escapeHtml(label)}</span>`).join('');
    wrap.appendChild(key);

    const matrix = document.createElement('div');
    matrix.className = 'rating-matrix';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'rating-row';
      const statement = document.createElement('p');
      statement.textContent = item.label;
      const choices = document.createElement('div');
      choices.className = 'rating-choices';
      for (let value = 1; value <= 5; value++) {
        const choice = document.createElement('label');
        choice.className = 'score-choice';
        choice.title = `${value} — ${labels[value - 1]}`;
        choice.innerHTML = `
          <input type="radio" name="${escapeAttribute(item.id)}" value="${value}" ${Number(draft[item.id]) === value ? 'checked' : ''}>
          <span>${value}</span>`;
        choices.appendChild(choice);
      }
      row.append(statement, choices);
      matrix.appendChild(row);
    });
    wrap.appendChild(matrix);
    return wrap;
  }

  function renderFields(fields, page) {
    const wrap = document.createElement('div');
    const mostlyTextareas = fields.filter(field => field.type === 'textarea').length >= 2;
    wrap.className = mostlyTextareas ? 'field-grid text-grid' : 'field-grid';
    if (page.section === 'about' || page.section === 'involvement') wrap.classList.add('compact-fields');

    fields.forEach(field => {
      const block = document.createElement('div');
      block.className = `field field-${field.type}`;
      if (field.type === 'checkbox' && field.options?.length > 8) block.classList.add('wide-field');
      if (field.type === 'note') {
        block.classList.add('page-note');
        block.textContent = field.label;
        wrap.appendChild(block);
        return;
      }

      const label = document.createElement('div');
      label.className = 'field-label';
      label.innerHTML = `${escapeHtml(field.label)}${field.required ? '<span class="required">Required</span>' : ''}`;
      block.appendChild(label);

      if (field.type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.name = field.id;
        textarea.rows = field.rows || 2;
        textarea.value = draft[field.id] || '';
        block.appendChild(textarea);
      } else if (field.type === 'text' || field.type === 'email') {
        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.id;
        input.value = draft[field.id] || '';
        input.autocomplete = field.type === 'email' ? 'email' : 'name';
        block.appendChild(input);
      } else {
        const options = document.createElement('div');
        options.className = `plain-options ${field.type === 'checkbox' ? 'checkbox-options' : 'radio-options'}`;
        (field.options || []).forEach((option, index) => {
          const item = document.createElement('label');
          item.className = 'plain-choice';
          const input = document.createElement('input');
          input.type = field.type;
          input.name = field.id;
          input.value = option;
          input.id = `${field.id}-${index}`;
          input.checked = field.type === 'checkbox'
            ? (Array.isArray(draft[field.id]) && draft[field.id].includes(option))
            : draft[field.id] === option;
          item.append(input, document.createTextNode(option));
          options.appendChild(item);
        });
        block.appendChild(options);
      }
      wrap.appendChild(block);
    });
    return wrap;
  }

  function bindAutosave(scope) {
    scope.querySelectorAll('input, textarea').forEach(control => {
      const eventName = control.tagName === 'TEXTAREA' || control.type === 'text' || control.type === 'email' ? 'input' : 'change';
      control.addEventListener(eventName, debounce(() => saveDraft(false), 220));
    });
  }

  function collectVisibleData() {
    const current = host.querySelector('.screen.current') || host.querySelector('.screen');
    if (!current) return draft;
    const names = new Set([...current.querySelectorAll('input[name], textarea[name]')].map(el => el.name));
    names.forEach(name => {
      const controls = [...current.querySelectorAll(`[name="${cssEscape(name)}"]`)];
      if (!controls.length) return;
      if (controls[0].type === 'checkbox') {
        draft[name] = controls.filter(control => control.checked).map(control => control.value);
      } else if (controls[0].type === 'radio') {
        const selected = controls.find(control => control.checked);
        if (selected) draft[name] = Number.isNaN(Number(selected.value)) ? selected.value : Number(selected.value);
      } else {
        draft[name] = controls[0].value.trim();
      }
    });
    return draft;
  }

  function sectionName(id) {
    return qdata.sectionOrder.find(section => section.id === id)?.short || id;
  }

  function buildSectionTabs(activePage) {
    sectionTabs.innerHTML = '';
    qdata.sectionOrder.forEach(section => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = section.short;
      button.className = 'section-tab';
      button.setAttribute('aria-current', activePage.section === section.id ? 'step' : 'false');
      button.addEventListener('click', () => {
        const target = pages.findIndex(page => page.section === section.id);
        if (target >= 0) goTo(introCount + target, target + introCount > currentIndex ? 1 : -1);
      });
      sectionTabs.appendChild(button);
    });
  }

  function updateChrome() {
    footerActions.innerHTML = '';
    const inSurvey = currentIndex >= introCount;
    sectionProgress.hidden = !inSurvey;

    if (!inSurvey) {
      pageCount.textContent = `Page ${currentIndex + 1} of ${introCount}`;
      progressText.textContent = currentIndex === 0 ? 'Introduction' : 'How it works';
      if (currentIndex === 0) {
        footerActions.append(
          makeButton('Go straight to the questionnaire', 'secondary', () => goTo(introCount, 1)),
          makeButton(introScreens[0].primaryLabel || 'Next', 'primary', () => goTo(1, 1))
        );
      } else {
        footerActions.append(
          makeButton('Back', 'secondary', () => goTo(0, -1)),
          makeButton(introScreens[1].primaryLabel || 'Begin', 'primary', () => goTo(introCount, 1))
        );
      }
      return;
    }

    const pageIndex = currentSurveyPageIndex();
    const page = pages[pageIndex];
    buildSectionTabs(page);
    pageCount.textContent = `Questionnaire page ${pageIndex + 1} of ${pages.length}`;
    updateProgress();

    const backTarget = pageIndex === 0 ? introCount - 1 : currentIndex - 1;
    footerActions.append(makeButton('Back', 'secondary', () => goTo(backTarget, -1)));
    if (pageIndex === pages.length - 1) {
      footerActions.append(makeButton('Submit response', 'primary', submitResponse));
    } else {
      footerActions.append(makeButton('Next', 'primary', () => goTo(currentIndex + 1, 1)));
    }
  }

  function makeButton(label, style, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `button ${style}`;
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  function goTo(index, direction = 1) {
    if (moving || index < 0 || index >= totalScreens || index === currentIndex) return;
    collectVisibleData();
    saveDraft(false);
    moving = true;

    const oldScreen = host.querySelector('.screen.current');
    const nextScreen = buildScreen(index);
    nextScreen.classList.add(direction > 0 ? 'from-right' : 'from-left');
    host.appendChild(nextScreen);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextScreen.classList.add('current');
        nextScreen.classList.remove('from-right', 'from-left');
        if (oldScreen) oldScreen.classList.add(direction > 0 ? 'to-left' : 'to-right');
      });
    });

    window.setTimeout(() => {
      oldScreen?.remove();
      currentIndex = index;
      moving = false;
      updateChrome();
      const firstInput = nextScreen.querySelector('input, textarea');
      if (firstInput && window.matchMedia('(prefers-reduced-motion: reduce)').matches) firstInput.focus({ preventScroll: true });
    }, 410);
  }

  function initialRender() {
    const screen = buildScreen(0);
    screen.classList.add('current');
    host.appendChild(screen);
    updateChrome();
    if (Object.keys(draft).length) saveStatus.textContent = 'A saved draft is available';
  }

  function validateRequired() {
    const missing = allQuestions().find(question => question.required && !answered(draft[question.id]));
    if (!missing) return true;
    const pageIndex = pages.findIndex(page => (page.fields || []).some(field => field.id === missing.id));
    showDialog(`<h2>One required answer is missing.</h2><p>${escapeHtml(missing.label)}</p>`);
    if (pageIndex >= 0) goTo(introCount + pageIndex, -1);
    return false;
  }

  function computeScores(payload) {
    const pairs = [
      ['Supporting writers', 'imp_writers', 'perf_writers'],
      ['Supporting multimedia and digital communicators', 'imp_multimedia', 'perf_multimedia'],
      ['Improving craft', 'imp_craft', 'perf_craft'],
      ['Helping with opportunities and assignments', 'imp_opportunities', 'perf_opportunities'],
      ['Providing networking', 'imp_networking', 'perf_networking'],
      ['Mentoring newer communicators', 'imp_mentoring', 'perf_mentoring'],
      ['Welcoming students and early-career creators', 'imp_students', 'perf_students'],
      ['Welcoming women and broader voices', 'imp_women_broader', 'perf_women_broader'],
      ['Promoting conservation and responsible recreation', 'imp_conservation', 'perf_conservation']
    ];
    const gaps = pairs.map(([label, importanceId, performanceId]) => {
      const importance = Number(payload[importanceId]);
      const performance = Number(payload[performanceId]);
      if (!Number.isFinite(importance) || !Number.isFinite(performance)) return null;
      return { label, importance, performance, gap: Number((importance - performance).toFixed(2)) };
    }).filter(Boolean).sort((a, b) => b.gap - a.gap);
    return { gaps };
  }

  async function submitResponse() {
    collectVisibleData();
    saveDraft(true);
    if (!validateRequired()) return;

    const record = {
      created_at: new Date().toISOString(),
      survey_version: config.surveyVersion || 'mowa-direction-survey-v4',
      respondent_type: draft.role || null,
      member_duration: draft.mowa_years || null,
      creator_types: Array.isArray(draft.creator_types) ? draft.creator_types : [],
      age_range: draft.age_range || null,
      gender: draft.gender || null,
      contact_provided: Boolean(draft.contact_name || draft.contact_email),
      payload: { ...draft },
      scores: computeScores(draft),
      source: 'github-pages-static-site'
    };

    let sentToSupabase = false;
    try {
      if (config.supabaseUrl && config.supabaseAnonKey && window.supabase) {
        const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
        const { error } = await client.from(config.tableName || 'mowa_direction_survey_responses').insert(record);
        if (error) throw error;
        sentToSupabase = true;
      }
      const stored = JSON.parse(localStorage.getItem(submissionsKey) || '[]');
      stored.push(record);
      localStorage.setItem(submissionsKey, JSON.stringify(stored));
      localStorage.removeItem(draftKey);
      showDialog(`
        <h2>Thank you. Your response has been saved.</h2>
        <p>${sentToSupabase ? 'Your response was submitted successfully.' : 'Supabase is not configured in this review copy, so the response was saved only in this browser.'}</p>
        <p>Contact information was optional and will only be present if you chose to provide it.</p>`);
      saveStatus.textContent = 'Response saved';
    } catch (error) {
      showDialog(`<h2>The response could not be sent to Supabase.</h2><p>It remains saved in this browser.</p><p class="error-text">${escapeHtml(error.message || error)}</p>`);
    }
  }

  function showDialog(html) {
    dialogContent.innerHTML = html;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function downloadJson(filename, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function cssEscape(value) {
    return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/"/g, '\\"');
  }

  function debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  document.getElementById('homeLink').addEventListener('click', event => {
    event.preventDefault();
    if (currentIndex !== 0) goTo(0, -1);
  });
  document.getElementById('saveDraft').addEventListener('click', () => saveDraft(true));
  document.getElementById('exportDraft').addEventListener('click', () => {
    saveDraft(true);
    downloadJson(`mowa-questionnaire-draft-${new Date().toISOString().slice(0, 10)}.json`, draft);
  });
  document.getElementById('closeDialog').addEventListener('click', () => dialog.close());

  initialRender();
})();
