# Supabase: preparación manual

Clientes SSR, login/logout y panel de consulta implementados, pendientes de prueba conectada. No usamos Prisma: DATABASE_URL/DIRECT_URL son conexiones PostgreSQL; no sustituyen URL HTTP y clave publicable de Supabase Auth/Data API.

1. Crea un proyecto de **desarrollo** en Supabase, considerando plan gratuito y región disponible adecuada. Guarda la contraseña de BD fuera del repositorio.
2. Copia .env.example a .env.local. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY desde la configuración del proyecto. No pegues credenciales en el chat ni Git.
3. La clave service_role es privilegiada y no es necesaria para abrir la aplicación. Déjala vacía hasta implementar una operación de sistema autorizada.
4. Revisa supabase/migrations/202611100001_foundation.sql. Es un borrador transaccional, no idempotente: ejecutarlo una sola vez desde SQL Editor en una base de desarrollo vacía. No ejecutar en producción. Si falla, conserva el error para corregir el archivo antes de repetir. No borrar tablas para reintentarlo.
5. Esta migración crea tablas, FK, exclusión de reservas y RLS de lectura. No crea usuarios, membresías, datos de ejemplo, buckets ni flujos de login. Todas las escrituras de anon/authenticated están revocadas deliberadamente.
6. Configura Auth con Site URL http://localhost:3000. Login correo/contraseña sin OAuth ni callback. Crea un usuario ficticio desde Authentication > Users; no hay registro público. Prueba /ingresar con credenciales válidas e inválidas.
7. Ejecutar la matriz supabase/tests/README.md con tokens de usuarios reales de prueba. El SQL Editor no demuestra aislamiento RLS.

No habilitar escrituras desde frontend o usar service_role para sortear permisos. Las operaciones deben implementarse con autorización y auditoría transaccional. Al pausar un tenant, el backend deberá denegar acciones automáticas; pendiente de implementación.

Storage se habilitará cuando exista política de rutas, acceso y retención para audio/fotos. No crear buckets públicos.

## Primer acceso de desarrollo

Estado confirmado por propietario: migración inicial ejecutada correctamente. No repetirla. DATABASE_URL y DIRECT_URL guardadas únicamente en .env.local por solicitud del propietario, sin probar conexiones directas ni ejecutar SQL remoto. No se usan en el flujo actual de autenticación.

### Usuarios para validar el MVP

Crear seis usuarios ficticios en Authentication > Users, cada uno con correo único y contraseña propia:

| Usuario | Asignación futura | Validación |
| --- | --- | --- |
| Administrador de plataforma | platform_admins | Alta/pausa e integraciones de establecimientos; panel pendiente |
| Propietario A | owner, barbería A | Gestión y aprobaciones autorizadas de su barbería |
| Encargado A | manager, barbería A | Permisos delegados; no adquiere permisos de plataforma |
| Barbero A | barber, barbería A | Solo funciones asignadas y agenda propia |
| Propietario B | owner, barbería B | Aislamiento entre establecimientos |
| Sin membresía | Ninguna | Login válido sin acceso a datos de barberías |

Crear usuarios en Auth no asigna roles automáticamente. Con sus UUID se prepara el SQL de asignaciones, sin compartir contraseñas. La membresía inactiva se prueba desactivando temporalmente una membresía de prueba; no exige otro usuario. Clientes finales y agente no necesitan cuentas de usuario web. Preferencias/reglas operativas pertenecen al propietario; el administrador de plataforma configura aspectos técnicos e integraciones.

### Cuentas ya aprovisionadas

Con autorización explícita se crearon las seis cuentas, dos tenants pausados y una ficha de barbero mediante la API administrativa, sin migraciones nuevas. Correos, UUID y contraseñas aleatorias están exclusivamente en `.local/test-accounts.json`, ignorado por Git. No copiar ese archivo a documentación ni commits. Administrador de plataforma no tiene membresía de barbería; su panel todavía está pendiente.

Scripts manuales (no se ejecutan al iniciar Next.js):

- `node scripts/setup-test-users.mjs`: aprovisionamiento reanudable con clave secreta local. No modifica cuentas ajenas a su conjunto de pruebas ni restablece contraseñas existentes. No borrar el archivo local antes de repetirlo.
- `node scripts/verify-test-access.mjs`: login/getUser/logout y lectura de tenants con clave publicable + JWT de cada usuario. Verifica propietario A/B, encargado, barbero y usuarios sin acceso. No sustituye pruebas completas de RLS.

La aplicación sigue usando únicamente clave publicable y JWT para consultas de usuarios. SUPABASE_SECRET_KEY es exclusiva del script administrativo; no se importa en el panel.

Después de la migración, crea el usuario de prueba en Auth y copia su UUID. Revisa este bloque y sustituye el UUID por el del usuario correcto antes de ejecutarlo manualmente:

```sql
begin;
with new_tenant as (
  insert into public.tenants (name) values ('Barbería de prueba') returning id
)
insert into public.memberships (tenant_id, user_id, role)
select id, 'REEMPLAZAR_POR_UUID_DEL_USUARIO'::uuid, 'owner'::public.member_role
from new_tenant;
commit;
```

Queda pausada y vacía. No repitas el bloque sin revisar si ya existe la barbería. No es un flujo de alta de producción.

No compartas contraseñas ni tokens; rota cualquiera que se haya compartido. La contraseña Postgres no se necesita para este acceso. Contrasta la URL local preparada desde tu referencia con Connect.

## Administración de barberías

Aplica manualmente `supabase/migrations/202611120001_platform_management.sql` una vez en Supabase de desarrollo después de la migración inicial. Ingresa como administrador de plataforma y abre **Administrar barberías**. Para crear una barbería usa el UUID de un propietario de prueba que ya exista en Authentication > Users.

Comprueba que nace pausada, que su propietario la ve, y que se puede activar y volver a pausar. En Actividad del propietario comprueba los eventos de alta y cambio de estado. Con dueño y usuario sin membresía comprueba que /panel/administracion devuelve acceso denegado (404). Verifica también que las RPC rechazan el acceso con el JWT de esos usuarios. Un UUID inexistente debe rechazar el alta sin dejar una barbería huérfana.
