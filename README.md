# Streamer Hub

Plataforma educativa e informativa para orientar a streamers/usuarios sobre
aplicaciones de trabajo online (mensajería, videollamadas, match), con guías,
sistema de agencias, tutores de WhatsApp y canales de Telegram.

**Stack:** Vue 3 + TypeScript + Vite + Vue Router + Pinia + Supabase + PWA.

## 1. Configuración local

```bash
npm install
cp .env.example .env
# Edita .env con tu VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

## 2. Base de datos (Supabase)

El proyecto Supabase **Rico** ya tiene aplicado el esquema completo:
18 tablas, RLS, funciones (`is_admin`, `handle_new_user`), triggers de
`updated_at`, y buckets de storage (`app-assets`, `banners`).

Para crear tu primer usuario administrador, después de registrarte desde
la app, ejecuta en el SQL Editor de Supabase:

```sql
update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.com';
```

## 3. Publicar el código (GitHub, GitLab o Bitbucket)

Render necesita un repositorio Git para desplegar. Pasos:

```bash
cd streamer-hub
git init
git add .
git commit -m "Initial commit: Streamer Hub"
git branch -M main
git remote add origin <URL-DE-TU-REPOSITORIO-VACIO>
git push -u origin main
```

Crea antes un repositorio vacío en https://github.com/new (u otro proveedor).

## 4. Desplegar en Render

Una vez el código esté en el repositorio, indícame la URL del repo y lo
despliego directamente como **Static Site** en Render (build: `npm install && npm run build`,
carpeta publicada: `dist`). Deberás además configurar las variables de entorno
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el servicio de Render.

## 5. Estado del proyecto

Fases completadas de la especificación original:
- ✅ Configuración base, Design System, Router, Layout global
- ✅ Supabase client + servicios + tipos TypeScript
- ✅ Home (fondo dinámico, banners, destacadas, cómo funciona)
- ✅ Apps para mujeres / hombres + ficha de detalle completa
- ✅ Guías (lista + detalle)
- ✅ Ser agente
- ✅ Auth (registro con teléfono obligatorio, login, perfil)
- ✅ PWA (manifest + service worker vía vite-plugin-pwa)
- ✅ Chatbot de ayuda (FAQ) + botones flotantes
- ✅ Panel admin (dashboard, CRUD de apps, banners, guías)
- ✅ RLS y roles (user/admin)
- ⏳ Pendiente para siguientes iteraciones: CRUD admin de actividades/retiros/
  agencias/tutores por app, verificación de build en CI, iconos PWA definitivos
  (los actuales son placeholder), tests responsive exhaustivos en dispositivos reales.

**Nota sobre estética:** se implementó un sistema de motion 2.5D (tilt-on-hover,
parpadeo de fondo degradado animado, fade-up, glow) con CSS puro — sin Three.js,
como se acordó, para mantener el proyecto ligero y rápido.
