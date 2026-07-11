# Deployment Checklist

## GitHub

- [ ] Create or deliberately select the correct repository.
- [ ] Confirm this is not being placed into another project by accident.
- [ ] Upload the package contents to the repository root or an approved `/docs` folder.
- [ ] Enable GitHub Pages.
- [ ] Confirm the landing page, slide transitions, section navigation, and Back/Next controls work.
- [ ] Confirm no questionnaire screen scrolls at the target desktop/laptop sizes.
- [ ] Confirm `results.html` opens.

## Supabase

- [ ] Deliberately select the correct Supabase project.
- [ ] Review `supabase/schema.sql`.
- [ ] Run the SQL successfully.
- [ ] Add the project URL and anon key to `js/config.js`.
- [ ] Confirm a test response inserts into `mowa_direction_survey_responses`.
- [ ] Confirm optional contact fields are stored only when supplied.
- [ ] Keep public SELECT disabled.

## Content approval

- [ ] Approve use of the MOWA name and logo.
- [ ] Approve the multigenerational hero image.
- [ ] Approve the introduction and questionnaire wording.
- [ ] Obtain or approve the best available bylaws link.
- [ ] Approve the anonymity and optional-contact statement.
- [ ] Decide whether demographic questions remain included and optional.
- [ ] Decide the launch and closing dates.

## Data analysis

- [ ] Test the private Supabase export query.
- [ ] Confirm exported JSON loads in `results.html`.
- [ ] Confirm the summary CSV downloads.
- [ ] Agree in advance how aggregated results and written comments will be shared.
