alter table public.apps add column if not exists target_audience text;
alter table public.apps add column if not exists minimum_age integer;
alter table public.apps add column if not exists available_countries text[];
alter table public.apps add column if not exists points_system text;
alter table public.apps add column if not exists last_verified_at timestamptz;
alter table public.apps add constraint apps_minimum_age_valid check (minimum_age is null or minimum_age >= 0);

insert into public.platform_settings (setting_key, setting_value, description, is_public) values
('agent_benefits', 'Acompaña y capacita a nuevos usuarios en las aplicaciones.
Genera ingresos adicionales gestionando tu propia red.
Acceso a materiales y guías exclusivas para agentes.', 'Beneficios de ser agente (uno por línea)', true),
('agent_requirements', 'Ser mayor de edad.
Tener disponibilidad para orientar a otras personas.
Conocer al menos una aplicación a fondo.', 'Requisitos para ser agente (uno por línea)', true)
on conflict (setting_key) do nothing;
