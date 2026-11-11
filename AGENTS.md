# Instrucciones persistentes

- Producto: SaaS multi-barbería, español de Chile, zona America/Santiago, moneda CLP entera.
- Trabajar por iteraciones; respetar docs/PLAN_DESARROLLO.md. No implementar todo el MVP en una iteración.
- Next.js App Router, React, TypeScript estricto, Tailwind v4, shadcn/ui, Supabase Auth/Postgres/Storage, @supabase/ssr, Zod, OpenRouter y API oficial WhatsApp.
- Separar transporte HTTP, servicios de negocio, repositorios y adaptadores. Evitar abstracciones vacías.
- Todo dato operacional debe tener tenant_id. Relaciones entre entidades usan FK compuestas por tenant_id e id. Autorización siempre en servidor y RLS.
- Obtener usuario de sesión verificada; comprobar membresía actual y estado del tenant. Nunca confiar en tenant o rol enviados por cliente/agente.
- service_role solo en servidor, en operaciones explícitas mínimas. No reemplazar autorización de usuarios por esta clave.
- Agente sin SQL ni acceso directo a BD. Herramientas con Zod, autorización, reglas y auditoría. Cambios monetarios, precios y mensajes masivos requieren aprobación autorizada.
- Webhooks: verificar firma sobre cuerpo crudo antes de procesar; idempotencia durable. Reservas: transacción y exclusión de solapamientos en BD.
- No crear servicios remotos, ejecutar migraciones remotas, publicar ni desplegar sin instrucción explícita. El humano crea Supabase/GitHub/Meta y ejecuta SQL.
- No guardar secretos ni datos personales reales en Git o logs. Auditar con metadatos mínimos.
- No agregar servicios pagados ni dependencias importantes sin justificar.
- Antes de cerrar cada iteración ejecutar lint, typecheck y build; registrar resultados reales y limitaciones en docs/VALIDACION.md, actualizar checklist y acciones manuales. No marcar funcionalidad como lista si solo existe UI.
- Excluidos: inventario, contabilidad, conciliación bancaria, facturación, suscripciones, campañas avanzadas, fidelización, predicción, multisucursal, apps nativas y constructor visual.
