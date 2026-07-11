# Deployment Checklist

## GitHub

- [ ] New repository created, separate from other projects.
- [ ] Files uploaded to the repository root or a dedicated `/docs` folder.
- [ ] GitHub Pages enabled.
- [ ] Site loads on desktop.
- [ ] Site loads on mobile.
- [ ] `results.html` opens.

## Supabase

- [ ] Correct Supabase project selected. Do not reuse a project accidentally if you meant to isolate the survey.
- [ ] `supabase/schema.sql` reviewed.
- [ ] SQL run successfully.
- [ ] `js/config.js` updated with URL and anon key.
- [ ] Test response inserts into `mowa_direction_survey_responses`.
- [ ] Public SELECT remains disabled unless the board deliberately chooses otherwise.

## Content approval

- [ ] MOWA name approved for survey use.
- [ ] Intro language approved.
- [ ] Official logo/images approved.
- [ ] Privacy/anonymity statement approved.
- [ ] Board decides whether demographic questions are optional or removed.
- [ ] Board decides launch date and close date.

## Data analysis

- [ ] Export query tested in Supabase.
- [ ] Exported JSON loads in `results.html`.
- [ ] Gap summary CSV downloads correctly.
- [ ] Board agrees how to interpret gaps: 1.5+ = strategic gap, 2.0+ = major shortfall.
