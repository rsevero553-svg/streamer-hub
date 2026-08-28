-- ============================================================
-- STREAMER EDU HUB — SUPABASE MASTER SQL (migración inicial)
-- ============================================================
begin;

create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'gender_category') then
    create type public.gender_category as enum ('women', 'men');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_status') then
    create type public.app_status as enum ('active', 'inactive', 'pending');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'link_type') then
    create type public.link_type as enum ('android', 'ios', 'website', 'download', 'other');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'contact_type') then
    create type public.contact_type as enum ('whatsapp', 'telegram', 'email', 'other');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'banner_status') then
    create type public.banner_status as enum ('active', 'inactive');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  gender public.gender_category,
  role public.user_role not null default 'user',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_phone_not_empty check (length(trim(phone)) > 0)
);
create unique index if not exists profiles_phone_unique_idx on public.profiles(phone);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_gender_idx on public.profiles(gender);
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  gender public.gender_category not null,
  logo_url text,
  banner_url text,
  status public.app_status not null default 'active',
  agency_required boolean not null default false,
  withdrawal_type text,
  withdrawal_policy text,
  general_policy text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint apps_name_not_empty check (length(trim(name)) > 0),
  constraint apps_slug_not_empty check (length(trim(slug)) > 0)
);
create unique index if not exists apps_slug_unique_idx on public.apps(slug);
create index if not exists apps_gender_idx on public.apps(gender);
create index if not exists apps_status_idx on public.apps(status);
create index if not exists apps_sort_order_idx on public.apps(sort_order);
drop trigger if exists apps_updated_at on public.apps;
create trigger apps_updated_at before update on public.apps for each row execute function public.set_updated_at();

create table if not exists public.app_activities (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  name text not null,
  description text,
  reward_value numeric(14,2) not null default 0,
  reward_unit text not null default 'frijoles',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_name_not_empty check (length(trim(name)) > 0),
  constraint activity_reward_non_negative check (reward_value >= 0)
);
create index if not exists app_activities_app_idx on public.app_activities(app_id);
create index if not exists app_activities_active_idx on public.app_activities(is_active);
create index if not exists app_activities_sort_idx on public.app_activities(app_id, sort_order);
drop trigger if exists app_activities_updated_at on public.app_activities;
create trigger app_activities_updated_at before update on public.app_activities for each row execute function public.set_updated_at();

create table if not exists public.app_withdrawal_methods (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  name text not null,
  description text,
  minimum_amount numeric(14,2),
  maximum_amount numeric(14,2),
  frequency text,
  processing_time text,
  fee text,
  requirements text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint withdrawal_name_not_empty check (length(trim(name)) > 0),
  constraint withdrawal_min_non_negative check (minimum_amount is null or minimum_amount >= 0),
  constraint withdrawal_max_non_negative check (maximum_amount is null or maximum_amount >= 0)
);
create index if not exists withdrawal_methods_app_idx on public.app_withdrawal_methods(app_id);
create index if not exists withdrawal_methods_active_idx on public.app_withdrawal_methods(is_active);
drop trigger if exists withdrawal_methods_updated_at on public.app_withdrawal_methods;
create trigger withdrawal_methods_updated_at before update on public.app_withdrawal_methods for each row execute function public.set_updated_at();

