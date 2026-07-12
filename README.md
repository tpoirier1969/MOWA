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
- Back and Next buttons centered in the same fixed location beneath the content on every screen.
- A compact section strip on desktop and a simpler current-section label on phones.
- Automatic draft saving in that browser on that computer.
- A resume option when a saved questionnaire is found.
- Optional name and email fields only for respondents who want follow-up or involvement opportunities.
- MOWA’s listed Excellence in Craft award categories displayed prominently.
- A new “Where Your Work Reaches People” section covering media outlets, named publications/programs/channels, independent publishing, client/employer work, direct sales, and outdoor-related businesses.
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
- `docs/mowa-bylaws-revised-2026.pdf` — the approved bylaws supplied for this questionnaire, linked from the first screen.
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
  surveyVersion: "mowa-direction-survey-v5.5",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  tableName: "mowa_direction_survey_responses",
  officialSiteUrl: "https://miowa.net/",
  bylawsOrPrinciplesUrl: "docs/mowa-bylaws-revised-2026.pdf"
};
```

The package includes the bylaws supplied for this project at `docs/mowa-bylaws-revised-2026.pdf`. The first screen links directly to that local copy, so the link will continue to work when the site is hosted on GitHub Pages.

## How responses work

- Answers are automatically saved in `localStorage` in that browser on that computer.
- Returning through the same browser shows an option to continue the saved questionnaire.
- A successful final submission inserts the response into Supabase and clears the saved draft.
- If Supabase is not configured or submission fails, the response remains saved on that computer and the respondent is told it was not submitted.
- The public site has no Supabase read permission.

## Display behavior

The questionnaire was checked screen-by-screen at **1024 × 768** with no page or document scrolling. Pages within a section were combined where the combined content still fit cleanly at that size.

The phone layout was checked at **390 × 844** and **360 × 640**. It remains single-column with no horizontal overflow. On shorter phone screens, only the content area scrolls when needed; the section label and Back/Next controls remain in place.

Browser zoom, unusually large accessibility text settings, or exceptionally short windows may require additional scrolling.

## Before public launch

1. Confirm approval to use the MOWA name, logo, and hero artwork.
3. Approve the introduction, questionnaire wording, and optional demographic questions.
4. Configure Supabase in the intended project—not whichever project happens to be open.
5. Submit several test responses and confirm they appear only in `mowa_direction_survey_responses`.
6. Test closing and reopening the questionnaire to confirm same-computer draft recovery.
7. Delete test rows before launch.

## Revision 5.4 notes

- Adds the full MOWA bylaws revised June 12, 2026 as a locally hosted PDF linked from the first screen.
- Replaces the older public-summary wording with the three stated goals and freedom-of-expression principle from Section 2 of the bylaws.
- Adds a “Where Your Work Reaches People” section covering magazines, newspapers, books, broadcast, web, podcasting, video, social media, employer/client work, direct sales, and outdoor-related businesses.
- Adds optional fields for naming specific publications, programs, channels, organizations, or businesses.
- Combines related pages where the combined page fits without scrolling at 1024 × 768.
- Keeps Back and Next controls in a consistent centered position beneath the main content on every screen.
- Adds a true phone layout with fixed navigation and internal content scrolling only when necessary.



## v5.5 fixes

- Adds a persistent Bylaws link in the header. The included PDF opens in a new browser tab.
- Replaces the earlier transition logic with a guarded left/right page animation that always removes the outgoing page.
- Makes every questionnaire screen fully opaque so pages cannot show through one another.
- Cleans up stale screens before each transition and blocks rapid repeat navigation while a transition is running.
- Adds restrained brook-trout green, orange, gold, and red accents drawn from the MOWA logo.
