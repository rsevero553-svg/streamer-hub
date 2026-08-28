create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

drop policy if exists faqs_public_select on public.faqs;
create policy faqs_public_select on public.faqs for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists faqs_admin_all on public.faqs;
create policy faqs_admin_all on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop trigger if exists faqs_updated_at on public.faqs;
create trigger faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

insert into public.platform_settings (setting_key, setting_value, description, is_public) values
('policies_content', 'Streamer Hub es una plataforma educativa e informativa. No opera, controla ni es responsable del funcionamiento interno de las aplicaciones externas mencionadas.', 'Texto de la página de políticas', true)
on conflict (setting_key) do nothing;
