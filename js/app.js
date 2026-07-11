(() => {
  const config = window.MOWA_SURVEY_CONFIG || {};
  const qdata = window.MOWA_QUESTIONNAIRE;
  const form = document.getElementById('surveyForm');
  const tabs = document.getElementById('sectionTabs');
  const container = document.getElementById('sectionContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const saveStatus = document.getElementById('saveStatus');
  const submitMessage = document.getElementById('submitMessage');
  const prevBtn = document.getElementById('prevSection');
  const nextBtn = document.getElementById('nextSection');
  const submitBtn = document.getElementById('submitSurvey');
  const saveDraftBtn = document.getElementById('saveDraft');
  const exportDraftBtn = document.getElementById('exportDraft');
  const draftKey = 'mowa_direction_survey_draft_v1';
  const submissionsKey = 'mowa_direction_survey_submissions_v1';
  let activeIndex = 0;
  let draft = loadDraft();

  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(draftKey)) || {}; }
    catch { return {}; }
  }

  function saveDraft(manual = false) {
    draft = collectData();
    localStorage.setItem(draftKey, JSON.stringify(draft));
    const msg = manual ? 'Draft saved' : 'Draft autosaved';
    saveStatus.textContent = `${msg} • ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    updateProgress();
  }

  function allQuestions() {
    return qdata.sections.flatMap(section => section.questions);
  }

  function createTabs() {
    tabs.innerHTML = '';
    qdata.sections.forEach((section, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'section-tab';
      button.textContent = section.title;
      button.setAttribute('aria-current', index === activeIndex ? 'step' : 'false');
      button.addEventListener('click', () => {
        saveDraft();
        activeIndex = index;
        renderSection();
      });
      tabs.appendChild(button);
    });
  }

  function renderSection() {
    const section = qdata.sections[activeIndex];
    container.innerHTML = '';
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'survey-section';
    fieldset.innerHTML = `
      <legend><span>${section.eyebrow}</span>${section.title}</legend>
      <p class="section-intro">${section.intro}</p>
    `;
    section.questions.forEach(question => fieldset.appendChild(renderQuestion(question)));
    container.appendChild(fieldset);
    prevBtn.disabled = activeIndex === 0;
    nextBtn.classList.toggle('hidden', activeIndex === qdata.sections.length - 1);
    submitBtn.classList.toggle('hidden', activeIndex !== qdata.sections.length - 1);
    createTabs();
    updateProgress();
    window.scrollTo({ top: document.getElementById('survey').offsetTop - 80, behavior: 'smooth' });
  }

  function renderQuestion(question) {
    const wrapper = document.createElement('div');
    wrapper.className = `question question-${question.type}`;
    const label = document.createElement('div');
    label.className = 'question-label';
    label.innerHTML = `${question.label}${question.required ? '<span class="required"> Required</span>' : ''}`;
    wrapper.appendChild(label);

    if (question.type === 'scale') {
      wrapper.appendChild(renderScale(question));
      return wrapper;
    }

    if (question.type === 'textarea') {
      const textarea = document.createElement('textarea');
      textarea.name = question.id;
      textarea.rows = 4;
      textarea.value = draft[question.id] || '';
      textarea.addEventListener('input', debounce(() => saveDraft(), 300));
      wrapper.appendChild(textarea);
      return wrapper;
    }

    if (question.type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = question.id;
      input.value = draft[question.id] || '';
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
        const current = Array.isArray(draft[question.id]) ? draft[question.id] : [];
        input.checked = current.includes(option);
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
      label.innerHTML = `<input type="radio" name="${question.id}" value="${i}" ${Number(draft[question.id]) === i ? 'checked' : ''}><span>${i}</span><small>${labels[i - 1]}</small>`;
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

  function collectData() {
    const data = { ...draft };
    allQuestions().forEach(question => {
      if (question.type === 'checkbox') {
        data[question.id] = Array.from(form.querySelectorAll(`input[name="${question.id}"]:checked`)).map(el => el.value);
      } else if (question.type === 'radio' || question.type === 'scale') {
        const checked = form.querySelector(`input[name="${question.id}"]:checked`);
        if (checked) data[question.id] = checked.value === 'NA' ? 'NA' : coerceValue(checked.value);
      } else {
        const input = form.querySelector(`[name="${question.id}"]`);
        if (input) data[question.id] = input.value.trim();
      }
    });
    return data;
  }

  function coerceValue(value) {
    const number = Number(value);
    return Number.isFinite(number) && String(number) === String(value) ? number : value;
  }

  function updateProgress() {
    const data = collectData();
    const questions = allQuestions();
    let answered = 0;
    questions.forEach(q => {
      const value = data[q.id];
      if (Array.isArray(value) && value.length) answered++;
      else if (value !== undefined && value !== null && value !== '') answered++;
    });
    const pct = Math.round((answered / questions.length) * 100);
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
    const current = JSON.parse(localStorage.getItem(submissionsKey) || '[]');
    current.push(record);
    localStorage.setItem(submissionsKey, JSON.stringify(current));
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
      <div class="table-wrap"><table><thead><tr><th>Largest personal gaps in this response</th><th>Importance</th><th>Performance</th><th>Gap</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No gap scores available yet.</td></tr>'}</tbody></table></div>
      <p><a href="results.html">Open the results analyzer</a> to combine responses.</p>
    `;
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

  prevBtn.addEventListener('click', () => {
    saveDraft();
    activeIndex = Math.max(0, activeIndex - 1);
    renderSection();
  });

  nextBtn.addEventListener('click', () => {
    saveDraft();
    activeIndex = Math.min(qdata.sections.length - 1, activeIndex + 1);
    renderSection();
  });

  saveDraftBtn.addEventListener('click', () => saveDraft(true));

  exportDraftBtn.addEventListener('click', () => {
    saveDraft(true);
    downloadJson(`mowa-survey-draft-${new Date().toISOString().slice(0,10)}.json`, collectData());
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    saveDraft(true);
    const payload = collectData();
    const record = {
      created_at: new Date().toISOString(),
      survey_version: config.surveyVersion || 'mowa-direction-survey-v1',
      respondent_type: payload.role || null,
      member_duration: payload.mowa_years || null,
      creator_types: Array.isArray(payload.creator_types) ? payload.creator_types : [],
      age_range: payload.age_range || null,
      gender: payload.gender || null,
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

  renderSection();
  if (Object.keys(draft).length) saveStatus.textContent = 'Draft restored from this browser';
})();