create table if not exists public.app_agencies (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  name text not null,
  description text,
  requirements text,
  registration_instructions text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists app_agencies_app_idx on public.app_agencies(app_id);
drop trigger if exists app_agencies_updated_at on public.app_agencies;
create trigger app_agencies_updated_at before update on public.app_agencies for each row execute function public.set_updated_at();

create table if not exists public.app_agency_codes (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  agency_id uuid references public.app_agencies(id) on delete cascade,
  code text not null,
  description text,
  is_copyable boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agency_code_not_empty check (length(trim(code)) > 0)
);
create index if not exists agency_codes_app_idx on public.app_agency_codes(app_id);
create index if not exists agency_codes_active_idx on public.app_agency_codes(is_active);
drop trigger if exists agency_codes_updated_at on public.app_agency_codes;
create trigger agency_codes_updated_at before update on public.app_agency_codes for each row execute function public.set_updated_at();

create table if not exists public.app_contacts (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  type public.contact_type not null,
  title text not null,
  url text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_title_not_empty check (length(trim(title)) > 0),
  constraint contact_url_not_empty check (length(trim(url)) > 0)
);
create index if not exists app_contacts_app_idx on public.app_contacts(app_id);
create index if not exists app_contacts_type_idx on public.app_contacts(type);
drop trigger if exists app_contacts_updated_at on public.app_contacts;
create trigger app_contacts_updated_at before update on public.app_contacts for each row execute function public.set_updated_at();

create table if not exists public.app_links (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  type public.link_type not null,
  title text not null,
  url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_link_title_not_empty check (length(trim(title)) > 0),
  constraint app_link_url_not_empty check (length(trim(url)) > 0)
);
create index if not exists app_links_app_idx on public.app_links(app_id);
create index if not exists app_links_type_idx on public.app_links(type);
drop trigger if exists app_links_updated_at on public.app_links;
create trigger app_links_updated_at before update on public.app_links for each row execute function public.set_updated_at();

create table if not exists public.app_guides (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references public.apps(id) on delete cascade,
  title text not null,
  summary text,
  content text,
  cover_url text,
  telegram_url text,
  is_general boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guide_title_not_empty check (length(trim(title)) > 0)
);
create index if not exists app_guides_app_idx on public.app_guides(app_id);
create index if not exists app_guides_general_idx on public.app_guides(is_general);
create index if not exists app_guides_active_idx on public.app_guides(is_active);
drop trigger if exists app_guides_updated_at on public.app_guides;
create trigger app_guides_updated_at before update on public.app_guides for each row execute function public.set_updated_at();

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  app_id uuid not null references public.apps(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_unique unique(user_id, app_id)
);
create index if not exists favorites_user_idx on public.favorites(user_id);
create index if not exists favorites_app_idx on public.favorites(app_id);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text not null,
  link_url text,
  button_text text,
  status public.banner_status not null default 'active',
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists banners_status_idx on public.banners(status);
create index if not exists banners_sort_idx on public.banners(sort_order);
drop trigger if exists banners_updated_at on public.banners;
create trigger banners_updated_at before update on public.banners for each row execute function public.set_updated_at();

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text,
  url text not null,
  icon text,
  position text default 'left',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_platform_not_empty check (length(trim(platform)) > 0)
);
create index if not exists social_links_active_idx on public.social_links(is_active);
drop trigger if exists social_links_updated_at on public.social_links;
create trigger social_links_updated_at before update on public.social_links for each row execute function public.set_updated_at();

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null,
  setting_value text,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint platform_setting_key_unique unique(setting_key)
);
drop trigger if exists platform_settings_updated_at on public.platform_settings;
create trigger platform_settings_updated_at before update on public.platform_settings for each row execute function public.set_updated_at();

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_user_idx on public.audit_logs(user_id);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = check_user_id and role = 'admin' and is_active = true);
$$;
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'Usuario'), coalesce(new.raw_user_meta_data ->> 'phone', 'NO-CONFIGURADO'), new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.apps enable row level security;
alter table public.app_activities enable row level security;
alter table public.app_withdrawal_methods enable row level security;
alter table public.app_agencies enable row level security;
alter table public.app_agency_codes enable row level security;
alter table public.app_contacts enable row level security;
alter table public.app_links enable row level security;
alter table public.app_guides enable row level security;
alter table public.favorites enable row level security;
alter table public.banners enable row level security;
alter table public.social_links enable row level security;
alter table public.platform_settings enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists apps_public_select on public.apps;
create policy apps_public_select on public.apps for select to anon, authenticated using (status = 'active' or public.is_admin());
drop policy if exists apps_admin_insert on public.apps;
create policy apps_admin_insert on public.apps for insert to authenticated with check (public.is_admin());
drop policy if exists apps_admin_update on public.apps;
create policy apps_admin_update on public.apps for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists apps_admin_delete on public.apps;
create policy apps_admin_delete on public.apps for delete to authenticated using (public.is_admin());

