# Checklist MVP

Cada casilla exige el criterio indicado. Diseño SQL y pantalla inicial no equivalen a funcionalidades de negocio comprobadas.

## Etapa 0 · Entregables iniciales

- [x] UI-01 Retirar pantalla de preparación: / redirige al ingreso y el título deja de mostrar “Base del proyecto”.

- [x] E0-01 Inspección: carpeta inicialmente vacía, sin proyecto ni Git existente.
- [x] E0-02 Base Next.js: App Router, React, TypeScript strict, Tailwind v4, ESLint y configuración shadcn/ui con Button accesible presentes.
- [x] E0-03 Documentación: README, AGENTS, arquitectura, plan, checklist y guías de configuración creados.
- [x] E0-04 Variables: .env.example sin secretos y .env* ignorados salvo ejemplo.
- [x] E0-05 UI mínima: página es-CL responsive, sin consultas externas ni métricas ficticias.
- [x] E0-06 Preparación SQL: migración versionada con esquema inicial y RLS; no ejecutada.
- [x] E0-07 Verificación: lint, typecheck y build terminan con código 0; evidencia y limitaciones en VALIDACION.md.
- [x] E0-08 Git local: repositorio inicializado en main, sin commits ni remoto; .env.local ignorado.
- [ ] E0-09 GitHub: propietario crea remoto privado, revisa identidad y conecta/publica el código sin secretos.
  Primer commit a83b72b publicado correctamente en origin/main; identidad Git configurada y archivos privados excluidos. Privacidad del repositorio pendiente de confirmar en GitHub.

## A · Fundamentos, autenticación y seguridad

- [ ] A-01 Esquema: migración ejecutada en desarrollo, constraints e índices inspeccionados sin errores.
  Propietario confirma ejecución correcta del SQL inicial. Falta inspeccionar constraints/índices y probar RLS; no volver a ejecutar la migración inicial.
- [ ] A-02 Auth SSR: login, logout, renovación de sesión y rutas protegidas comprobados con @supabase/ssr.
  Código preparado: login, acciones, proxy de cookies y getUser. Falta prueba integrada con Auth configurado.
- [ ] A-03 Contexto tenant: usuario verificado y membresía actual en cada operación; manipular tenant enviado no concede acceso.
- [ ] A-04 Roles: matriz owner/manager/barber/superadmin probada; no autoelevación ni acceso técnico indiscriminado.
- [ ] A-05 RLS: pruebas automatizadas SELECT/INSERT/UPDATE/DELETE con anon, sin membresía, inactivo y usuarios de dos tenants pasan.
- [ ] A-06 Auditoría: operaciones humanas/agente/sistema insertan eventos atómicamente; usuarios no alteran ni borran historial.
- [ ] A-07 Pausa: jobs, herramientas y nuevas operaciones automáticas rechazan tenant pausado/archivado con prueba.
- [ ] A-08 Secretos: claves privadas solo servidor; build cliente y logs sin secretos.
- [ ] A-09 Datos personales: política revisada de acceso, retención, eliminación, consentimiento y proveedores; solicitudes de borrado probadas según normativa aplicable.
- [ ] A-10 Storage: buckets privados, políticas por tenant y URLs temporales probadas entre tenants.

## G · Alta y configuración

- [ ] G-01 Alta: superadmin crea barbería con responsable, datos y estado; otro rol no puede hacerlo.
- [ ] G-02 Equipo: invitación/membresía y alta/baja de barberos persisten y respetan permisos.
- [ ] G-03 Servicios: nombre, precio CLP, duración y estado validados y persistidos.
- [ ] G-04 Horarios: semanales y excepciones por barbero guardados con zona America/Santiago.
- [ ] G-05 Configuración: comisiones, agente e integraciones configurables por tenant sin exponer claves.
- [ ] G-06 Estados: pausar/reactivar/archivar preserva información y queda auditado.

## C · Clientes y agenda

