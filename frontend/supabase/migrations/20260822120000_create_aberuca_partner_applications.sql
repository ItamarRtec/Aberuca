create table if not exists public.aberuca_partner_applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  ruc text not null,
  sector text not null,
  city text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  services text not null,
  created_at timestamptz not null default now(),
  constraint aberuca_partner_applications_ruc_format
    check (ruc ~ '^[0-9]{11}$'),
  constraint aberuca_partner_applications_email_format
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint aberuca_partner_applications_business_name_len
    check (char_length(trim(business_name)) >= 2),
  constraint aberuca_partner_applications_services_len
    check (char_length(trim(services)) >= 10)
);

comment on table public.aberuca_partner_applications is
  'Aberuca Interlinks founding partner applications from the Peru marketing site.';

create index if not exists aberuca_partner_applications_created_at_idx
  on public.aberuca_partner_applications (created_at desc);

alter table public.aberuca_partner_applications enable row level security;
alter table public.aberuca_partner_applications force row level security;

revoke all on table public.aberuca_partner_applications from anon, authenticated, public;

grant insert on table public.aberuca_partner_applications to anon;

create policy "anon_insert_aberuca_partner_applications"
  on public.aberuca_partner_applications
  for insert
  to anon
  with check (true);