drop policy if exists activities_public_select on public.app_activities;
create policy activities_public_select on public.app_activities for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists activities_admin_insert on public.app_activities;
create policy activities_admin_insert on public.app_activities for insert to authenticated with check (public.is_admin());
drop policy if exists activities_admin_update on public.app_activities;
create policy activities_admin_update on public.app_activities for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists activities_admin_delete on public.app_activities;
create policy activities_admin_delete on public.app_activities for delete to authenticated using (public.is_admin());

drop policy if exists withdrawals_public_select on public.app_withdrawal_methods;
create policy withdrawals_public_select on public.app_withdrawal_methods for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists withdrawals_admin_all on public.app_withdrawal_methods;
create policy withdrawals_admin_all on public.app_withdrawal_methods for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists agencies_public_select on public.app_agencies;
create policy agencies_public_select on public.app_agencies for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists agencies_admin_all on public.app_agencies;
create policy agencies_admin_all on public.app_agencies for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists agency_codes_public_select on public.app_agency_codes;
create policy agency_codes_public_select on public.app_agency_codes for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists agency_codes_admin_all on public.app_agency_codes;
create policy agency_codes_admin_all on public.app_agency_codes for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists contacts_public_select on public.app_contacts;
create policy contacts_public_select on public.app_contacts for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists contacts_admin_all on public.app_contacts;
create policy contacts_admin_all on public.app_contacts for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists links_public_select on public.app_links;
create policy links_public_select on public.app_links for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists links_admin_all on public.app_links;
create policy links_admin_all on public.app_links for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists guides_public_select on public.app_guides;
create policy guides_public_select on public.app_guides for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists guides_admin_all on public.app_guides;
create policy guides_admin_all on public.app_guides for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists favorites_select_own on public.favorites;
create policy favorites_select_own on public.favorites for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists favorites_insert_own on public.favorites;
create policy favorites_insert_own on public.favorites for insert to authenticated with check (user_id = auth.uid());
drop policy if exists favorites_delete_own on public.favorites;
create policy favorites_delete_own on public.favorites for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists banners_public_select on public.banners;
create policy banners_public_select on public.banners for select to anon, authenticated using (status = 'active' or public.is_admin());
drop policy if exists banners_admin_all on public.banners;
create policy banners_admin_all on public.banners for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists social_public_select on public.social_links;
create policy social_public_select on public.social_links for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists social_admin_all on public.social_links;
create policy social_admin_all on public.social_links for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_public_select on public.platform_settings;
create policy settings_public_select on public.platform_settings for select to anon, authenticated using (is_public = true or public.is_admin());
drop policy if exists settings_admin_all on public.platform_settings;
create policy settings_admin_all on public.platform_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists audit_admin_select on public.audit_logs;
create policy audit_admin_select on public.audit_logs for select to authenticated using (public.is_admin());
drop policy if exists audit_admin_insert on public.audit_logs;
create policy audit_admin_insert on public.audit_logs for insert to authenticated with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('app-assets', 'app-assets', true) on conflict (id) do update set public = excluded.public;
insert into storage.buckets (id, name, public) values ('banners', 'banners', true) on conflict (id) do update set public = excluded.public;

insert into public.platform_settings (setting_key, setting_value, description, is_public) values
('site_name', 'Streamer Edu', 'Nombre de la plataforma', true),
('site_description', 'Plataforma educativa e informativa para conocer aplicaciones de trabajo.', 'Descripción pública', true),
('hero_background_interval', '30000', 'Intervalo del cambio visual del fondo en milisegundos', true),
('pwa_enabled', 'true', 'Activa la instalación PWA', true)
on conflict (setting_key) do nothing;

commit;
