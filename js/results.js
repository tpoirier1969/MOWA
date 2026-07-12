(() => {
  const qdata = window.MOWA_QUESTIONNAIRE;
  const submissionsKeys = [
    'mowa-direction-survey-v4-submissions',
    'mowa-direction-survey-v3-submissions',
    'mowa_direction_survey_submissions_v3',
    'mowa_direction_survey_submissions_v2',
    'mowa_direction_survey_submissions_v1'
  ];

  const status = document.getElementById('analysisStatus');
  const summaryCards = document.getElementById('summaryCards');
  const gapTable = document.getElementById('gapTable');
  const scaleTable = document.getElementById('scaleTable');
  const missionTable = document.getElementById('missionTable');
  const downloadSummary = document.getElementById('downloadSummary');
  let currentSummary = null;

  const gapPairs = [
    { label: 'Supporting writers', importance: 'imp_writers', performance: 'perf_writers' },
    { label: 'Supporting multimedia and digital communicators', importance: 'imp_multimedia', performance: 'perf_multimedia' },
    { label: 'Improving craft', importance: 'imp_craft', performance: 'perf_craft' },
    { label: 'Helping with opportunities and assignments', importance: 'imp_opportunities', performance: 'perf_opportunities' },
    { label: 'Providing networking', importance: 'imp_networking', performance: 'perf_networking' },
    { label: 'Mentoring newer communicators', importance: 'imp_mentoring', performance: 'perf_mentoring' },
    { label: 'Welcoming students and early-career creators', importance: 'imp_students', performance: 'perf_students' },
    { label: 'Welcoming women and broader voices', importance: 'imp_women_broader', performance: 'perf_women_broader' },
    { label: 'Promoting conservation and responsible recreation', importance: 'imp_conservation', performance: 'perf_conservation' }
  ];

  const discussionGroups = [
    { area: 'Member expectations', fields: 'expectations_met, expected_connections, expected_growth, expected_enjoyable_activities, expected_learning_opportunities, expected_more_needed, member_value' },
    { area: 'Mission and member value', fields: 'imp_writers, imp_multimedia, imp_craft, imp_opportunities, imp_networking, imp_mentoring, imp_students, imp_women_broader, imp_conservation, imp_heritage' },
    { area: 'Delivery and experience', fields: 'perf_writers, perf_multimedia, perf_craft, perf_opportunities, perf_networking, perf_mentoring, perf_students, perf_women_broader, perf_conservation, member_value' },
    { area: 'Activities and communication', fields: 'conference_effectiveness, membership_clarity, welcome_new_people, communication_effectiveness, website_effectiveness' },
    { area: 'Awards and recognition', fields: 'awards_reflect_work, awards_support_growth, awards_welcome_new_formats, awards_recognize_new_voices' },
    { area: 'Future priorities', fields: 'future_website, future_join_path, future_mentor, future_student_path, future_workshops, future_member_spotlights, future_partnerships, future_new_formats, future_meetups, future_stronger_social' },
    { area: 'Overall direction', fields: 'urgency_membership, urgency_relevance, urgency_preserve_and_update' }
  ];

  function getQuestionMap() {
    const map = new Map();
    (qdata.pages || []).forEach(page => {
      (page.items || []).forEach(item => map.set(item.id, item));
      (page.fields || []).forEach(field => map.set(field.id, field));
    });
    return map;
  }

  function normalize(records) {
    if (!Array.isArray(records)) return [];
    return records
      .map(r => r && r.payload ? r : { payload: r, created_at: r?.created_at || null })
      .filter(r => r.payload && typeof r.payload === 'object');
  }

  function average(values) {
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  }

  function gapSignal(value) {
    if (value >= 2) return '<span class="signal critical">Major shortfall</span>';
    if (value >= 1.5) return '<span class="signal warn">Strategic gap</span>';
    if (value >= 0.75) return '<span class="signal mild">Watch</span>';
    return '<span class="signal ok">Aligned enough</span>';
  }

  function gapSignalText(value) {
    if (value >= 2) return 'Major shortfall';
    if (value >= 1.5) return 'Strategic gap';
    if (value >= 0.75) return 'Watch';
    return 'Aligned enough';
  }

  function analyze(records) {
    const data = normalize(records);
    if (!data.length) {
      status.textContent = 'No usable responses found.';
      return;
    }

    const qmap = getQuestionMap();
    const numeric = {};
    for (const [id, q] of qmap.entries()) {
      const values = data.map(r => Number(r.payload[id])).filter(Number.isFinite);
      if (values.length) numeric[id] = average(values);
    }

    const gaps = gapPairs
      .map(pair => {
        const importance = numeric[pair.importance];
        const performance = numeric[pair.performance];
        if (!Number.isFinite(importance) || !Number.isFinite(performance)) return null;
        const gap = Math.round((importance - performance) * 100) / 100;
        return { ...pair, importance, performance, gap };
      })
      .filter(Boolean)
      .sort((a, b) => b.gap - a.gap);

    const allScales = Object.entries(numeric)
      .map(([id, avg]) => ({ id, label: qmap.get(id)?.label || id, avg, count: data.map(r => Number(r.payload[id])).filter(Number.isFinite).length }))
      .sort((a, b) => b.avg - a.avg);

    currentSummary = {
      responseCount: data.length,
      gaps,
      allScales,
      generatedAt: new Date().toISOString()
    };
    renderSummary(currentSummary);
    downloadSummary.disabled = false;
    status.textContent = `Loaded ${data.length} response${data.length === 1 ? '' : 's'}.`;
  }

  function renderSummary(summary) {
    const topGap = summary.gaps[0];
    const gapCount = summary.gaps.filter(g => g.gap >= 1.5).length;

    summaryCards.innerHTML = `
      <div class="summary-card"><span>Responses</span><strong>${summary.responseCount}</strong><p>Total usable records loaded.</p></div>
      <div class="summary-card"><span>Largest gap</span><strong>${topGap ? topGap.gap.toFixed(2) : '—'}</strong><p>${topGap ? escapeHtml(topGap.label) : 'No paired scores yet.'}</p></div>
      <div class="summary-card"><span>Strategic gaps</span><strong>${gapCount}</strong><p>Areas where importance outpaces delivery by at least 1.5 points.</p></div>
    `;

    gapTable.innerHTML = `
      <thead><tr><th>Area</th><th>Importance avg.</th><th>Delivery avg.</th><th>Gap</th><th>Signal</th></tr></thead>
      <tbody>${summary.gaps.map(g => `<tr><td>${escapeHtml(g.label)}</td><td>${g.importance.toFixed(2)}</td><td>${g.performance.toFixed(2)}</td><td><strong>${g.gap.toFixed(2)}</strong></td><td>${gapSignal(g.gap)}</td></tr>`).join('')}</tbody>
    `;

    scaleTable.innerHTML = `
      <thead><tr><th>Question</th><th>Average</th><th>Responses</th></tr></thead>
      <tbody>${summary.allScales.map(row => `<tr><td>${escapeHtml(row.label)}</td><td>${row.avg.toFixed(2)}</td><td>${row.count}</td></tr>`).join('')}</tbody>
    `;

    missionTable.innerHTML = `
      <thead><tr><th>Discussion area</th><th>Related survey fields</th><th>How to use it</th></tr></thead>
      <tbody>${discussionGroups.map(row => `<tr><td>${escapeHtml(row.area)}</td><td><code>${escapeHtml(row.fields)}</code></td><td>Use the related averages, gap scores, and written comments together to guide the discussion.</td></tr>`).join('')}</tbody>
    `;
  }

  function downloadCsv(summary) {
    const rows = [['Area', 'Importance Average', 'Delivery Average', 'Gap', 'Signal']];
    summary.gaps.forEach(g => rows.push([g.label, g.importance, g.performance, g.gap, gapSignalText(g.gap)]));
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mowa-gap-summary-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  document.getElementById('loadLocal').addEventListener('click', () => {
    try {
      let records = [];
      for (const key of submissionsKeys) {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]');
        if (parsed.length) {
          records = parsed;
          break;
        }
      }
      analyze(records);
    } catch {
      status.textContent = 'Could not read browser responses.';
    }
  });

  document.getElementById('jsonUpload').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try { analyze(JSON.parse(await file.text())); }
    catch (error) { status.textContent = `Could not parse JSON: ${error.message}`; }
  });

  document.getElementById('analyzePasted').addEventListener('click', () => {
    const text = document.getElementById('jsonPaste').value.trim();
    if (!text) return;
    try { analyze(JSON.parse(text)); }
    catch (error) { status.textContent = `Could not parse pasted JSON: ${error.message}`; }
  });

  downloadSummary.addEventListener('click', () => {
    if (currentSummary) downloadCsv(currentSummary);
  });
})();
