(() => {
  const qdata = window.MOWA_QUESTIONNAIRE;
  const submissionsKey = 'mowa_direction_survey_submissions_v3';
  const legacySubmissionsKey = 'mowa_direction_survey_submissions_v2';
  const olderSubmissionsKey = 'mowa_direction_survey_submissions_v1';
  const status = document.getElementById('analysisStatus');
  const summaryCards = document.getElementById('summaryCards');
  const gapTable = document.getElementById('gapTable');
  const scaleTable = document.getElementById('scaleTable');
  const missionTable = document.getElementById('missionTable');
  const downloadSummary = document.getElementById('downloadSummary');
  let currentSummary = null;

  const missionRows = [
    { purpose: 'Support outdoor communicators', questions: 'imp_writers, imp_multimedia, perf_writers, perf_multimedia, fit_professional, fit_all_forms' },
    { purpose: 'Improve craft and communication skills', questions: 'imp_craft, perf_craft, awards_effectiveness, fit_skills' },
    { purpose: 'Further member careers and creative goals', questions: 'imp_opportunities, perf_opportunities, future_opportunity_board, fit_careers' },
    { purpose: 'Provide networking opportunities', questions: 'imp_networking, perf_networking, fit_networking' },
    { purpose: 'Mentor the next generation', questions: 'imp_mentoring, imp_students, perf_mentoring, perf_students, fit_next_gen' },
    { purpose: 'Support conservation and responsible recreation', questions: 'imp_conservation, perf_conservation, water_conservation_importance, water_conservation_effectiveness, fit_conservation' },
    { purpose: 'Awards and recognition', questions: 'awards_importance, awards_effectiveness, future_modern_awards' },
    { purpose: 'Membership standards and access', questions: 'standards_importance, standards_effectiveness, recruitment_effectiveness, sponsor_barrier' },
    { purpose: 'Public visibility and recruitment', questions: 'website_importance, website_recruiting, public_comms_importance, public_comms_effectiveness' },
    { purpose: 'Member expectations and involvement', questions: 'join_expectations, expectations_met, member_value, want_involved, help_areas' }
  ];

  function getQuestionMap() {
    const map = new Map();
    qdata.sections.flatMap(s => s.questions).filter(q => q.type !== 'note').forEach(q => map.set(q.id, q));
    return map;
  }

  function normalize(records) {
    if (!Array.isArray(records)) return [];
    return records.map(r => r.payload ? r : { payload: r, created_at: r.created_at || null }).filter(r => r.payload && typeof r.payload === 'object');
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
      if (q.type !== 'scale') continue;
      const values = data.map(r => Number(r.payload[id])).filter(Number.isFinite);
      if (values.length) numeric[id] = average(values);
    }
    const gaps = qdata.gapPairs.map(pair => {
      const importance = numeric[pair.importance];
      const performance = numeric[pair.performance];
      if (!Number.isFinite(importance) || !Number.isFinite(performance)) return null;
      return { label: pair.label, importance, performance, gap: round(importance - performance), responses: data.length };
    }).filter(Boolean).sort((a, b) => b.gap - a.gap);

    const allScales = Object.entries(numeric)
      .map(([id, avg]) => ({ id, label: qmap.get(id)?.label || id, avg, count: data.map(r => Number(r.payload[id])).filter(Number.isFinite).length }))
      .sort((a, b) => b.avg - a.avg);

    currentSummary = { responseCount: data.length, gaps, allScales, generatedAt: new Date().toISOString() };
    renderSummary(currentSummary);
    downloadSummary.disabled = false;
    status.textContent = `Loaded ${data.length} response${data.length === 1 ? '' : 's'}.`;
  }

  function renderSummary(summary) {
    const topGap = summary.gaps[0];
    const highGapCount = summary.gaps.filter(g => g.gap >= 1.5).length;
    summaryCards.innerHTML = `
      <div class="summary-card"><span>Responses</span><strong>${summary.responseCount}</strong><p>Total usable records loaded.</p></div>
      <div class="summary-card"><span>Largest gap</span><strong>${topGap ? topGap.gap.toFixed(2) : '—'}</strong><p>${topGap ? escapeHtml(topGap.label) : 'No paired scores yet.'}</p></div>
      <div class="summary-card"><span>Strategic gaps</span><strong>${highGapCount}</strong><p>Pairs with a gap of 1.5 or higher.</p></div>
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
      <thead><tr><th>Mission area</th><th>Related survey fields</th><th>How to use it</th></tr></thead>
      <tbody>${missionRows.map(row => `<tr><td>${escapeHtml(row.purpose)}</td><td><code>${escapeHtml(row.questions)}</code></td><td>Compare averages, gaps, and open comments. If importance is high and delivery is low, this is a board discussion area.</td></tr>`).join('')}</tbody>
    `;
  }

  function gapSignal(value) {
    if (value >= 2) return '<span class="signal critical">Major shortfall</span>';
    if (value >= 1.5) return '<span class="signal warn">Strategic gap</span>';
    if (value >= .75) return '<span class="signal mild">Watch</span>';
    return '<span class="signal ok">Aligned enough</span>';
  }

  function average(values) {
    return round(values.reduce((a, b) => a + b, 0) / values.length);
  }

  function round(value) { return Math.round(value * 100) / 100; }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
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

  function gapSignalText(value) {
    if (value >= 2) return 'Major shortfall';
    if (value >= 1.5) return 'Strategic gap';
    if (value >= .75) return 'Watch';
    return 'Aligned enough';
  }

  document.getElementById('loadLocal').addEventListener('click', () => {
    try {
      const records = JSON.parse(localStorage.getItem(submissionsKey) || '[]');
      if (records.length) analyze(records);
      else {
        const legacy = JSON.parse(localStorage.getItem(legacySubmissionsKey) || '[]');
        analyze(legacy.length ? legacy : JSON.parse(localStorage.getItem(olderSubmissionsKey) || '[]'));
      }
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
