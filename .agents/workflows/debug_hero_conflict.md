---
description: Debugging e Identificación del Conflicto de Hero Video
---
# Diagnóstico de Conflicto de Vercel/Supabase 'Hero' (Error E)

Este workflow documenta exactamente cómo verificar y resolver el famoso error `Unexpected token E` al subir o actualizar un video como "Hero". 

## Contexto del Problema
Cuando la plataforma intenta establecer un nuevo "Hero video" (`is_hero = true`), PostgreSQL exige que la restricción sea globalmente única debido al índice `idx_videos_is_hero_true`.
Sin embargo, políticas de RLS (Row Level Security) evitan que un usuario desactive el "hero" de videos subidos por *otros* usuarios empleando una query tradicional `.update({is_hero: false})`.

Si la consulta falla silenciosamente (RLS) y la base de datos no quita el "hero" anterior, la inserción del nuevo "hero" arroja el código de error `23505` (violación de índice único).
El navegador lee el error "Error creando video..." que inicia con 'E', lo cual rompe `JSON.parse` y lanza el temido `Unexpected token E en JSON`.

## Pasos para el diagnóstico y resolución

1. **Revisar los Logs de Vercel o de la API local**
   Asegúrate de examinar el body de la respuesta. Podría aparecer como texto plano `Error al crear el video...`.

2. **Verificar el Estado de Supabase (MCP)**
   Utilizar la herramienta `mcp_supabase-mcp-server_execute_sql` con la cuenta conectada (`qxyzxhhrdcdumhxsudhh`).
   Query a correr: `SELECT id, user_id, is_hero, title FROM public.videos WHERE is_hero = true;`
   Si ya existe un hero y su `user_id` no coincide con tu sesión actual, el update original fallaría via RLS.

3. **La Solución Implementada (Bypass RLS vía RPC)**
   Para evitar problemas de RLS global en features únicas (como el main hero), se creó la función en la base de datos:
   ```sql
   CREATE OR REPLACE FUNCTION unset_hero_videos() 
   RETURNS void AS $$ 
   BEGIN 
       UPDATE public.videos SET is_hero = false WHERE is_hero = true; 
   END; 
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

   Y las rutas (`app/api/videos/route.ts`, `app/api/videos/[id]/route.ts`, `app/api/videos/set-hero/route.ts`) deben usar siempre:
   `await supabase.rpc('unset_hero_videos');`

4. **Verificación**
   Intenta subir o editar un video nuevamente. Ahora la función Postgres, que se ejecuta como `SECURITY DEFINER` (rol elevado/bypassea RLS), limpiará globalmente el estado hero sin importar quién fue el autor anterior.

5. **Ajustar el Manejo de JSON**
   El código frontend `manage-video-dialog.tsx` y `video-actions.tsx` debe envolver siempre en un try-catch la conversión `await response.json()`, haciendo un fallback a `await response.text()` si no es JSON válido.
