# MOWA Member & Board Direction Questionnaire

A self-contained static website for the Michigan Outdoor Writers Association direction questionnaire. It is designed for GitHub Pages with optional Supabase storage.

## What this revision includes

- Two compact introductory screens with no page scrolling on normal desktop/laptop displays.
- A local copy of the official MOWA logo.
- A custom multigenerational outdoor-communication hero image.
- Visible left/right slide transitions between screens.
- Compact 1–5 rating rows instead of oversized answer cards.
- Related questions grouped into short pages rather than one question at a time.
- A fixed Back/Next footer and a compact section strip that does not scroll sideways.
- Optional name/email fields only for respondents who want follow-up or involvement opportunities.
- MOWA’s listed Excellence in Craft award categories included in the questionnaire.
- Browser draft saving and JSON export.
- Optional Supabase submission using one namespaced table.
- `results.html` for private/local response analysis and importance-versus-delivery gap scoring.

## Main files

- `index.html` — questionnaire application shell.
- `css/app.css` — no-scroll questionnaire and slide-transition styling.
- `js/questions.js` — all questionnaire wording, sections, and scales.
- `js/app.js` — navigation, saving, transitions, submission, and export behavior.
- `js/config.js` — optional Supabase configuration.
- `results.html` and `js/results.js` — private/local results analyzer.
- `supabase/schema.sql` — safe-by-default Supabase table setup.
- `assets/mowa-logo.webp` — local copy of the logo served by the public MOWA website.
- `assets/mentorship-hero.png` — questionnaire landing-page artwork.

## Designed to play nice

This package does not assume it owns your GitHub or Supabase account.

- No build process or framework.
- No `package.json`.
- No repository or branch changes.
- No destructive SQL.
- One namespaced table: `mowa_direction_survey_responses`.
- Anonymous visitors may insert responses only; they cannot read responses through the public site.

## GitHub Pages setup

1. Create a new repository, such as `mowa-direction-questionnaire`.
2. Upload the **contents** of this folder to the repository root.
3. Open **Settings → Pages**.
4. Choose the `main` branch and root folder.
5. Save and open the Pages URL GitHub provides.

## Supabase setup

1. Create or deliberately select the Supabase project you want to use.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Open **Project Settings → API**.
5. Copy the project URL and anon public key.
6. Edit `js/config.js`:

```js
window.MOWA_SURVEY_CONFIG = {
  surveyVersion: "mowa-direction-survey-v4",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  tableName: "mowa_direction_survey_responses",
  allowLocalFallback: true,
  officialSiteUrl: "https://miowa.net/",
  bylawsUrl: "https://miowa.net/about-us/"
};
```

The public MOWA site does not appear to expose a full bylaws document. The landing page therefore links to MOWA’s public About page, which summarizes the organization’s bylaws and principles. Replace `bylawsUrl` when a direct approved bylaws link is available.

## How responses work

- Without Supabase configured, answers and submitted responses remain in that browser.
- With Supabase configured, submissions are also inserted into the namespaced table.
- The public questionnaire has no Supabase read access.
- Export data privately from Supabase, then load the JSON into `results.html`.

## Editing the questionnaire

Question wording and page grouping live in `js/questions.js`. Keep question IDs stable after launch so later exports remain compatible with the analyzer.

## Display behavior

The desktop and normal laptop layout is intentionally fixed to the browser window and does not use vertical or horizontal questionnaire scrolling. The revision was checked at 1440×900 and 1365×768. On narrow phone screens the layout permits normal page flow rather than clipping questions.

## Before public launch

1. Confirm approval to use the MOWA name, logo, and supplied artwork.
2. Replace the public bylaws/principles-summary link if MOWA provides a direct bylaws document.
3. Approve the introduction and privacy wording.
4. Configure and test Supabase in the intended project—not whichever project happens to be open.
5. Submit several test responses and confirm the private export/analyzer workflow.
6. Delete test rows before launch.