- [ ] C-01 Clientes: fichas por teléfono normalizado, deduplicación dentro de tenant e historial autorizado.
- [ ] C-02 Agenda: vista por barbero y fecha con datos persistidos y límites de rol.
- [ ] C-03 Bloqueos: crear/quitar bloqueo valida permisos e impide cruce con reserva concurrente.
- [ ] C-04 Disponibilidad: servicio, duración, horarios, excepciones y DST determinan intervalos válidos sin inventarlos.
- [ ] C-05 Reservas: crear transaccionalmente con precio/duración registrados y auditoría; dos solicitudes concurrentes no se superponen.
- [ ] C-06 Cambios: reagendar/cancelar validan identidad y reglas, conservan historial y son idempotentes.

## B · WhatsApp y agente

- [ ] B-01 Simulador: conversaciones locales ejercitan los mismos servicios sin Meta ni créditos.
- [ ] B-02 Verificación: GET devuelve challenge solo con verify token válido.
- [ ] B-03 Firma: POST rechaza firma incorrecta antes de parsear/procesar; pruebas sobre cuerpo crudo.
- [ ] B-04 Recepción: Phone Number ID resuelve tenant y remitente; tenant desconocido o pausado no opera.
- [ ] B-05 Duplicados: persistencia durable y clave única evitan reprocesamiento incluso tras reinicio.
- [ ] B-06 Envío: Cloud API oficial configurable, errores tipados, timeouts y reintentos limitados sin duplicación.
- [ ] B-07 OpenRouter: modelo y credenciales configurables en servidor, límites y latencia/resultados observables.
- [ ] B-08 Herramientas: disponibilidad, crear/reagendar/cancelar, cliente, atención, cierre, reglas y solicitud de aprobación validan Zod, permisos y tenant.
- [ ] B-09 Conversación: ambigüedad pide aclaración; transferencia humana persiste estado y detiene automatismo donde corresponda.
- [ ] B-10 Veracidad: respuestas usan resultados confirmados del backend, sin inventar precios, horarios o éxito.
- [ ] B-11 Confirmaciones: mensajes posteriores al commit confirman operación correcta; errores no declaran éxito.

## D · Cierres y comisiones

- [ ] D-01 Medios: descarga segura de audios/fotos con límites, tipos permitidos y Storage privado.
- [ ] D-02 Adaptadores: transcripción/visión independientes con salida Zod y modelo configurable.
- [ ] D-03 Extracción: información ambigua queda pendiente de validación antes de persistir cobros.
- [ ] D-04 Atenciones: servicio/barbero/cobro declarado se registran una vez, autorizados y auditados.
- [ ] D-05 Cierre: preparar/confirmar cierre diario por fecha local, con prevención de duplicados.
- [ ] D-06 Comisiones: cálculo determinístico versionado probado con redondeos CLP y reglas por barbero.
- [ ] D-07 Resumen: propietario recibe totales comprobables de cierres y comisiones, sin afirmar conciliación bancaria.

## E · Autonomía y decisiones

- [ ] E-01 Reglas: configuración por tenant validada, versionada y aplicada en servidor.
- [ ] E-02 Aprobaciones: bandeja persistida con actor solicitante, operación propuesta, vencimiento y estado.
- [ ] E-03 Resolución: aprobar/rechazar verifica sesión, rol, tenant y estado; doble aprobación concurrente solo ejecuta una vez.
- [ ] E-04 Operaciones sensibles: dinero, precios y mensajes masivos nunca se ejecutan sin aprobación autorizada.
- [ ] E-05 Métricas: conteos reproducibles de autonomía/intervención y resúmenes basados en eventos reales.

## F · Panel web

- [ ] F-01 Plataforma: listado/alta/estados/responsables/configuración con autorización real.
- [ ] F-02 Operación: navegación dashboard, agenda, clientes, equipo, servicios, cierres, comisiones, decisiones, reglas y actividad con datos reales del tenant.
  Vistas de consulta preparadas para resumen, agenda en tabla, clientes, equipo, servicios y actividad. Sin escrituras, cierres ni aprobaciones; pendiente prueba contra BD.
