(() => {
  const qdata = window.MOWA_QUESTIONNAIRE;
  const config = window.MOWA_SURVEY_CONFIG || {};
  const form = document.getElementById('surveyForm');
  const tabs = document.getElementById('sectionTabs');
  const container = document.getElementById('sectionContainer');
  const saveStatus = document.getElementById('saveStatus');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const prevBtn = document.getElementById('prevSection');
  const nextBtn = document.getElementById('nextSection');
  const submitBtn = document.getElementById('submitSurvey');
  const saveDraftBtn = document.getElementById('saveDraft');
  const exportDraftBtn = document.getElementById('exportDraft');
  const submitMessage = document.getElementById('submitMessage');
  const draftKey = 'mowa_direction_survey_draft_v3';
  const oldDraftKey = 'mowa_direction_survey_draft_v2';
  const submissionsKey = 'mowa_direction_survey_submissions_v3';
  const oldSubmissionsKey = 'mowa_direction_survey_submissions_v2';
  let activeIndex = 0;
  let activeQuestionIndex = 0;
  let draft = loadDraft();

  function loadDraft() {
    try {
      return JSON.parse(localStorage.getItem(draftKey)) || JSON.parse(localStorage.getItem(oldDraftKey)) || {};
    } catch {
      return {};
    }
  }

  function sectionQuestions(sectionIndex = activeIndex) {
    return qdata.sections[sectionIndex].questions || [];
  }

  function allQuestions(includeNotes = false) {
    return qdata.sections
      .flatMap(section => section.questions || [])
      .filter(q => includeNotes || q.type !== 'note');
  }

  function questionNumber(sectionIndex = activeIndex, questionIndex = activeQuestionIndex) {
    let count = 0;
    for (let i = 0; i < sectionIndex; i++) count += qdata.sections[i].questions.length;
    return count + questionIndex + 1;
  }

  function questionTotal() {
    return qdata.sections.reduce((sum, section) => sum + section.questions.length, 0);
  }

  function createTabs() {
    tabs.innerHTML = '';
    qdata.sections.forEach((section, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'section-tab';
      const tabLabels = {
        profile: 'About',
        purpose: 'Should do',
        expectations: 'Expectations',
        delivery: 'Serving',
        activities: 'Activities',
        membership: 'Membership',
        future: 'Future ideas',
        involvement: 'Involvement',
        tradeoffs: 'Preserve/improve',
        missionfit: 'Mission fit',
        final: 'Final'
      };
      button.textContent = `${index + 1}. ${tabLabels[section.id] || section.title}`;
      button.setAttribute('aria-current', index === activeIndex ? 'step' : 'false');
      button.addEventListener('click', () => {
        saveDraft();
        activeIndex = index;
        activeQuestionIndex = 0;
        renderQuestionPage();
      });
      tabs.appendChild(button);
    });
  }

  function saveDraft(manual = false) {
    draft = collectVisibleData();
    localStorage.setItem(draftKey, JSON.stringify(draft));
    const msg = manual ? 'Draft saved' : 'Draft autosaved';
    saveStatus.textContent = `${msg} • ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    updateProgress();
  }

  function navButton(label, direction, variant = 'secondary') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `button ${variant} compact-button`;
    button.textContent = label;
    button.addEventListener('click', () => direction === 'next' ? moveQuestion(1) : moveQuestion(-1));
    if (direction === 'back' && isFirstQuestion()) button.disabled = true;
    return button;
  }

  function questionNav(position = 'bottom') {
    const wrap = document.createElement('div');
    wrap.className = `question-nav question-nav-${position}`;
    const status = document.createElement('span');
    status.className = 'question-count';
    status.textContent = `Question ${questionNumber()} of ${questionTotal()}`;
    wrap.append(status, navButton('Back', 'back'));

    if (isLastQuestion()) {
      const submit = document.createElement('button');
      submit.type = 'button';
      submit.className = 'button primary compact-button';
      submit.textContent = 'Submit response';
      submit.addEventListener('click', () => form.requestSubmit());
      wrap.append(submit);
    } else {
      wrap.append(navButton('Next', 'next', 'primary'));
    }
    return wrap;
  }

  function renderQuestionPage() {
    const section = qdata.sections[activeIndex];
    const questions = sectionQuestions();
    const question = questions[activeQuestionIndex] || questions[0];
    if (!question) return;

    container.innerHTML = '';
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'survey-section single-question';
    fieldset.innerHTML = `
      <legend><span>${escapeHtml(section.eyebrow)}</span>${escapeHtml(section.title)}</legend>
      <p class="section-intro">${escapeHtml(section.intro)}</p>
    `;
    fieldset.appendChild(questionNav('top'));
    fieldset.appendChild(renderQuestion(question));
    fieldset.appendChild(questionNav('bottom'));
    container.appendChild(fieldset);

    prevBtn.disabled = isFirstQuestion();
    nextBtn.classList.toggle('hidden', isLastQuestion());
    submitBtn.classList.toggle('hidden', !isLastQuestion());
    createTabs();
    updateProgress();

    const survey = document.getElementById('survey');
    if (survey && window.scrollY > survey.offsetTop) {
      window.scrollTo({ top: survey.offsetTop - 72, behavior: 'smooth' });
    }
  }

  function renderQuestion(question) {
    const wrapper = document.createElement('div');
    wrapper.className = `question question-${question.type}`;

    if (question.type === 'note') {
      wrapper.innerHTML = `<div class="note-inline">${escapeHtml(question.label)}</div>`;
      return wrapper;
    }

    const label = document.createElement('div');
    label.className = 'question-label';
    label.innerHTML = `${escapeHtml(question.label)}${question.required ? '<span class="required"> Required</span>' : ''}`;
    wrapper.appendChild(label);

    if (question.type === 'scale') {
      wrapper.appendChild(renderScale(question));
      return wrapper;
    }

    if (question.type === 'textarea') {
      const textarea = document.createElement('textarea');
      textarea.name = question.id;
      textarea.rows = question.rows || 3;
      textarea.value = draft[question.id] || '';
      textarea.addEventListener('input', debounce(() => saveDraft(), 300));
      wrapper.appendChild(textarea);
      return wrapper;
    }

    if (question.type === 'text' || question.type === 'email') {
      const input = document.createElement('input');
      input.type = question.type === 'email' ? 'email' : 'text';
      input.name = question.id;
      input.value = draft[question.id] || '';
      input.autocomplete = question.type === 'email' ? 'email' : 'off';
      input.addEventListener('input', debounce(() => saveDraft(), 300));
      wrapper.appendChild(input);
      return wrapper;
    }

    const group = document.createElement('div');
    group.className = 'choice-grid';
    (question.options || []).forEach((option, idx) => {
      const item = document.createElement('label');
      item.className = 'choice';
      const input = document.createElement('input');
      input.type = question.type;
      input.name = question.id;
      input.value = option;
      input.id = `${question.id}_${idx}`;
      if (question.type === 'checkbox') {
        const values = Array.isArray(draft[question.id]) ? draft[question.id] : [];
        input.checked = values.includes(option);
      } else {
        input.checked = draft[question.id] === option;
      }
      input.addEventListener('change', () => saveDraft());
      item.append(input, document.createTextNode(option));
      group.appendChild(item);
    });
    wrapper.appendChild(group);
    return wrapper;
  }

  function renderScale(question) {
    const scale = document.createElement('div');
    scale.className = 'scale-grid';
    const labels = qdata.scaleLabels[question.scale] || qdata.scaleLabels.importance;
    for (let i = 1; i <= 5; i++) {
      const label = document.createElement('label');
      label.className = 'scale-choice';
      label.innerHTML = `<input type="radio" name="${question.id}" value="${i}" ${Number(draft[question.id]) === i ? 'checked' : ''}><span>${i}</span><small>${escapeHtml(labels[i - 1])}</small>`;
      label.querySelector('input').addEventListener('change', () => saveDraft());
      scale.appendChild(label);
    }
    if (question.na) {
      const label = document.createElement('label');
      label.className = 'scale-choice na-choice';
      label.innerHTML = `<input type="radio" name="${question.id}" value="NA" ${draft[question.id] === 'NA' ? 'checked' : ''}><span>N/A</span><small>Not sure</small>`;
      label.querySelector('input').addEventListener('change', () => saveDraft());
      scale.appendChild(label);
    }
    return scale;
  }

  function collectVisibleData() {
    const data = { ...draft };
    const names = new Set(Array.from(container.querySelectorAll('input, textarea')).map(el => el.name).filter(Boolean));
    names.forEach(name => {
      const fields = Array.from(container.querySelectorAll(`[name="${cssEscape(name)}"]`));
      if (!fields.length) return;
      const first = fields[0];
      if (first.type === 'checkbox') {
        data[name] = fields.filter(el => el.checked).map(el => el.value);
      } else if (first.type === 'radio') {
        const checked = fields.find(el => el.checked);
        if (checked) data[name] = checked.value === 'NA' ? 'NA' : coerceValue(checked.value);
      } else {
        data[name] = first.value.trim();
      }
    });
    return data;
  }

  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function coerceValue(value) {
    const number = Number(value);
    return Number.isFinite(number) && String(number) === String(value) ? number : value;
  }

  function updateProgress() {
    const data = collectVisibleData();
    const questions = allQuestions(false);
    let answered = 0;
    questions.forEach(q => {
      const value = data[q.id];
      if (Array.isArray(value) && value.length) answered++;
      else if (value !== undefined && value !== null && value !== '') answered++;
    });
    const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `${pct}% complete`;
  }

  function computeScores(payload) {
    const gaps = qdata.gapPairs.map(pair => {
      const importance = Number(payload[pair.importance]);
      const performance = Number(payload[pair.performance]);
      if (!Number.isFinite(importance) || !Number.isFinite(performance)) return null;
      return { label: pair.label, importance, performance, gap: Number((importance - performance).toFixed(2)) };
    }).filter(Boolean).sort((a, b) => b.gap - a.gap);
    return { gaps };
  }

  async function submitToSupabase(record) {
    if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase) return { skipped: true };
    const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { error } = await client.from(config.tableName || 'mowa_direction_survey_responses').insert(record);
    if (error) throw error;
    return { skipped: false };
  }

  function saveLocalSubmission(record) {
    const saved = JSON.parse(localStorage.getItem(submissionsKey) || localStorage.getItem(oldSubmissionsKey) || '[]');
    saved.push(record);
    localStorage.setItem(submissionsKey, JSON.stringify(saved));
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

  function showSubmissionSummary(record, supabaseResult) {
    const rows = record.scores.gaps.slice(0, 6).map(g => `<tr><td>${escapeHtml(g.label)}</td><td>${g.importance}</td><td>${g.performance}</td><td><strong>${g.gap}</strong></td></tr>`).join('');
    submitMessage.hidden = false;
    submitMessage.innerHTML = `
      <h3>Response saved.</h3>
      <p>${supabaseResult.skipped ? 'Saved locally in this browser. Supabase is not configured yet.' : 'Saved locally and sent to Supabase.'}</p>
      <div class="table-wrap"><table><thead><tr><th>Largest personal gaps in this response</th><th>Importance</th><th>Delivery</th><th>Gap</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No gap scores available yet.</td></tr>'}</tbody></table></div>
      <p><a href="results.html">Open the results analyzer</a> to combine responses.</p>
    `;
    submitMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  }

  function debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  function isFirstQuestion() {
    return activeIndex === 0 && activeQuestionIndex === 0;
  }

  function isLastQuestion() {
    return activeIndex === qdata.sections.length - 1 && activeQuestionIndex === sectionQuestions().length - 1;
  }

  function moveQuestion(delta) {
    saveDraft();
    let nextSection = activeIndex;
    let nextQuestion = activeQuestionIndex + delta;
    if (nextQuestion >= sectionQuestions(nextSection).length) {
      nextSection = Math.min(qdata.sections.length - 1, nextSection + 1);
      nextQuestion = 0;
    } else if (nextQuestion < 0) {
      nextSection = Math.max(0, nextSection - 1);
      nextQuestion = sectionQuestions(nextSection).length - 1;
    }
    activeIndex = nextSection;
    activeQuestionIndex = Math.max(0, Math.min(sectionQuestions().length - 1, nextQuestion));
    renderQuestionPage();
  }

  function validateRequired(payload) {
    const missing = allQuestions(false).filter(q => q.required).find(q => {
      const value = payload[q.id];
      return value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
    });
    if (!missing) return true;
    for (let s = 0; s < qdata.sections.length; s++) {
      const qIndex = qdata.sections[s].questions.findIndex(q => q.id === missing.id);
      if (qIndex !== -1) {
        activeIndex = s;
        activeQuestionIndex = qIndex;
        renderQuestionPage();
        submitMessage.hidden = false;
        submitMessage.innerHTML = `<h3>One required question is missing.</h3><p>Please answer: ${escapeHtml(missing.label)}</p>`;
        return false;
      }
    }
    return false;
  }

  prevBtn.addEventListener('click', () => moveQuestion(-1));
  nextBtn.addEventListener('click', () => moveQuestion(1));
  saveDraftBtn.addEventListener('click', () => saveDraft(true));

  exportDraftBtn.addEventListener('click', () => {
    saveDraft(true);
    downloadJson(`mowa-survey-draft-${new Date().toISOString().slice(0,10)}.json`, collectVisibleData());
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    saveDraft(true);
    const payload = collectVisibleData();
    if (!validateRequired(payload)) return;
    const record = {
      created_at: new Date().toISOString(),
      survey_version: config.surveyVersion || 'mowa-direction-survey-v3',
      respondent_type: payload.role || null,
      member_duration: payload.mowa_years || null,
      creator_types: Array.isArray(payload.creator_types) ? payload.creator_types : [],
      age_range: payload.age_range || null,
      gender: payload.gender || null,
      contact_provided: Boolean(payload.contact_name || payload.contact_email),
      payload,
      scores: computeScores(payload),
      source: 'github-pages-static-site'
    };
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    let result = { skipped: true };
    try {
      result = await submitToSupabase(record);
      saveLocalSubmission(record);
      localStorage.removeItem(draftKey);
      localStorage.removeItem(oldDraftKey);
      draft = {};
      showSubmissionSummary(record, result);
      saveStatus.textContent = 'Submitted';
    } catch (error) {
      saveLocalSubmission(record);
      submitMessage.hidden = false;
      submitMessage.innerHTML = `<h3>Saved locally, but Supabase rejected the insert.</h3><p>${escapeHtml(error.message || error)}</p><p>You can still export from the analyzer. Check config.js, schema.sql, and RLS policies.</p>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit response';
    }
  });

  renderQuestionPage();
  if (Object.keys(draft).length) saveStatus.textContent = 'Draft restored from this browser';
})();
