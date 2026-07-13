(() => {
  'use strict';

  const data = window.MOWA_QUESTIONNAIRE;
  const sectionTabs = document.getElementById('sectionTabs');
  const progressBar = document.getElementById('progressBar');
  const host = document.getElementById('screenHost');

  if (!data || !sectionTabs || !progressBar || !host || !Array.isArray(data.sectionOrder)) return;

  const sectionCount = data.sectionOrder.length;
  sectionTabs.style.setProperty('--mowa-section-count', String(sectionCount));

  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 761px) {
      .section-tabs {
        display: grid;
        grid-template-columns: repeat(var(--mowa-section-count), minmax(0, 1fr));
        width: 100%;
        gap: 0;
        align-items: end;
      }

      .section-tab {
        width: 100%;
        min-width: 0;
        padding: 2px 5px 5px;
        text-align: center;
        line-height: 1.14;
        white-space: normal;
      }
    }
  `;
  document.head.appendChild(style);

  function syncProgressToSections() {
    const screens = host.querySelectorAll('.screen');
    const screen = screens.length ? screens[screens.length - 1] : null;
    const globalIndex = Number(screen?.dataset.index);
    const surveyIndex = globalIndex - data.introScreens.length;
    const page = data.pages[surveyIndex];

    if (!page || !sectionCount) return;

    const sectionIndex = data.sectionOrder.findIndex((section) => section.id === page.section);
    if (sectionIndex < 0) return;

    const pagesInSection = data.pages.filter((candidate) => candidate.section === page.section);
    const pageWithinSection = Math.max(0, pagesInSection.indexOf(page));
    const sectionFraction = pagesInSection.length
      ? (pageWithinSection + 1) / pagesInSection.length
      : 1;

    // Each label owns an equal-width segment. Progress advances within that
    // segment as the respondent moves through the pages in that section.
    const percent = ((sectionIndex + sectionFraction) / sectionCount) * 100;
    progressBar.style.width = `${Math.max(0, Math.min(100, percent)).toFixed(2)}%`;
  }

  let frame = 0;
  function scheduleSync() {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(syncProgressToSections);
  }

  new MutationObserver(scheduleSync).observe(sectionTabs, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-current']
  });

  new MutationObserver(scheduleSync).observe(host, {
    childList: true,
    subtree: false
  });

  window.addEventListener('resize', scheduleSync, { passive: true });
  scheduleSync();
})();