- [ ] F-03 Experiencia: móvil/escritorio, teclado y estados carga/vacío/error comprobados; formularios accesibles.
- [ ] F-04 Acciones críticas: confirmación y mensajes de resultado reales; barberos limitados por servidor.

## Automatizaciones y validación final

- [ ] J-01 Trabajos: cola durable sencilla, ejecución autenticada, bloqueo/claim, backoff y fallos recuperables probados.
- [ ] J-02 Recordatorios: selección por zona local y reglas vigentes de WhatsApp; idempotencia y cancelación/reagenda actualizan envío.
- [ ] V-01 Integrales: reserva/cambio/cancelación/cierre/aprobación pasan de extremo a extremo.
- [ ] V-02 Seguridad: aislamiento, firma, idempotencia, concurrencia y permisos negativos probados automáticamente.
- [ ] V-03 Observabilidad: errores, request_id, duración y resultados sin secretos ni PII innecesaria.
- [ ] V-04 Entrega: documentación actualizada, respaldos/recuperación y despliegue autorizados; validación humana registrada.

## Bloqueos e intervención humana

- Supabase configurado. Seis usuarios ficticios creados, dos tenants pausados y roles asignados con autorización del propietario. Login/logout e aislamiento de lectura de tenants comprobados por API con JWT de cada cuenta. Pendientes pruebas SSR/navegador y matriz completa RLS.
- Primer commit publicado en main de https://github.com/luciano-raw/barberAI.git. Push autorizado y correcto; privacidad pendiente de confirmar en GitHub.
- Meta y OpenRouter pendientes en etapas posteriores; no necesarios ahora.
- Revisión de tratamiento de datos personales y retención pendiente antes de cargar datos reales.

## Orden de entrega según propuesta aprobada

- [x] Fundamentos iniciales: esquema aplicado, cuentas de prueba y lectura aislada comprobada por API.
- [ ] Cerrar semana 1: verificar inicio/cierre de sesión en navegador y acceso denegado a la barbería ajena. Completar matriz de permisos.
- [ ] Semana 2, primer corte: aplicar migración de administración y comprobar alta con propietario, activación, pausa y auditoría. Código preparado en /panel/administracion.
  - [x] Migración de administración aplicada en Supabase, según confirmó el propietario.
  - [x] Listado de las barberías de prueba A y B confirmado en Vercel desde el panel de administración.
  - [x] Alta con propietario existente comprobada en Vercel: C se creó pausada. El dueño A ve A y C en su listado, mientras B queda fuera.
  - [x] Activación, pausa y eventos de auditoría de C confirmados por el propietario en Vercel.
  - [ ] Verificar denegación con cuenta de dueño en /panel/administracion y en las RPC de administración.
  - [ ] Validar en Vercel las etiquetas de Actividad y la página 404 en español.
  - [ ] Revisar privacidad antes del piloto: evitar datos personales en rutas y logs, verificar aislamiento con una ruta ajena y acordar retención y eliminación de datos.
- [ ] Semana 2, segundo corte: alta de barberos y servicios, configuración de horarios y clientes de una barbería.
- [ ] Semana 2, tercer corte: crear, reagendar y cancelar una reserva desde el panel, con prueba de solapamiento concurrente.
- [ ] Semana 3: conectar el flujo de reservas con WhatsApp y agente.
- [ ] Semanas 4–6: cierres y comisiones, autonomía y aprobaciones, recordatorios y piloto.

El desarrollo sigue en el repositorio y Supabase actuales con datos de prueba. Cuando el cliente entregue sus accesos, transferir código e historial, aplicar migraciones al Supabase de destino, configurar variables y dominio en el hosting de destino y verificar Auth/RLS allí. Coordinar qué datos se transfieren antes del corte.
- [ ] Después de validar Supabase: mostrar cuenta y rol vigente en el encabezado del panel. Aplicar la paleta cuando el cliente la entregue.
