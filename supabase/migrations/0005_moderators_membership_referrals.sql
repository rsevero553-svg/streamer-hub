-- Ejecutar en dos pasos porque Postgres exige confirmar el nuevo valor de enum primero:
-- PASO 1:
-- alter type public.user_role add value if not exists 'moderator';
-- (aplicado por separado en producción — ver notas del proyecto)

-- PASO 2: resto del esquema (agencias, membresías, referidos, verificación, retiro estructurado,
-- conversión de moneda, fuentes de ingreso). Ver migración completa aplicada vía Supabase MCP
-- en esta conversación — reproducirla requiere ejecutar el PASO 1 primero y confirmarlo
-- (commit) antes de ejecutar el resto en una transacción separada.
