# Deployment Checklist

## GitHub

- [ ] Create or deliberately select the correct repository.
- [ ] Confirm this package is not being placed into another project by accident.
- [ ] Upload the package contents to the repository root or an approved `/docs` folder.
- [ ] Enable GitHub Pages from the intended branch and folder.
- [ ] Confirm the logo and hero image load from the local `assets` folder.
- [ ] Confirm the page visibly slides left when moving forward and right when moving backward.
- [ ] Confirm Back and Next buttons appear centered beneath the page content.
- [ ] Confirm the section strip wraps and never scrolls sideways.
- [ ] Confirm no questionnaire page scrolls at 1024×768 or larger under normal browser zoom.

## Supabase

- [ ] Deliberately select the correct Supabase project.
- [ ] Review `supabase/schema.sql` before running it.
- [ ] Run the SQL successfully.
- [ ] Add only that project’s URL and anonymous key to `js/config.js`.
- [ ] Confirm a test response inserts into `mowa_direction_survey_responses`.
- [ ] Confirm no other tables are changed.
- [ ] Confirm optional contact information is stored only when supplied.
- [ ] Keep public SELECT disabled.
- [ ] Confirm a failed submission leaves the draft saved in the browser.

## Browser behavior

- [ ] Begin a questionnaire, answer several questions, close the browser tab, and return through the same browser.
- [ ] Confirm the first page offers to continue the saved questionnaire.
- [ ] Confirm “Start over” clears only this questionnaire’s local draft.
- [ ] Confirm a successful submission clears the local draft.
- [ ] Test at 1366×768, 1024×768, 390×844, and 360×640.
- [ ] On phones, confirm long pages scroll only inside the content area and Back/Next remain fixed and visible.
- [ ] Confirm there is no horizontal scrolling at phone widths.

## Content approval

- [ ] Approve use of the MOWA name and logo.
- [ ] Approve the multigenerational hero image.
- [ ] Approve the introduction and questionnaire wording.
- [ ] Approve the optional questions about outlets, publications/programs/channels, direct sales, and outdoor-related businesses.
- [ ] Obtain or approve the best available bylaws link.
- [ ] Approve the automatic-save and optional-contact wording.
- [ ] Decide whether optional age and gender questions remain included.
- [ ] Decide the launch and closing dates.

## Data review

- [ ] Test a private Supabase export query.
- [ ] Confirm exported response data works with the private `results.html` analyzer if that tool will be used.
- [ ] Agree in advance how aggregated scores and written comments will be shared.
