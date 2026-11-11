import { Button } from "@/components/ui/button";
const steps = [
  ["01", "Base de la aplicación", "Next.js, TypeScript y sistema visual preparados.", "Preparado"],
  ["02", "Seguridad y datos", "Diseño SQL inicial. Falta ejecutar y verificar en Supabase.", "Pendiente"],
  ["03", "Operación de la barbería", "Equipo, servicios, clientes y agenda en las próximas iteraciones.", "Próximamente"],
];
export default function Home() {
  return <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
    <aside className="border-b border-border bg-white p-6 md:min-h-screen md:border-r">
      <div className="text-2xl font-bold tracking-tight">Barber<span className="text-primary">AI</span></div>
      <p className="mt-1 text-xs text-slate-500">Gestión para barberías</p>
      <nav aria-label="Navegación principal" className="mt-10"><a href="#estado" className="block rounded-lg bg-muted px-4 py-3 text-sm font-semibold text-primary">Inicio del proyecto</a></nav>
      <p className="mt-8 text-xs leading-5 text-slate-500">Entorno de desarrollo<br />Etapa 0 · Inicialización</p>
    </aside>
    <main id="estado" className="mx-auto w-full max-w-6xl px-6 py-10 md:px-12 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6"><p className="text-sm text-slate-500">Espacio de trabajo / Fundamentos</p><span className="rounded-full border border-border bg-white px-3 py-1 text-xs">Sin servicios conectados</span></div>
      <section className="py-12"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Construyendo la base</p><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Tu barbería, en orden.</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Este es el punto de partida de BarberAI. Primero aseguramos los datos y los permisos; después conectaremos la agenda y el asistente de WhatsApp.</p><div className="mt-7"><Button asChild><a href="/ingresar">Ingresar al panel <span aria-hidden="true">↗</span></a></Button></div></section>
      <section aria-label="Estado de preparación" className="grid gap-4 lg:grid-cols-3">{steps.map(([number, title, detail, status]) => <article key={number} className="rounded-xl border border-border bg-white p-6"><div className="flex justify-between text-xs"><span className="font-mono text-slate-400">{number}</span><span className="text-primary">{status}</span></div><h2 className="mt-8 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p></article>)}</section>
      <section id="siguiente" className="mt-8 rounded-xl border border-border p-6"><h2 className="font-semibold">Siguiente paso: conectar Supabase</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Crea el proyecto de desarrollo y sigue docs/SUPABASE_SETUP.md. El acceso y las vistas de consulta están preparados. Falta configurar la clave publicable, ejecutar el esquema y comprobar el aislamiento.</p></section>
      <p className="mt-8 text-xs text-slate-500">Pantalla de preparación. No muestra datos operacionales ni permite gestionar barberías.</p>
    </main>
  </div>;
}
