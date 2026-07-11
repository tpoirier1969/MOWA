# MOWA Member Direction Questionnaire Site

A simple static website for a MOWA member/board direction questionnaire. It is designed for GitHub Pages and optional Supabase storage.

## What this includes

- `index.html` — official-looking landing page and full questionnaire.
- `results.html` — local/exported response analyzer with importance-versus-delivery gap scoring.
- `js/questions.js` — editable questionnaire content.
- `js/config.js` — optional Supabase configuration.
- `supabase/schema.sql` — safe-by-default Supabase table setup.
- `assets/` — fallback SVG artwork if the official MOWA logo URL cannot load.

The header and hero use the official MOWA logo from the public MOWA website. If you want the site to be fully self-contained, download that logo with permission and replace the external image URLs with a local file in `assets/`.

## Designed to play nice

This package does not assume it owns your GitHub account or Supabase account.

- No build process.
- No `package.json`.
- No root-level framework files.
- No shared table names.
- No destructive SQL.
- One namespaced Supabase table: `mowa_direction_survey_responses`.
- Anonymous users can insert responses only. They cannot read responses unless you intentionally add a SELECT policy later.

## GitHub Pages setup

1. Create a new repository, for example: `mowa-direction-questionnaire`.
2. Upload the contents of this folder to the repository.
3. In GitHub, go to **Settings → Pages**.
4. Set source to the `main` branch and root folder.
5. Save.
6. Open the Pages URL GitHub gives you.

## Supabase setup

1. Create or choose a Supabase project.
2. Go to **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Go to **Project Settings → API**.
5. Copy your Supabase project URL and anon public key.
6. Edit `js/config.js`:

```js
window.MOWA_SURVEY_CONFIG = {
  surveyVersion: "mowa-direction-survey-v3",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  tableName: "mowa_direction_survey_responses",
  allowLocalFallback: true,
  officialSiteUrl: "https://miowa.net/"
};
```

7. Commit the change.

## How responses work

- Without Supabase configured, responses save locally in the browser.
- With Supabase configured, responses save locally and insert into Supabase.
- The public site does **not** read all responses from Supabase. That is intentional.
- To analyze real results, export rows from Supabase and load the JSON into `results.html`.

## Editing the questionnaire

Most content lives in `js/questions.js`. Questions have IDs, labels, types, and options. Keep IDs stable once responses are collected, or older data will be harder to analyze.

Question types supported:

- `radio`
- `checkbox`
- `scale`
- `textarea`
- `text`
- `note`

## Before public launch

Do these before sending the link to members:

1. Confirm the official logo can be used in this context.
2. Have the board approve the intro language.
3. Confirm whether responses should be anonymous.
4. Decide who exports/analyzes Supabase data.
5. Test on phone and desktop.
6. Submit two or three test responses and delete them from Supabase before launch.

## Suggested board framing

This is not a referendum on any one change. It is a member-expectation tool. The main output is a gap analysis:

`Importance average - Delivery average = Strategic gap`

Large gaps show where members believe an area matters but MOWA may not be delivering strongly enough yet.
