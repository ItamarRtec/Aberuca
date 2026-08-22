create table if not exists public.aberuca_contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  message text not null,
  region text not null default 'usa',
  created_at timestamptz not null default now(),
  constraint aberuca_contact_inquiries_name_len
    check (char_length(trim(name)) >= 2),
  constraint aberuca_contact_inquiries_email_format
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint aberuca_contact_inquiries_message_len
    check (char_length(trim(message)) >= 10),
  constraint aberuca_contact_inquiries_region_ok
    check (region in ('usa', 'latam', 'peru'))
);

comment on table public.aberuca_contact_inquiries is
  'Aberuca USA contact form submissions from the marketing site.';

create index if not exists aberuca_contact_inquiries_created_at_idx
  on public.aberuca_contact_inquiries (created_at desc);

alter table public.aberuca_contact_inquiries enable row level security;
alter table public.aberuca_contact_inquiries force row level security;

revoke all on table public.aberuca_contact_inquiries from anon, authenticated, public;

grant insert on table public.aberuca_contact_inquiries to anon;

create policy "anon_insert_aberuca_contact_inquiries"
  on public.aberuca_contact_inquiries
  for insert
  to anon
  with check (true);
