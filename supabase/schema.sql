-- MOWA Direction Survey v5.2
-- Safe-by-default Supabase setup: one namespaced table, anonymous INSERT only, no public SELECT.
-- Run this in the Supabase SQL editor for the Supabase project you choose.

create extension if not exists pgcrypto;

create table if not exists public.mowa_direction_survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  survey_version text not null default 'mowa-direction-survey-v5.2',
  respondent_type text,
  member_duration text,
  creator_types text[] default '{}',
  age_range text,
  gender text,
  contact_provided boolean not null default false,
  payload jsonb not null,
  scores jsonb,
  source text not null default 'github-pages-static-site'
);

comment on table public.mowa_direction_survey_responses is
  'Standalone MOWA member and board direction survey responses. Do not use for other projects.';

-- These statements safely bring an earlier draft table forward without replacing it.
alter table public.mowa_direction_survey_responses
  add column if not exists contact_provided boolean not null default false;

alter table public.mowa_direction_survey_responses
  alter column survey_version set default 'mowa-direction-survey-v5.2';

alter table public.mowa_direction_survey_responses enable row level security;

drop policy if exists "mowa_direction_survey_insert_anon_v1" on public.mowa_direction_survey_responses;
drop policy if exists "mowa_direction_survey_insert_anon_v3" on public.mowa_direction_survey_responses;
drop policy if exists "mowa_direction_survey_insert_anon_v4" on public.mowa_direction_survey_responses;
drop policy if exists "mowa_direction_survey_insert_anon_v5" on public.mowa_direction_survey_responses;

create policy "mowa_direction_survey_insert_anon_v5"
  on public.mowa_direction_survey_responses
  for insert
  to anon
  with check (true);

-- Intentionally no SELECT policy. Public GitHub Pages visitors can submit but cannot read responses.
-- Export responses privately from the Supabase dashboard, then load the JSON into results.html.

create index if not exists mowa_direction_survey_created_at_idx
  on public.mowa_direction_survey_responses (created_at desc);

create index if not exists mowa_direction_survey_payload_gin_idx
  on public.mowa_direction_survey_responses using gin (payload);

-- Helpful private export query:
-- select created_at, respondent_type, member_duration, creator_types,
--        age_range, gender, contact_provided, payload, scores
-- from public.mowa_direction_survey_responses
-- order by created_at desc;
