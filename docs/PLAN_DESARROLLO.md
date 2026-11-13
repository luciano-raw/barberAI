# Plan de desarrollo

Cada etapa se divide en iteraciones revisables. No avanzar con datos reales hasta comprobar seguridad. El MVP excluye todas las funciones fuera del alcance del prompt.

| Etapa | Entregable | Dependencia y salida verificable |
| --- | --- | --- |
| 0 Inicialización | Next.js, configuración, documentación, UI mínima | lint, TypeScript y build; sin credenciales |
| 1 Fundamentos | SQL validado, Auth SSR, roles, RLS, auditoría | Supabase de desarrollo creado por humano; pruebas allow/deny y aislamiento |
| 2 Operación | Alta, pausa, equipo, servicios, clientes, horarios | permisos y formularios persistentes por tenant |
| 3 Reservas | Disponibilidad, crear, reagendar, cancelar | pruebas de concurrencia y transacciones auditadas |
| 4 WhatsApp | Simulador, webhook oficial y envío | primero simulador local, luego Meta manual; firma, duplicados y reintentos |
| 5 Agente | OpenRouter y herramientas controladas | casos determinísticos probados antes de conectar modelo |
| 6 Cierres | Atenciones, audios/fotos, comisiones | extracción revisable y cálculo determinístico |
| 7 Autonomía | Reglas, aprobaciones, resúmenes | cambios sensibles no ejecutables sin autorización |
| 8 Dashboard | Panel de plataforma y operación responsive | datos reales autorizados, estados vacío/carga/error |
| 9 Automatizaciones | Recordatorios y trabajos durables | scheduler autenticado, idempotencia y observabilidad |
| 10 Validación | E2E, seguridad, documentación y despliegue | validación humana y autorización de despliegue |

Los formularios mínimos se construyen con sus casos de uso en etapas 1–7. La etapa 8 consolida indicadores y experiencia; no posterga la validación operativa a una UI final.

## Próxima iteración concreta

Validar sesión y aislamiento en navegador. Aplicar manualmente la migración de administración en Supabase de desarrollo y comprobar alta con propietario, activación, pausa y auditoría. Luego implementar barberos, servicios y horarios para probar una reserva completa antes de conectar WhatsApp y OpenRouter. El orden de entrega semanal está en CHECKLIST_MVP.md.

## Intervención humana

- Crear repositorio privado GitHub y publicar código cuando corresponda.
- Crear Supabase de desarrollo y proporcionar URL/clave publicable en .env.local.
- Ejecutar SQL tras revisión; comunicar errores sin compartir secretos.
- Crear usuarios ficticios para probar roles y aislamiento.
- Meta/OpenRouter no bloquean esta etapa; configurarlos en sus etapas.
