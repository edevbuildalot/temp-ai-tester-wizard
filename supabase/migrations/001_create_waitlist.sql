-- Create waitlist table for email capture
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Enable row-level security
alter table public.waitlist enable row level security;

-- Only allow inserts from the anon key
create policy "Anyone can insert into waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Only authenticated users can view
create policy "Authenticated users can view waitlist"
  on public.waitlist
  for select
  to authenticated
  using (true);