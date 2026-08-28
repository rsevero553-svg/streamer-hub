# Streamer Hub

Plataforma educativa e informativa para orientar a streamers/usuarios sobre
aplicaciones de trabajo online. Stack: Vue 3 + TypeScript + Vite + Pinia + Supabase + PWA.

## Estado real frente a la especificación original (65 secciones)

### ✅ Completo
- Arquitectura, Design System, router, layout, PWA, motion 2.5D
- Auth (teléfono obligatorio), perfil, roles user/admin, RLS
- Apps mujeres/hombres + ficha (actividades, retiros, agencia, código copiable, tutor WhatsApp, Telegram, enlaces)
- Guías (generales y por app), Ser agente (contenido estático)
- Admin: CRUD de apps, banners, guías, y gestión completa por app (actividades/retiros/agencias/códigos/contactos/enlaces)
- Categorías dinámicas (`application_categories`) y campo `featured` — agregados en esta iteración
- Chatbot de ayuda tipo FAQ, botones flotantes, fondo dinámico animado

### ⚠️ Pendiente / incompleto (honestidad ante todo)
- **Sin panel admin para:** usuarios (consultar/activar/suspender/cambiar rol), redes sociales,
  configuración de textos del Home, políticas y FAQs — hoy son contenido estático en el código,
  no editable desde el admin como pide la sección 49 del prompt original.
- **Ficha de app simplificada:** campos como público objetivo detallado, edad mínima, países
  disponibles, sistema de puntos estructurado, `last_verified_at` — no existen como columnas
  separadas, solo como texto libre en `general_policy` / `withdrawal_policy`.
- **Sin recuperación de contraseña en la UI** (el servicio existe en `auth.service.ts`, falta la vista).
- **SEO básico:** sin meta tags dinámicos por página/app, sin Open Graph por aplicación.
- **Accesibilidad parcial:** aria-labels en botones flotantes, falta auditoría completa de teclado/contraste.
- **Iconos PWA son placeholder** — reemplazar `public/icons/icon-192.png` y `icon-512.png` con el logo real.
- **Responsive probado solo por CSS/breakpoints, no en dispositivos reales.**

## Configuración local
```bash
npm install
cp .env.example .env
npm run dev
```

## Base de datos (Supabase — proyecto "Rico")
Esquema completo aplicado vía migraciones (ver `supabase/migrations/`).
Para hacer admin a un usuario:
```sql
update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.com';
```
Cierra sesión y vuelve a entrar para que el rol se refresque en el cliente.

## Deploy
Desplegado en Render como Static Site, conectado a GitHub con auto-deploy.
Build: `npm install && npm run build` · Publish dir: `dist`.
