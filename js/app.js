(() => {
  'use strict';

  const data = window.MOWA_QUESTIONNAIRE;
  const config = window.MOWA_SURVEY_CONFIG || {};
  const host = document.getElementById('screenHost');
  const sectionProgress = document.getElementById('sectionProgress');
  const sectionTabs = document.getElementById('sectionTabs');
  const progressBar = document.getElementById('progressBar');
  const saveStatus = document.getElementById('saveStatus');
  const homeLink = document.getElementById('homeLink');
  const dialog = document.getElementById('messageDialog');
  const dialogContent = document.getElementById('dialogContent');
  const closeDialog = document.getElementById('closeDialog');

  const draftKey = 'mowa_direction_survey_draft_v5';
  const legacyKeys = ['mowa_direction_survey_draft_v4', 'mowa_direction_survey_draft_v3'];
  const allScreens = [
    ...data.introScreens.map((screen) => ({ ...screen, screenType: 'intro' })),
    ...data.pages.map((page) => ({ ...page, screenType: 'survey' }))
  ];
  const firstSurveyIndex = data.introScreens.length;
  const slideMs = 460;

  let saved = loadSaved();
  let answers = saved.answers || {};
  let currentIndex = 0;
  let lastSurveyIndex = clamp(saved.pageIndex || firstSurveyIndex, firstSurveyIndex, allScreens.length - 1);
  let transitioning = false;
  let autosaveTimer = null;

  function loadSaved() {
    const keys = [draftKey, ...legacyKeys];
    for (const key of keys) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (!parsed) continue;
        if (parsed.answers) return parsed;
        return { answers: parsed, pageIndex: firstSurveyIndex, updatedAt: null };
      } catch (_) {
        // Try the next key.
      }
    }
    return { answers: {}, pageIndex: firstSurveyIndex, updatedAt: null };
  }

  function hasSavedAnswers() {
    return Object.values(answers).some((value) => Array.isArray(value) ? value.length > 0 : String(value || '').trim() !== '');
  }

  function persistDraft(immediate = false) {
    const save = () => {
      const payload = {
        answers,
        pageIndex: currentIndex >= firstSurveyIndex ? currentIndex : lastSurveyIndex,
        updatedAt: new Date().toISOString(),
        surveyVersion: config.surveyVersion || 'mowa-direction-survey-v5'
      };
      try {
        localStorage.setItem(draftKey, JSON.stringify(payload));
      } catch (_) {
        saveStatus.textContent = 'Answers cannot be saved in this browser session.';
        return;
      }
      saved = payload;
      const time = new Date(payload.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      saveStatus.textContent = `Saved on this computer at ${time}.`;
    };

    clearTimeout(autosaveTimer);
    if (immediate) save();
    else autosaveTimer = setTimeout(save, 250);
  }

  function clearDraft() {
    try {
      [draftKey, ...legacyKeys].forEach((key) => localStorage.removeItem(key));
    } catch (_) {
      // Storage may be unavailable in private or restricted browser contexts.
    }
    answers = {};
    saved = { answers: {}, pageIndex: firstSurveyIndex, updatedAt: null };
    lastSurveyIndex = firstSurveyIndex;
    saveStatus.textContent = 'Your answers are automatically saved on this computer.';
  }

  function makeButton(label, className, handler, type = 'button') {
    const button = document.createElement('button');
    button.type = type;
    button.className = `button ${className}`;
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  function createNavigation(options = {}) {
    const nav = document.createElement('div');
    nav.className = 'screen-nav';

    if (options.backIndex !== undefined) {
      nav.appendChild(makeButton(options.backLabel || 'Back', 'secondary', () => goTo(options.backIndex, -1)));
    }
    if (options.extraButtons) options.extraButtons.forEach((button) => nav.appendChild(button));
    if (options.nextIndex !== undefined) {
      nav.appendChild(makeButton(options.nextLabel || 'Next', 'primary', () => goTo(options.nextIndex, 1)));
    }
    if (options.submit) {
      nav.appendChild(makeButton('Submit response', 'primary', submitResponse));
    }
    return nav;
  }

  function createIntroScreen(screen, index) {
    const element = document.createElement('section');
    element.className = `screen ${screen.id === 'welcome' ? 'welcome-screen' : 'how-screen'}`;
    element.dataset.index = String(index);
    const inner = document.createElement('div');
    inner.className = 'screen-inner';

    if (screen.id === 'welcome') {
      const copy = document.createElement('div');
      copy.className = 'welcome-copy';
      copy.innerHTML = `<p class="kicker">${escapeHtml(screen.kicker)}</p><h1>${escapeHtml(screen.title)}</h1>`;
      screen.body.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        copy.appendChild(p);
      });

      const links = document.createElement('div');
      links.className = 'source-links';
      screen.links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = link.label;
        links.appendChild(a);
      });
      copy.appendChild(links);
      inner.appendChild(copy);

      const figure = document.createElement('figure');
      figure.className = 'hero-image';
      figure.innerHTML = `<img src="${escapeAttribute(screen.image)}" alt="${escapeAttribute(screen.imageAlt)}">`;
      inner.appendChild(figure);

      const extras = [];
      if (hasSavedAnswers()) {
        const notice = document.createElement('div');
        notice.className = 'resume-notice';
        const updated = saved.updatedAt ? new Date(saved.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'an earlier visit';
        notice.append(`Answers saved on this computer were found. Last updated ${updated}.`);
        const startOver = document.createElement('button');
        startOver.type = 'button';
        startOver.textContent = 'Start over';
        startOver.addEventListener('click', () => {
          if (window.confirm('Clear the answers saved on this computer and start over?')) {
            clearDraft();
            renderInitial(0);
          }
        });
        notice.appendChild(startOver);
        inner.appendChild(notice);
        extras.push(makeButton('Continue saved questionnaire', 'secondary', () => goTo(lastSurveyIndex, 1)));
      }
      extras.push(makeButton(screen.secondaryLabel, 'secondary', () => goTo(firstSurveyIndex, 1)));
      inner.appendChild(createNavigation({
        extraButtons: extras,
        nextIndex: 1,
        nextLabel: screen.primaryLabel
      }));
    } else {
      inner.innerHTML = `<p class="kicker">${escapeHtml(screen.kicker)}</p><h1>${escapeHtml(screen.title)}</h1>`;
      const list = document.createElement('ol');
      list.className = 'how-list';
      screen.bullets.forEach((bullet, i) => {
        const li = document.createElement('li');
        li.className = 'how-item';
        li.innerHTML = `<span class="how-number">0${i + 1}</span><p>${escapeHtml(bullet)}</p>`;
        list.appendChild(li);
      });
      inner.appendChild(list);
      const footer = document.createElement('p');
      footer.className = 'how-footer';
      footer.textContent = screen.footer;
      inner.appendChild(footer);
      inner.appendChild(createNavigation({ backIndex: 0, nextIndex: firstSurveyIndex, nextLabel: screen.primaryLabel }));
    }

    element.appendChild(inner);
    return element;
  }

  function createSurveyScreen(page, index) {
    const element = document.createElement('section');
    element.className = 'screen survey-screen';
    element.dataset.index = String(index);
    const inner = document.createElement('div');
    inner.className = 'screen-inner';

    const heading = document.createElement('header');
    heading.className = 'page-heading';
    const sectionName = data.sectionOrder.find((section) => section.id === page.section)?.short || page.section;
    heading.innerHTML = `
      <p class="kicker">${escapeHtml(sectionName)} · ${escapeHtml(page.part || '')}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.intro || '')}</p>
    `;
    inner.appendChild(heading);

    if (page.note) {
      const note = document.createElement('p');
      note.className = 'page-note';
      note.textContent = page.note;
      inner.appendChild(note);
    }

    if (page.awardCategories) inner.appendChild(renderAwardPanel(page.awardCategories));
    if (page.items) inner.appendChild(renderRatings(page));
    if (page.fields) inner.appendChild(renderFields(page.fields));

    const isLast = index === allScreens.length - 1;
    inner.appendChild(createNavigation({
      backIndex: index - 1,
      nextIndex: isLast ? undefined : index + 1,
      submit: isLast
    }));
    element.appendChild(inner);
    return element;
  }

  function renderAwardPanel(categories) {
    const panel = document.createElement('aside');
    panel.className = 'award-panel';
    panel.innerHTML = '<h2>Excellence in Craft award categories</h2>';
    const list = document.createElement('ul');
    list.className = 'award-list';
    categories.forEach((category) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(category.name)}</strong>${category.description ? ` — ${escapeHtml(category.description)}` : ''}`;
      list.appendChild(li);
    });
    panel.appendChild(list);
    return panel;
  }

  function renderRatings(page) {
    const list = document.createElement('div');
    list.className = 'rating-list';
    const labels = data.scales[page.matrixScale] || [];
    page.items.forEach((item) => {
      const block = document.createElement('div');
      block.className = 'rating-question';
      const label = document.createElement('p');
      label.className = 'rating-label';
      label.textContent = item.label;
      block.appendChild(label);

      const options = document.createElement('div');
      options.className = 'rating-options';
      labels.forEach((word, i) => {
        const choice = document.createElement('label');
        choice.className = 'score-choice';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = item.id;
        input.value = String(i + 1);
        input.checked = String(answers[item.id] || '') === String(i + 1);
        input.addEventListener('change', () => updateAnswer(item.id, Number(input.value)));
        const number = document.createElement('strong');
        number.textContent = String(i + 1);
        const text = document.createElement('span');
        text.textContent = word;
        choice.append(input, number, text);
        options.appendChild(choice);
      });
      block.appendChild(options);
      list.appendChild(block);
    });
    return list;
  }

  function renderFields(fields) {
    const stack = document.createElement('div');
    stack.className = 'field-stack';
    fields.forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.className = `field field-${field.type}`;
      const label = document.createElement('label');
      label.className = 'field-label';
      label.htmlFor = field.id;
      label.innerHTML = `${escapeHtml(field.label)}${field.required ? '<span class="required">Required</span>' : ''}`;
      wrapper.appendChild(label);

      if (field.type === 'radio') {
        const select = document.createElement('select');
        select.id = field.id;
        select.name = field.id;
        select.required = Boolean(field.required);
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Choose one';
        select.appendChild(placeholder);
        field.options.forEach((option) => {
          const item = document.createElement('option');
          item.value = option;
          item.textContent = option;
          item.selected = answers[field.id] === option;
          select.appendChild(item);
        });
        select.addEventListener('change', () => updateAnswer(field.id, select.value));
        wrapper.appendChild(select);
      } else if (field.type === 'checkbox') {
        label.removeAttribute('for');
        const options = document.createElement('div');
        options.className = 'plain-options';
        const selected = Array.isArray(answers[field.id]) ? answers[field.id] : [];
        field.options.forEach((option) => {
          const choice = document.createElement('label');
          choice.className = 'plain-choice';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = field.id;
          input.value = option;
          input.checked = selected.includes(option);
          input.addEventListener('change', () => {
            const values = [...options.querySelectorAll('input:checked')].map((node) => node.value);
            updateAnswer(field.id, values);
          });
          choice.append(input, document.createTextNode(option));
          options.appendChild(choice);
        });
        wrapper.appendChild(options);
      } else if (field.type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.id = field.id;
        textarea.name = field.id;
        textarea.rows = field.rows || 2;
        textarea.value = answers[field.id] || '';
        textarea.addEventListener('input', () => updateAnswer(field.id, textarea.value));
        wrapper.appendChild(textarea);
      } else {
        const input = document.createElement('input');
        input.id = field.id;
        input.name = field.id;
        input.type = field.type === 'email' ? 'email' : 'text';
        input.autocomplete = field.type === 'email' ? 'email' : 'name';
        input.value = answers[field.id] || '';
        input.addEventListener('input', () => updateAnswer(field.id, input.value));
        wrapper.appendChild(input);
      }
      stack.appendChild(wrapper);
    });
    return stack;
  }

  function updateAnswer(id, value) {
    answers[id] = value;
    persistDraft(false);
  }

  function createScreen(index) {
    const screen = allScreens[index];
    return screen.screenType === 'intro' ? createIntroScreen(screen, index) : createSurveyScreen(screen, index);
  }

  function renderInitial(index = 0) {
    currentIndex = clamp(index, 0, allScreens.length - 1);
    if (currentIndex >= firstSurveyIndex) lastSurveyIndex = currentIndex;
    host.innerHTML = '';
    const screen = createScreen(currentIndex);
    host.appendChild(screen);
    updateProgressUI();
  }

  function goTo(index, direction) {
    if (transitioning) return;
    const target = clamp(index, 0, allScreens.length - 1);
    if (target === currentIndex) return;

    transitioning = true;
    const outgoing = host.querySelector('.screen');
    const incoming = createScreen(target);
    const forward = direction >= 0;
    incoming.classList.add(forward ? 'enter-right' : 'enter-left');
    host.appendChild(incoming);

    // Force the browser to paint the starting position before transitioning.
    void incoming.offsetWidth;
    requestAnimationFrame(() => {
      outgoing.classList.add(forward ? 'exit-left' : 'exit-right');
      incoming.classList.remove(forward ? 'enter-right' : 'enter-left');
    });

    const finish = () => {
      outgoing.remove();
      incoming.removeEventListener('transitionend', finish);
      transitioning = false;
    };
    incoming.addEventListener('transitionend', finish);
    setTimeout(finish, slideMs + 120);

    currentIndex = target;
    if (currentIndex >= firstSurveyIndex) {
      lastSurveyIndex = currentIndex;
      persistDraft(true);
    }
    updateProgressUI();
  }

  function updateProgressUI() {
    const inSurvey = currentIndex >= firstSurveyIndex && currentIndex < allScreens.length;
    sectionProgress.hidden = !inSurvey;
    if (!inSurvey) return;

    const page = allScreens[currentIndex];
    sectionTabs.innerHTML = '';
    data.sectionOrder.forEach((section) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'section-tab';
      button.textContent = section.short;
      button.setAttribute('aria-current', section.id === page.section ? 'step' : 'false');
      const targetIndex = allScreens.findIndex((screen, i) => i >= firstSurveyIndex && screen.section === section.id);
      button.addEventListener('click', () => {
        if (targetIndex >= 0) goTo(targetIndex, targetIndex > currentIndex ? 1 : -1);
      });
      sectionTabs.appendChild(button);
    });

    const surveyPosition = currentIndex - firstSurveyIndex + 1;
    const surveyTotal = allScreens.length - firstSurveyIndex;
    progressBar.style.width = `${Math.round((surveyPosition / surveyTotal) * 100)}%`;
  }

  async function submitResponse() {
    if (!answers.role) {
      showDialog('One required answer is missing', 'Please return to the About You section and choose your relationship to MOWA.', true);
      return;
    }
    if (answers.contact_email && !/^\S+@\S+\.\S+$/.test(answers.contact_email)) {
      showDialog('Please check the email address', 'The optional email address does not appear to be complete.', true);
      return;
    }

    if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase) {
      showDialog(
        'Supabase is not configured yet',
        'Your answers remain safely saved on this computer. Add this survey’s Supabase URL and anonymous key to js/config.js before accepting responses.',
        true
      );
      return;
    }

    const submitButton = host.querySelector('.screen-nav .button.primary');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting…';
    }

    const scores = Object.fromEntries(
      Object.entries(answers).filter(([, value]) => typeof value === 'number' && value >= 1 && value <= 5)
    );
    const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const row = {
      survey_version: config.surveyVersion || 'mowa-direction-survey-v5',
      respondent_type: answers.role || null,
      member_duration: answers.mowa_years || null,
      creator_types: Array.isArray(answers.creator_types) ? answers.creator_types : [],
      age_range: answers.age_range || null,
      gender: answers.gender || null,
      contact_provided: Boolean((answers.contact_name || '').trim() || (answers.contact_email || '').trim()),
      payload: answers,
      scores,
      source: 'github-pages-static-site'
    };

    const { error } = await client.from(config.tableName || 'mowa_direction_survey_responses').insert(row);
    if (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit response';
      }
      showDialog('The response was not submitted', `${error.message} Your answers are still saved on this computer.`, true);
      return;
    }

    clearDraft();
    renderThankYou();
  }

  function renderThankYou() {
    sectionProgress.hidden = true;
    host.innerHTML = '';
    const screen = document.createElement('section');
    screen.className = 'screen thank-you';
    screen.innerHTML = `
      <div class="screen-inner">
        <p class="kicker">Response submitted</p>
        <h1>Thank you.</h1>
        <p>Your response has been recorded. The combined results can help MOWA understand what members value, where expectations are being met, and where the organization may be able to do more.</p>
      </div>`;
    host.appendChild(screen);
  }

  function showDialog(title, message, isError = false) {
    dialogContent.innerHTML = `<h2>${escapeHtml(title)}</h2><p class="${isError ? 'error-text' : ''}">${escapeHtml(message)}</p>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.alert(`${title}\n\n${message}`);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttribute(value) { return escapeHtml(value); }
  function clamp(value, min, max) { return Math.min(Math.max(Number(value) || 0, min), max); }

  homeLink.addEventListener('click', () => goTo(0, -1));
  closeDialog.addEventListener('click', () => dialog.close());
  renderInitial(0);
})();
