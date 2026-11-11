# Arquitectura inicial

## Decisión principal

Monolito modular Next.js. Una aplicación, una base Supabase y backend TypeScript propio. Sin microservicios, n8n ni colas pagadas. El servidor renderiza el panel; componentes cliente solo cuando hay interacción. La pantalla inicial es pública y no consulta datos.

## Capas y estructura

```text
src/app/                 páginas, layouts y adaptadores HTTP
src/components/ui/       componentes shadcn/ui adaptados
src/lib/domain/          contratos compartidos mínimos
src/modules/             módulos de negocio al implementarlos
supabase/migrations/     SQL versionado, ejecución manual
supabase/tests/          matriz de validación de seguridad
docs/                    decisiones, plan y evidencias
```

Flujo futuro: HTTP/webhook → validación Zod → sesión o firma → servicio → autorización y reglas → repositorio/RPC transaccional → auditoría/outbox → respuesta. Ningún componente cliente importa secretos, repositorios o SDK de IA. Módulos: tenants, identity, scheduling, bookings, customers, commissions, daily-closings, agent, whatsapp, approvals, audit y jobs. No se crean implementaciones vacías por anticipado.

## Identidad y aislamiento

Supabase Auth y @supabase/ssr en Etapa 1: clientes separados de navegador/servidor, cookies y renovación de sesión. Verificar identidad con API de Auth; no confiar en cookies sin validar. Resolver membresía desde BD para cada operación. Una persona puede pertenecer a varios tenants; cada tenant representa un establecimiento independiente.

Roles owner/manager/barber en memberships; administrador de plataforma en tabla separada, no editable desde API. Superadmin no obtiene acceso indiscriminado a datos personales. La matriz exacta de permisos se implementará y probará en Etapa 1. En el borrador, owner/manager leen datos propios; barber lee servicios y su propia agenda/ficha; no lee fichas de clientes ni auditoría. Membresías se aprovisionan administrativamente hasta disponer de un flujo autorizado.

RLS activada en cada tabla, sin acceso anónimo ni políticas de escritura en el borrador. El helper de membresía usa SECURITY DEFINER con search_path vacío para evitar recursión; se limita EXECUTE a authenticated. La clave privilegiada omite RLS: reservar para tareas de sistema controladas. No se ha demostrado aislamiento hasta ejecutar la matriz de pruebas con JWT de distintos usuarios.

## Esquema y consistencia

tenants → memberships/barbers/services/customers/calendar_entries/audit_events. FK compuestas impiden asociar entidades de distintos tenants. calendar_entries unifica reservas y bloqueos: una restricción GiST excluye rangos superpuestos para el mismo tenant/barbero. Intervalos [inicio, fin) permiten atenciones adyacentes. Faltan horarios recurrentes, RPC de escritura, snapshots de precio/duración y auditoría atómica de cambios.

Instantes timestamptz (UTC en transporte), presentación y día operacional America/Santiago usando zona IANA; no fijar un desfase horario. Horarios semanales futuros serán hora local + zona; resolver cambios de horario explícitamente. CLP como entero, porcentajes de comisión futuros como puntos base, nunca floats para dinero.

El borrador inicia tenants pausados. Antes de habilitar escrituras, RPC transaccionales deberán validar tenant activo también para tareas automáticas. Sin escritura ni agente activos actualmente. Auditoría diseñada append-only para API: acción, actor, entidad, request_id y fecha; sin cuerpos de WhatsApp, teléfonos o secretos. Falta integrar inserción atómica en cada caso de uso.

## Integraciones y tareas futuras

WhatsApp: verificar firma HMAC sobre bytes crudos, resolver tenant mediante phone_number_id configurado por servidor, persistir evento con clave única proveedor/ID y procesar por trabajo durable. Outbox para envíos, reintentos limitados con backoff y revisión humana de errores. Nunca depender de trabajo en memoria después de devolver HTTP 200.

OpenRouter: modelo configurable y adaptadores texto/audio/imagen. El modelo propone herramientas; el servicio valida Zod, actor, tenant, reglas, disponibilidad y aprobación. No se envían credenciales ni contexto de otros tenants. Registrar latencia/resultado sin contenido sensible.

Jobs iniciales: tabla durable + handler TypeScript invocado por scheduler autenticado, reintentos e idempotencia. Contratos de trabajo independientes de transporte permiten adaptar Trigger.dev/n8n después. No se implementa aún.

Storage: buckets privados, rutas tenant_id/identificador, políticas y URLs firmadas cortas; no se crean buckets en esta etapa. Definir conservación, borrado, consentimiento, acceso y proveedores antes de almacenar material real. Revisión de normativa chilena aplicable pendiente; no se afirma cumplimiento legal con este diseño.

## Referencias técnicas consultadas

Avance de Etapa 1: cliente Supabase por solicitud en src/lib/supabase/server.ts; src/proxy.ts renueva cookies en rutas internas; identity/service.ts verifica getUser y membresía activa. /panel/[tenantId]/[section] consulta vistas de lectura bajo RLS y filtra cada consulta por tenant_id. La matriz permissions.ts se usa en servidor y navegación. Ningún acceso usa service_role. No se ha validado la integración contra una base configurada.

- https://nextjs.org/docs/app/getting-started/installation
- https://ui.shadcn.com/docs/installation/next
- https://ui.shadcn.com/docs/tailwind-v4
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/functions
- https://www.postgresql.org/docs/current/rangetypes.html
