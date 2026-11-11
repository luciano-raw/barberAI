# BarberAI

MVP SaaS para barberías independientes en Chile. Clientes por WhatsApp; gestión interna desde web. Desarrollo individual, iteraciones cortas y datos separados por tenant.

## Estado

Etapa 0 preparada. Etapa 1 en desarrollo: login/logout SSR, membresías y vistas de consulta implementadas. SQL **no ejecutado ni validado en Supabase**. Sin escrituras operacionales ni conexiones Meta/OpenRouter.

## Desarrollo local

Requiere Node.js 22.13+ y npm (por los requisitos de las herramientas de lint). Desde esta carpeta:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abrir http://localhost:3000: redirige a /ingresar. El formulario indica si falta configuración. No poner secretos en variables NEXT_PUBLIC_. No subir .env.local ni datos de clientes.

Acceso en /ingresar. /panel lista las barberías autorizadas con resumen, agenda en tabla, clientes, equipo, servicios y actividad. Consultas reales bajo RLS; falta probar con Supabase configurado. Barberos no acceden a clientes ni actividad.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

El lockfile fija las versiones resueltas; usar npm ci en instalaciones posteriores. Ver docs/VALIDACION.md para resultados de esta iteración.

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [Plan de desarrollo](docs/PLAN_DESARROLLO.md)
- [Checklist verificable](docs/CHECKLIST_MVP.md)
- [Configuración de Supabase](docs/SUPABASE_SETUP.md)
- [Preparación de WhatsApp](docs/WHATSAPP_TEST_SETUP.md)

Sin despliegue, servicios remotos ni migraciones ejecutadas. GitHub privado y proyectos externos los configura el propietario.
