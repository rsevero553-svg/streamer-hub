alter table public.apps add column if not exists featured boolean not null default false;
create index if not exists apps_featured_idx on public.apps(featured);

create table if not exists public.application_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.apps add column if not exists category_id uuid references public.application_categories(id) on delete set null;
alter table public.application_categories enable row level security;

drop policy if exists categories_public_select on public.application_categories;
create policy categories_public_select on public.application_categories for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists categories_admin_all on public.application_categories;
create policy categories_admin_all on public.application_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
