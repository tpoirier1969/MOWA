-- MOWA Direction Survey v1
-- Safe-by-default Supabase setup: one namespaced table, anonymous INSERT only, no public SELECT.
-- Run this in the Supabase SQL editor for the project you choose.

create extension if not exists pgcrypto;

create table if not exists public.mowa_direction_survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  survey_version text not null default 'mowa-direction-survey-v1',
  respondent_type text,
  member_duration text,
  creator_types text[] default '{}',
  age_range text,
  gender text,
  payload jsonb not null,
  scores jsonb,
  source text not null default 'github-pages-static-site'
);

comment on table public.mowa_direction_survey_responses is
  'Standalone MOWA member and board direction survey responses. Do not use for other projects.';

alter table public.mowa_direction_survey_responses enable row level security;

drop policy if exists "mowa_direction_survey_insert_anon_v1" on public.mowa_direction_survey_responses;
create policy "mowa_direction_survey_insert_anon_v1"
  on public.mowa_direction_survey_responses
  for insert
  to anon
  with check (true);

-- Intentionally no SELECT policy. Public GitHub Pages visitors can submit, but cannot read responses.
-- To analyze results, export rows from Supabase Dashboard or run a private SQL query, then load JSON into results.html.

create index if not exists mowa_direction_survey_created_at_idx
  on public.mowa_direction_survey_responses (created_at desc);

create index if not exists mowa_direction_survey_payload_gin_idx
  on public.mowa_direction_survey_responses using gin (payload);

-- Helpful export query for Supabase SQL editor:
-- select created_at, respondent_type, member_duration, creator_types, age_range, gender, payload, scores
-- from public.mowa_direction_survey_responses
-- order by created_at desc;
