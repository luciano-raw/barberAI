# Módulos del backend

Crear cada módulo cuando se implemente, evitando servicios vacíos: tenants, identity, scheduling, bookings, customers, commissions, daily-closings, agent, whatsapp, approvals, audit y jobs.

Cada módulo usa schemas.ts (Zod), service.ts (reglas), repository.ts (persistencia) y types.ts si es necesario. Las rutas en app/api solo adaptan HTTP. No importar repositorios desde componentes cliente. Los adaptadores externos viven en src/integrations y se incorporarán en su etapa.
