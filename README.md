# MOWA Member & Board Direction Questionnaire

A self-contained static questionnaire site for the Michigan Outdoor Writers Association. It is designed for GitHub Pages and submits completed responses to one namespaced Supabase table.

## What this revision includes

- Two compact introductory screens that fit within a normal desktop or laptop browser window.
- The official MOWA logo stored locally.
- A multigenerational outdoor-communication hero image on the first screen.
- A visible but restrained left/right slide transition between screens.
- Single-column pages throughout. No two-column questionnaire layouts.
- Related questions grouped onto short pages rather than shown one at a time.
- Complete-sentence questions with compact 1–5 answer rows.
- Larger body text and question wording for an audience that may not be especially comfortable with web applications.
- Back and Next buttons centered directly below each page’s content.
- A compact section strip that wraps rather than scrolling sideways.
- Automatic draft saving in that browser on that computer.
- A resume option when a saved questionnaire is found.
- Optional name and email fields only for respondents who want follow-up or involvement opportunities.
- MOWA’s listed Excellence in Craft award categories displayed prominently.
- A Submit button only on the final page. There are no questionnaire Save or Export buttons.
- Supabase submission through one namespaced table: `mowa_direction_survey_responses`.
- `results.html` remains a separate private/local analysis utility and is not linked from the questionnaire.

## Main files

- `index.html` — questionnaire application shell.
- `css/app.css` — no-scroll layout, single-column pages, and slide-transition styling.
- `js/questions.js` — questionnaire wording, page groups, sections, and scales.
- `js/app.js` — screen rendering, navigation, automatic local draft saving, resume behavior, and Supabase submission.
- `js/config.js` — Supabase project settings.
- `supabase/schema.sql` — safe-by-default Supabase table and row-level-security setup.
- `assets/mowa-logo.webp` — local copy of the logo served by the public MOWA website.
- `assets/mentorship-hero.png` — landing-page artwork.
- `results.html` and `js/results.js` — optional private/local results analyzer.

## Designed to play nice

This package does not assume it owns your GitHub or Supabase account.

- No repository, branch, Pages setting, or Supabase project was changed while creating these files.
- No build process or framework.
- No `package.json`.
- No destructive SQL.
- One namespaced table only.
- Anonymous visitors may insert responses but cannot read responses through the public site.

## GitHub Pages setup

1. Create or deliberately select the repository intended for this questionnaire.
2. Upload the **contents** of this folder to the repository root, or to an approved `/docs` folder.
3. Open **Settings → Pages**.
4. Choose the intended branch and folder.
5. Save and open the Pages URL GitHub provides.

## Supabase setup

1. Create or deliberately select the Supabase project intended for this questionnaire.
2. Open **SQL Editor**.
3. Review and run `supabase/schema.sql`.
4. Open **Project Settings → API**.
5. Copy the project URL and anonymous public key.
6. Edit `js/config.js`:

```js
window.MOWA_SURVEY_CONFIG = {
  surveyVersion: "mowa-direction-survey-v5",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  tableName: "mowa_direction_survey_responses",
  officialSiteUrl: "https://miowa.net/",
  bylawsOrPrinciplesUrl: "https://miowa.net/about-us/"
};
```

The public MOWA site does not appear to expose a full bylaws document. The first screen therefore links to the public About page, which summarizes the organization’s bylaws and principles. Replace that link when an approved direct bylaws URL is available.

## How responses work

- Answers are automatically saved in `localStorage` in that browser on that computer.
- Returning through the same browser shows an option to continue the saved questionnaire.
- A successful final submission inserts the response into Supabase and clears the saved draft.
- If Supabase is not configured or submission fails, the response remains saved on that computer and the respondent is told it was not submitted.
- The public site has no Supabase read permission.

## Display behavior

The questionnaire was checked screen-by-screen without vertical or horizontal overflow at:

- 1366 × 768
- 1280 × 720
- 1024 × 768
- 640 × 800

The layout uses the available width but remains single-column. Browser zoom, unusually large accessibility text settings, or very short windows may still require additional adjustments before launch.

## Before public launch

1. Confirm approval to use the MOWA name, logo, and hero artwork.
2. Replace the public principles-summary link if MOWA provides a direct bylaws document.
3. Approve the introduction, questionnaire wording, and optional demographic questions.
4. Configure Supabase in the intended project—not whichever project happens to be open.
5. Submit several test responses and confirm they appear only in `mowa_direction_survey_responses`.
6. Test closing and reopening the questionnaire to confirm same-computer draft recovery.
7. Delete test rows before launch.
